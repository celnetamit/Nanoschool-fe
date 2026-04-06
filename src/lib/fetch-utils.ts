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
    timeoutMs = 25000, // Increased default to 25s
    useCache = options.method === undefined || options.method?.toUpperCase() === 'GET',
    ttlMs = 15000,    // Increased TTL to 15s
    retries = 2,      // Default to 2 retries (3 total attempts)
    retryDelayMs = 2000, // 2s delay between retries
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
    }
    // STALE content is left in the map for recovery if the subsequent fetch fails
  }

  // 2. Request Deduplication (In-Flight checks)
  if (cacheKey && inflightRequests.has(cacheKey)) {
    const sharedPromise = inflightRequests.get(cacheKey)!;
    const res = await sharedPromise;
    return res.clone();
  }

  // 3. Execution (with Timeout & Retry Backoff)
  const executeFetch = async (currentAttempt: number): Promise<Response> => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);

    try {
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
      const isRetryable = currentAttempt < retries;

      if (isRetryable) {
        const delay = retryDelayMs * (currentAttempt + 1);
        console.warn(`[RETRYING] ${url} (Attempt ${currentAttempt + 1}/${retries}). Error: ${error.message}. Delay: ${delay}ms`);
        await new Promise(res => setTimeout(res, delay));
        return executeFetch(currentAttempt + 1);
      }

      // FINAL FAILURE - Attempt [STALE-RECOVERY]
      if (useCache && cacheKey && l1Cache.has(cacheKey)) {
        const staleEntry = l1Cache.get(cacheKey)!;
        console.error(`[STALE-RECOVERY] Fetch failed for ${url} (Error: ${error.message}). Serving stale content from cache.`);
        return new Response(staleEntry.body, {
          status: staleEntry.status,
          statusText: `${staleEntry.statusText} (Shield-Recovered)`,
          headers: new Headers(staleEntry.headers),
        });
      }

      // NO RECOVERY POSSIBLE
      if (error.name === 'AbortError') {
        return new Response(null, {
          status: 504,
          statusText: 'Gateway Timeout (NanoSchool-Shield-Blocked)'
        });
      }

      console.error(`[FETCH-CRITICAL] Network failure for ${url}:`, error.message);
      return new Response(null, {
        status: 500,
        statusText: `Fetch Error: ${error.message || 'Unknown Network Failure'}`
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
    return res.clone();
  } finally {
    inflightRequests.delete(cacheKey);
  }
}
