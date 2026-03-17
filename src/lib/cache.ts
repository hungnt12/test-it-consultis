/**
 * Cache đơn giản in-memory cho API routes.
 * Dùng để Pre-fetch + cache từng item/type, tránh gọi PokeAPI lặp lại.
 */

const cache = new Map<string, { data: unknown; ts: number }>();
const TTL_MS = 1000 * 60 * 10; // 10 phút

function isExpired(ts: number): boolean {
  return Date.now() - ts > TTL_MS;
}

export function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry || isExpired(entry.ts)) return null;
  return entry.data as T;
}

export function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, ts: Date.now() });
}

export function getOrFetch<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const cached = getCached<T>(key);
  if (cached !== null) return Promise.resolve(cached);
  return fetcher().then((data) => {
    setCache(key, data);
    return data;
  });
}
