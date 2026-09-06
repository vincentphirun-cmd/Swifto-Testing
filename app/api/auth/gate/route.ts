import { NextResponse } from 'next/server'
import { getClientIp, rateLimit } from '@/lib/rate-limit'
import { verifyTurnstileToken } from '@/lib/turnstile'

const LIMITS = {
  login: { max: 8, windowMs: 10 * 60 * 1000 },
  signup: { max: 5, windowMs: 15 * 60 * 1000 },
  reset: { max: 5, windowMs: 15 * 60 * 1000 },
} as const

type Action = keyof typeof LIMITS

/**
 * POST /api/auth/gate
 * Rate-limit + optional Turnstile check before client-side Supabase auth.
 */
export async function POST(request: Request) {
  let body: { action?: string; email?: string; turnstileToken?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const action = body.action as Action
  if (!action || !(action in LIMITS)) {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  }

  const ip = getClientIp(request)
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const limit = LIMITS[action]

  const ipLimit = rateLimit(`auth:${action}:ip:${ip}`, limit.max, limit.windowMs)
  if (!ipLimit.ok) {
    return NextResponse.json(
      { error: 'Too many attempts. Please wait and try again.' },
      { status: 429, headers: { 'Retry-After': String(ipLimit.retryAfterSec) } }
    )
  }

  if (email) {
    const emailLimit = rateLimit(`auth:${action}:email:${email}`, limit.max, limit.windowMs)
    if (!emailLimit.ok) {
      return NextResponse.json(
        { error: 'Too many attempts. Please wait and try again.' },
        { status: 429, headers: { 'Retry-After': String(emailLimit.retryAfterSec) } }
      )
    }
  }

  const turnstileOk = await verifyTurnstileToken(body.turnstileToken)
  if (!turnstileOk) {
    return NextResponse.json({ error: 'Bot check failed. Please try again.' }, { status: 400 })
  }

  return NextResponse.json({ ok: true })
}
