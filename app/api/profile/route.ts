import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

/**
 * POST /api/profile
 * Creates a profile for the authenticated user. Uses the JWT in the
 * Authorization header to verify identity, then creates the profile via
 * the service-role client (bypasses RLS). Used when signup returns a
 * session immediately (no email confirmation).
 */
export async function POST(request: Request) {
  const authHeader = request.headers.get('Authorization')
  const token = authHeader?.replace(/^Bearer\s+/i, '').trim()
  if (!token) {
    return NextResponse.json({ error: 'Missing Authorization header' }, { status: 401 })
  }

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
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const {
    first_name,
    last_name,
    role,
    university,
    accepted_terms_of_service_at,
    accepted_community_guidelines_at,
    acknowledged_privacy_statement_at,
  } = body
  if (!first_name || !last_name || !role || !['lister', 'student'].includes(role)) {
    return NextResponse.json(
      { error: 'Missing or invalid first_name, last_name, or role' },
      { status: 400 }
    )
  }

  const supabase = createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser(token)
  if (userError || !user) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
  }

  let admin
  try {
    admin = createAdminClient()
  } catch (e) {
    console.error('Admin client init failed:', e)
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
  }

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
    accepted_terms_of_service_at: accepted_terms_of_service_at ?? null,
    accepted_community_guidelines_at: accepted_community_guidelines_at ?? null,
    acknowledged_privacy_statement_at: acknowledged_privacy_statement_at ?? null,
  })

  if (insertError?.code === 'PGRST204') {
    const fallback = await admin.from('profiles').insert(baseInsert)
    insertError = fallback.error
  }

  if (insertError) {
    if (insertError.code === '23505') {
      return NextResponse.json({ error: 'Profile already exists' }, { status: 409 })
    }
    console.error('Profile insert error:', insertError)
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
