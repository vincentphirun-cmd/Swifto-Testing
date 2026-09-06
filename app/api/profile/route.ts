import { NextResponse } from 'next/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { clipText } from '@/lib/clip'
import { getClientIp, rateLimit } from '@/lib/rate-limit'
import { MAX_BIO_LENGTH, MAX_NAME_LENGTH, MAX_TEXT_LENGTH } from '@/lib/security-constants'

function userScopedClient(token: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anon) throw new Error('Missing Supabase env vars')
  return createSupabaseClient(url, anon, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}

async function requireUser(request: Request) {
  const authHeader = request.headers.get('Authorization')
  const token = authHeader?.replace(/^Bearer\s+/i, '').trim()
  if (!token) return { ok: false as const, error: jsonError('Missing Authorization header', 401) }

  const supabase = createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token)
  if (error || !user) return { ok: false as const, error: jsonError('Invalid or expired token', 401) }
  return { ok: true as const, user, token }
}

/**
 * POST /api/profile
 * Creates a profile for the authenticated user.
 */
export async function POST(request: Request) {
  const gated = rateLimit(`profile-create:${getClientIp(request)}`, 8, 10 * 60 * 1000)
  if (!gated.ok) {
    return NextResponse.json(
      { error: 'Too many attempts. Please wait and try again.' },
      { status: 429, headers: { 'Retry-After': String(gated.retryAfterSec) } }
    )
  }

  const auth = await requireUser(request)
  if (!auth.ok) return auth.error
  const user = auth.user

  let body: {
    first_name: string
    last_name: string
    role: 'lister' | 'student'
    university?: string | null
    accepted_terms_of_service_at?: string | null
    accepted_community_guidelines_at?: string | null
    acknowledged_privacy_statement_at?: string | null
  }
  try {
    body = await request.json()
  } catch {
    return jsonError('Invalid JSON body', 400)
  }

  const first_name = clipRequiredName(body.first_name)
  const last_name = clipRequiredName(body.last_name)
  const role = body.role
  const university = clipText(body.university, MAX_TEXT_LENGTH)

  if (!first_name || !role || !['lister', 'student'].includes(role)) {
    return jsonError('Missing or invalid first_name or role', 400)
  }

  let admin
  try {
    admin = createAdminClient()
  } catch (e) {
    console.error('Admin client init failed:', e)
    return jsonError('Server configuration error', 500)
  }

  const now = new Date().toISOString()
  const baseInsert = {
    id: user.id,
    role,
    first_name,
    last_name,
    university: university ?? null,
    identity_status: 'unverified',
  }

  let { error: insertError } = await admin.from('profiles').insert({
    ...baseInsert,
    accepted_terms_of_service_at: body.accepted_terms_of_service_at ? now : null,
    accepted_community_guidelines_at: body.accepted_community_guidelines_at ? now : null,
    acknowledged_privacy_statement_at: body.acknowledged_privacy_statement_at ? now : null,
  })

  if (insertError?.code === 'PGRST204') {
    const fallback = await admin.from('profiles').insert(baseInsert)
    insertError = fallback.error
  }

  if (insertError) {
    if (insertError.code === '23505') {
      return jsonError('Profile already exists', 409)
    }
    console.error('Profile insert error:', insertError)
    return jsonError(insertError.message, 500)
  }

  return NextResponse.json({ ok: true })
}

function clipRequiredName(value: unknown): string {
  return clipText(value, MAX_NAME_LENGTH) ?? ''
}

const PROFILE_PATCH_KEYS = [
  'university',
  'field_of_study',
  'interests',
  'academic_achievements',
  'extracurricular_achievements',
  'location',
  'bio',
  'preferred_job_categories',
  'gst_registered',
  'gst_number',
  'avatar_url',
  'accepted_payment_terms_at',
  'accepted_payout_terms_at',
] as const

/**
 * PATCH /api/profile
 * Allowlisted self-update. Privileged columns are also locked in Postgres.
 */
export async function PATCH(request: Request) {
  const gated = rateLimit(`profile-patch:${getClientIp(request)}`, 30, 10 * 60 * 1000)
  if (!gated.ok) {
    return NextResponse.json(
      { error: 'Too many updates. Please wait and try again.' },
      { status: 429, headers: { 'Retry-After': String(gated.retryAfterSec) } }
    )
  }

  const auth = await requireUser(request)
  if (!auth.ok) return auth.error
  const user = auth.user

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return jsonError('Invalid JSON body', 400)
  }

  const patch: Record<string, unknown> = {}
  for (const key of PROFILE_PATCH_KEYS) {
    if (!(key in body)) continue
    const value = body[key]
    if (key === 'gst_registered') {
      patch[key] = Boolean(value)
      continue
    }
    if (key === 'accepted_payment_terms_at' || key === 'accepted_payout_terms_at') {
      patch[key] = value ? new Date().toISOString() : null
      continue
    }
    if (key === 'avatar_url') {
      const url = clipText(value, 2048)
      patch[key] = url
      continue
    }
    const max = key === 'bio' ? MAX_BIO_LENGTH : MAX_TEXT_LENGTH
    patch[key] = clipText(value, max)
  }

  if (patch.gst_registered === false) {
    patch.gst_number = null
  }

  if (Object.keys(patch).length === 0) {
    return jsonError('No valid fields to update', 400)
  }

  const userDb = userScopedClient(auth.token)
  const { error } = await userDb.from('profiles').update(patch).eq('id', user.id)
  if (error) {
    console.error('Profile patch error:', error)
    return jsonError(error.message, 500)
  }

  return NextResponse.json({ ok: true })
}
