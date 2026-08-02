import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { ensureAdminRoleForUser, isAdminAccess } from '@/lib/admin-auth'

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization')
    const token = authHeader?.replace(/^Bearer\s+/i, '').trim()
    if (!token) {
      return NextResponse.json({ admin: false }, { status: 200 })
    }
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser(token)
    if (!user) {
      return NextResponse.json({ admin: false }, { status: 200 })
    }

    const adminClient = createAdminClient()
    const { data: profile } = await adminClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = (profile?.role as string | null) ?? null
    const admin = isAdminAccess({ email: user.email, role })
    return NextResponse.json({ admin, role })
  } catch {
    return NextResponse.json({ admin: false }, { status: 200 })
  }
}

/**
 * POST /api/admin/check
 * If the user is in ADMIN_EMAILS, promote profiles.role to admin.
 */
export async function POST(req: NextRequest) {
  try {
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

    const promoted = await ensureAdminRoleForUser(user.id, user.email)
    const adminClient = createAdminClient()
    const { data: profile } = await adminClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = (profile?.role as string | null) ?? null
    const admin = isAdminAccess({ email: user.email, role })
    return NextResponse.json({ admin, role, promoted })
  } catch (e) {
    console.error('admin check POST error:', e)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
