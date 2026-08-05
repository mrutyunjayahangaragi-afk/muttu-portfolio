/**
 * lib/rate-limit.ts — IP-based sliding window rate limiter
 *
 * Provides in-memory rate limiting for API routes to prevent DoS attacks,
 * spam submissions, and resource exhaustion.
 */

interface RateLimitStore {
  timestamps: number[]
}

const tracker = new Map<string, RateLimitStore>()

// Periodically clean up stale entries every 5 minutes to prevent memory leaks
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now()
    tracker.forEach((store, key) => {
      // Remove timestamps older than 1 hour
      const fresh = store.timestamps.filter((ts) => now - ts < 3600000)
      if (fresh.length === 0) {
        tracker.delete(key)
      } else {
        tracker.set(key, { timestamps: fresh })
      }
    })
  }, 300000)
}

export interface RateLimitResult {
  success: boolean
  remaining: number
  resetMs: number
}

/**
 * Enforces a sliding-window rate limit for a given key (e.g. client IP + route).
 *
 * @param key Unique identifier for the client (e.g., `ip:contact`)
 * @param limit Maximum number of allowed requests per window
 * @param windowMs Window duration in milliseconds (default: 60000 ms / 1 minute)
 */
export function checkRateLimit(
  key: string,
  limit: number = 10,
  windowMs: number = 60000
): RateLimitResult {
  const now = Date.now()
  const windowStart = now - windowMs

  const currentStore = tracker.get(key) || { timestamps: [] }
  // Filter out timestamps outside the active window
  const validTimestamps = currentStore.timestamps.filter((ts) => ts > windowStart)

  if (validTimestamps.length >= limit) {
    const oldestInWindow = validTimestamps[0]
    const resetMs = Math.max(0, oldestInWindow + windowMs - now)
    return {
      success: false,
      remaining: 0,
      resetMs,
    }
  }

  validTimestamps.push(now)
  tracker.set(key, { timestamps: validTimestamps })

  return {
    success: true,
    remaining: limit - validTimestamps.length,
    resetMs: windowMs,
  }
}
