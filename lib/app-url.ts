import type { NextRequest } from 'next/server'

/** Canonical site origin for redirects (Stripe, emails). No trailing slash. */
export function getAppOrigin(req?: NextRequest): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, '')
  if (fromEnv) return fromEnv

  if (req) {
    const origin = req.headers.get('origin')?.trim().replace(/\/$/, '')
    if (origin) return origin
  }

  const vercel = process.env.VERCEL_URL?.trim()
  if (vercel) {
    const host = vercel.replace(/^https?:\/\//, '')
    return `https://${host}`
  }

  return 'http://localhost:3000'
}
