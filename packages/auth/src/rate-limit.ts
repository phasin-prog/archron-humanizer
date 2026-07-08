interface RateLimitEntry {
  count: number
  resetAt: number
}

const buckets = new Map<string, RateLimitEntry>()

export interface RateLimitOptions {
  key: string
  limit: number
  windowMs: number
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  resetAt: number
}

export function rateLimit(options: RateLimitOptions): RateLimitResult {
  const now = Date.now()
  const entry = buckets.get(options.key)

  if (!entry || entry.resetAt <= now) {
    const resetAt = now + options.windowMs
    buckets.set(options.key, { count: 1, resetAt })
    return { success: true, limit: options.limit, remaining: options.limit - 1, resetAt }
  }

  entry.count++
  const remaining = Math.max(0, options.limit - entry.count)
  const success = entry.count <= options.limit

  return { success, limit: options.limit, remaining, resetAt: entry.resetAt }
}

export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
  }
}
