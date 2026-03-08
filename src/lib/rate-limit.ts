type RateEntry = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, RateEntry>();

export function hitRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { limited: false, remaining: limit - 1 };
  }

  bucket.count += 1;
  if (bucket.count > limit) {
    return { limited: true, remaining: 0 };
  }

  return { limited: false, remaining: limit - bucket.count };
}
