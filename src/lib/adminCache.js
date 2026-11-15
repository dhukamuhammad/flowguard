// Client-side in-memory cache for fast, seamless admin panel navigation
const memoryCache = new Map();
const DEFAULT_TTL_MS = 60 * 1000; // 60 seconds freshness

/**
 * Returns cached data immediately if present and within TTL.
 */
export function getCachedAdminData(url) {
  if (typeof window === "undefined") return null;
  const entry = memoryCache.get(url);
  if (!entry) return null;
  const isFresh = Date.now() - entry.timestamp < (entry.ttl || DEFAULT_TTL_MS);
  return isFresh ? entry.data : null;
}

/**
 * Fetches data with client-side caching.
 * If fresh cached data exists, returns it immediately with zero network latency.
 */
export async function fetchAdminData(url, { ttl = DEFAULT_TTL_MS, force = false } = {}) {
  const now = Date.now();
  const entry = memoryCache.get(url);

  if (!force && entry && now - entry.timestamp < (entry.ttl || ttl)) {
    return entry.data;
  }

  const res = await fetch(url, { cache: "no-store" });
  const data = await res.json();

  if (res.ok && data?.success) {
    memoryCache.set(url, {
      data,
      timestamp: now,
      ttl,
    });
  }

  return data;
}

/**
 * Invalidates cached URLs matching a specific keyword or clears all.
 */
export function invalidateAdminCache(pattern) {
  if (!pattern) {
    memoryCache.clear();
    return;
  }
  for (const key of memoryCache.keys()) {
    if (key.includes(pattern)) {
      memoryCache.delete(key);
    }
  }
}

