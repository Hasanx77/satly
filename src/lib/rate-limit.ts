

type Entry = { count: number; reset: number };

const store = new Map<string, Entry>();
const WINDOW_MS = 60_000;

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  reset: number;
  limit: number;
}

export function rateLimit(key: string, limit = 20): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.reset < now) {
    const reset = now + WINDOW_MS;
    store.set(key, { count: 1, reset });
    return { allowed: true, remaining: limit - 1, reset, limit };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, reset: entry.reset, limit };
  }

  entry.count += 1;
  return { allowed: true, remaining: limit - entry.count, reset: entry.reset, limit };
}

if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [k, v] of store) {
      if (v.reset < now) store.delete(k);
    }
  }, WINDOW_MS).unref?.();
}
