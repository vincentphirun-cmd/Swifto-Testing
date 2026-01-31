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

  let body: { first_name: string; last_name: string; role: 'lister' | 'student'; university?: string | null }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { first_name, last_name, role, university } = body
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

  const { error: insertError } = await admin.from('profiles').insert({
    id: user.id,
    role,
    first_name,
    last_name,
    university: university ?? null,
  })

  if (insertError) {
    if (insertError.code === '23505') {
      return NextResponse.json({ error: 'Profile already exists' }, { status: 409 })
    }
    console.error('Profile insert error:', insertError)
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
