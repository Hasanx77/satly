// Basit bellek-içi hız sınırlayıcı (rate limit).
// Tek örnek (instance) için yeterlidir. Ölçekli üretimde Upstash Redis'e taşınmalı.

type Entry = { count: number; reset: number };

const store = new Map<string, Entry>();
const WINDOW_MS = 60_000; // 1 dakika
const LIMIT = 20; // pencere başına istek

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  reset: number;
  limit: number;
}

export function rateLimit(key: string): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.reset < now) {
    const reset = now + WINDOW_MS;
    store.set(key, { count: 1, reset });
    return { allowed: true, remaining: LIMIT - 1, reset, limit: LIMIT };
  }

  if (entry.count >= LIMIT) {
    return { allowed: false, remaining: 0, reset: entry.reset, limit: LIMIT };
  }

  entry.count += 1;
  return { allowed: true, remaining: LIMIT - entry.count, reset: entry.reset, limit: LIMIT };
}

// Map'in sınırsız büyümesini önlemek için ara ara temizlik.
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [k, v] of store) {
      if (v.reset < now) store.delete(k);
    }
  }, WINDOW_MS).unref?.();
}
