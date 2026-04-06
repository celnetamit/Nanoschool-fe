/**
 * Advanced Fetch Utilities for Maximum Performance
 * Features: Request Deduplication, SWR L1 Caching, Auto-Retries, Timeout/Abort Protection
 */

export interface FetchOptions extends RequestInit {
  timeoutMs?: number;
  useCache?: boolean;    // Enable fast L1 memory cache (Default: true for GET)
  ttlMs?: number;        // L1 Cache Time-To-Live in milliseconds (Default: 5000ms)
  retries?: number;      // Number of retries on 5xx or timeouts (Default: 1)
  retryDelayMs?: number; // Delay between retries (Default: 500ms)
}

interface CacheEntry {
  status: number;
  statusText: string;
  headers: [string, string][];
  body: string;
  timestamp: number;
}

// Global Maps to persist state across micro-requests in Node.js
const inflightRequests = new Map<string, Promise<Response>>();
const l1Cache = new Map<string, CacheEntry>();

/**
 * Enhanced fetch with enterprise caching, deduplication, and retry logic
 */
export async function fetchWithTimeout(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const {
    timeoutMs = 15000,
    useCache = options.method === undefined || options.method?.toUpperCase() === 'GET',
    ttlMs = 10000,
    retries = 1,
    retryDelayMs = 1000,
    ...fetchOptions
  } = options;

  const isGet = !fetchOptions.method || fetchOptions.method.toUpperCase() === 'GET';
  const cacheKey = isGet ? url : null;

  // 1. Check L1 In-Memory Cache (Instant Resolution)
  if (useCache && cacheKey && l1Cache.has(cacheKey)) {
    const entry = l1Cache.get(cacheKey)!;
    if (Date.now() - entry.timestamp < ttlMs) {

      return new Response(entry.body, {
        status: entry.status,
        statusText: entry.statusText,
        headers: new Headers(entry.headers),
      });
    } else {
      l1Cache.delete(cacheKey); // Evict stale
    }
  }

  // 2. Request Deduplication (In-Flight checks)
  if (cacheKey && inflightRequests.has(cacheKey)) {

    const sharedPromise = inflightRequests.get(cacheKey)!;
    const res = await sharedPromise;
    // We clone the response so both the original caller and the waiting caller can read the body.
    return res.clone();
  }

  // 3. Execution (with Timeout & Retry Backoff)
  const executeFetch = async (currentAttempt: number): Promise<Response> => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);

    try {
      // Keep-alive setup natively configured in Next.js internal dispatcher, 
      // explicitly disabling keepalive here because WordPress PHP-FPM frequently drops connections
      // unexpectedly causing 30-second TCP socket hangs in Node.js.
      const finalFetchOptions: RequestInit = {
        ...fetchOptions,
        signal: controller.signal,
        keepalive: fetchOptions.keepalive ?? false, 
      };

      const response = await fetch(url, finalFetchOptions);

      // Cache successful GETs before returning
      if (response.ok && useCache && cacheKey) {
        const clonedToCache = response.clone();
        clonedToCache.text().then(textBody => {
          const headersArr: [string, string][] = [];
          clonedToCache.headers.forEach((val, key) => headersArr.push([key, val]));
          
          l1Cache.set(cacheKey, {
            status: clonedToCache.status,
            statusText: clonedToCache.statusText,
            headers: headersArr,
            body: textBody,
            timestamp: Date.now(),
          });
        }).catch(err => console.error('[L1-CACHE ERROR] Unable to parse body for cache:', err));
      }

      // If Server Error (5xx), throw to trigger retry
      if (response.status >= 500 && currentAttempt < retries) {
        throw new Error(`Server returned status: ${response.status}`);
      }

      return response;

    } catch (error: any) {
      if (error.name === 'AbortError') {
        if (currentAttempt < retries) {
          console.warn(`[TIMEOUT] Timeout (${timeoutMs}ms) for ${url}. Retrying attempt ${currentAttempt + 1}...`);
          await new Promise(res => setTimeout(res, retryDelayMs * (currentAttempt + 1)));
          return executeFetch(currentAttempt + 1);
        }
        return new Response(null, {
          status: 504,
          statusText: 'Gateway Timeout (NanoSchool-Timeout)'
        });
      }

      if (currentAttempt < retries) {
        console.warn(`[FETCH-ERROR] Error for ${url}: ${error.message}. Retrying attempt ${currentAttempt + 1}...`);
        await new Promise(res => setTimeout(res, retryDelayMs * (currentAttempt + 1)));
        return executeFetch(currentAttempt + 1);
      }

      console.error(`[FETCH-ERROR] Final error for ${url}:`, error);
      return new Response(null, {
        status: 500,
        statusText: `Fetch Error: ${error.message || 'Unknown'}`
      });
    } finally {
      clearTimeout(id);
    }
  };

  // 4. Wrap execution directly for POSTs, or via Deduplication Map for GETs
  if (!cacheKey) {
    return executeFetch(0);
  }

  const fetchPromise = executeFetch(0);
  inflightRequests.set(cacheKey, fetchPromise);
  
  try {
    const res = await fetchPromise;
    // Original caller receives a clone.
    return res.clone();
  } finally {
    // Cleanup inflight map after resolution or failure
    inflightRequests.delete(cacheKey);
  }
}
