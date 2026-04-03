/**
 * Fetch Utilities with Timeout and Abort Support
 */

export interface FetchOptions extends RequestInit {
  timeoutMs?: number;
}

/**
 * Enhanced fetch with timeout protection using AbortController
 */
export async function fetchWithTimeout(
  url: string, 
  options: FetchOptions = {}
): Promise<Response> {
  const { timeoutMs = 15000, ...fetchOptions } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    return response;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.warn(`[TIMEOUT] Fetch limit reached (${timeoutMs}ms) for ${url}`);
      return new Response(null, { 
        status: 504, 
        statusText: 'Gateway Timeout (NanoSchool-Timeout)' 
      });
    }
    console.error(`[FETCH-ERROR] error for ${url}:`, error);
    return new Response(null, { 
      status: 500, 
      statusText: `Fetch Error: ${error.message || 'Unknown'}` 
    });
  } finally {
    clearTimeout(id);
  }
}
