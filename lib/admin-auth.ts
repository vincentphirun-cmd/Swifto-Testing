import type { User } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
}

export function isAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false
  return getAdminEmails().includes(email.toLowerCase())
}

/** True if profile role is admin or email is in ADMIN_EMAILS. */
export function isAdminAccess(opts: {
  email?: string | null
  role?: string | null
}): boolean {
  if (opts.role === 'admin') return true
  return isAdminEmail(opts.email)
}

/** Bearer user that must be admin (role or ADMIN_EMAILS). */
export async function requireAdminUser(
  req: NextRequest
): Promise<{ user: User; token: string; role: string | null } | NextResponse> {
  const authHeader = req.headers.get('Authorization')
  const token = authHeader?.replace(/^Bearer\s+/i, '').trim()
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser(token)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = createAdminClient()
  const { data: profile } = await admin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const role = (profile?.role as string | null) ?? null
  if (!isAdminAccess({ email: user.email, role })) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return { user, token, role }
}

/** If email is in ADMIN_EMAILS, ensure profiles.role = 'admin'. */
export async function ensureAdminRoleForUser(userId: string, email: string | undefined | null) {
  if (!isAdminEmail(email)) return false
  const admin = createAdminClient()
  const { data: profile } = await admin.from('profiles').select('role').eq('id', userId).single()
  if (profile?.role === 'admin') return true
  const { error } = await admin.from('profiles').update({ role: 'admin' }).eq('id', userId)
  if (error) {
    console.error('ensureAdminRoleForUser error:', error)
    return false
  }
  return true
}
