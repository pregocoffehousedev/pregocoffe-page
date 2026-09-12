import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Si no hay Redis configurado (dev local), no limita.
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? Redis.fromEnv()
    : null

export const limiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '1 m'), // 5 intentos por minuto
      analytics: true,
      prefix: 'pregocoffe:reservar',
    })
  : null

export async function checkRateLimit(ip: string) {
  if (!limiter) return { success: true, remaining: 999 }
  const { success, remaining } = await limiter.limit(ip)
  return { success, remaining }
}

export function getIp(req: Request): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    '127.0.0.1'
  )
}
