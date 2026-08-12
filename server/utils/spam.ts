import type {H3Event} from 'h3'

const buckets = new Map<string, {count: number; resetAt: number}>()

function clientIp(event: H3Event) {
  const forwarded = getRequestHeader(event, 'x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown'
  return getRequestIP(event, {xForwardedFor: true}) || 'unknown'
}

export function enforceRateLimit(
  event: H3Event,
  {limit = 8, windowMs = 60_000}: {limit?: number; windowMs?: number} = {},
) {
  const ip = clientIp(event)
  const now = Date.now()
  const bucket = buckets.get(ip)

  if (!bucket || now > bucket.resetAt) {
    buckets.set(ip, {count: 1, resetAt: now + windowMs})
    return
  }

  bucket.count += 1
  if (bucket.count > limit) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Too many requests. Please try again in a minute.',
    })
  }
}

export function isHoneypotFilled(body: unknown) {
  if (!body || typeof body !== 'object') return false
  const record = body as Record<string, unknown>
  for (const key of ['website', 'company', '_hp']) {
    const value = record[key]
    if (typeof value === 'string' && value.trim()) return true
  }
  return false
}

/** Rate-limit check; returns true when the request should be silently accepted (bot). */
export function guardPublicForm(event: H3Event, body: unknown) {
  enforceRateLimit(event)
  return isHoneypotFilled(body)
}
