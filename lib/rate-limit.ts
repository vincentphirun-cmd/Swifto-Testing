type Bucket = { hits: number[]; windowMs: number; max: number }

const buckets = new Map<string, Bucket>()

function prune(hits: number[], windowMs: number, now: number) {
  const cutoff = now - windowMs
  while (hits.length > 0 && hits[0] < cutoff) hits.shift()
}

/**
 * In-memory sliding window limiter (per server instance).
 * Good extra defence on Vercel; enable Supabase Auth rate limits too.
 */
export function rateLimit(
  key: string,
  max: number,
  windowMs: number
): { ok: true } | { ok: false; retryAfterSec: number } {
  const now = Date.now()
  let bucket = buckets.get(key)
  if (!bucket) {
    bucket = { hits: [], windowMs, max }
    buckets.set(key, bucket)
  }
  prune(bucket.hits, windowMs, now)
  if (bucket.hits.length >= max) {
    const retryAfterSec = Math.max(1, Math.ceil((bucket.hits[0] + windowMs - now) / 1000))
    return { ok: false, retryAfterSec }
  }
  bucket.hits.push(now)
  return { ok: true }
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim()
    if (first) return first
  }
  const realIp = req.headers.get('x-real-ip')?.trim()
  if (realIp) return realIp
  return 'unknown'
}
