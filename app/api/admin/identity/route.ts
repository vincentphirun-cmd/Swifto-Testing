import { NextRequest, NextResponse } from 'next/server'
import { requireAdminUser } from '@/lib/admin-auth'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * GET /api/admin/identity?status=pending|verified|rejected|all
 */
export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdminUser(req)
    if (auth instanceof NextResponse) return auth

    const status = req.nextUrl.searchParams.get('status') || 'pending'
    const admin = createAdminClient()

    let query = admin
      .from('lister_identity_submissions')
      .select(
        'id, user_id, legal_full_name, date_of_birth, document_type, document_number, address_line, document_paths, status, admin_notes, created_at, reviewed_at'
      )
      .order('created_at', { ascending: true })
      .limit(100)

    if (status !== 'all') {
      query = query.eq('status', status)
    }

    const { data: submissions, error } = await query
    if (error) {
      console.error('Admin identity list error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const rows = submissions ?? []
    const userIds = Array.from(new Set(rows.map((r) => r.user_id as string)))
    let profilesMap: Record<string, { first_name: string; last_name: string }> = {}
    if (userIds.length) {
      const { data: profiles } = await admin
        .from('profiles')
        .select('id, first_name, last_name')
        .in('id', userIds)
      for (const p of profiles ?? []) {
        profilesMap[p.id] = { first_name: p.first_name, last_name: p.last_name }
      }
    }

    return NextResponse.json({
      submissions: rows.map((r) => ({
        ...r,
        profile: profilesMap[r.user_id as string] ?? null,
      })),
    })
  } catch (e) {
    console.error('Admin identity GET error:', e)
    return NextResponse.json({ error: 'Failed to load submissions' }, { status: 500 })
  }
}

/**
 * POST /api/admin/identity
 * Body: { submission_id, action: 'approve' | 'reject', admin_notes? }
 */
export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdminUser(req)
    if (auth instanceof NextResponse) return auth
    const { user } = auth

    const body = await req.json()
    const submissionId = String(body?.submission_id ?? '').trim()
    const action = String(body?.action ?? '').trim()
    const adminNotes = String(body?.admin_notes ?? '').trim() || null

    if (!submissionId || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const admin = createAdminClient()
    const { data: submission, error: fetchErr } = await admin
      .from('lister_identity_submissions')
      .select('id, user_id, status')
      .eq('id', submissionId)
      .single()

    if (fetchErr || !submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }
    if (submission.status !== 'pending') {
      return NextResponse.json({ error: 'Submission already reviewed' }, { status: 400 })
    }

    const newStatus = action === 'approve' ? 'verified' : 'rejected'
    const now = new Date().toISOString()

    const { error: updateSubErr } = await admin
      .from('lister_identity_submissions')
      .update({
        status: newStatus,
        admin_notes: adminNotes,
        reviewed_at: now,
        reviewed_by: user.id,
        updated_at: now,
      })
      .eq('id', submissionId)

    if (updateSubErr) {
      console.error('Admin identity update sub error:', updateSubErr)
      return NextResponse.json({ error: 'Failed to update submission' }, { status: 500 })
    }

    const { error: updateProfileErr } = await admin
      .from('profiles')
      .update({ identity_status: newStatus })
      .eq('id', submission.user_id)

    if (updateProfileErr) {
      console.error('Admin identity update profile error:', updateProfileErr)
      return NextResponse.json({ error: 'Failed to update profile status' }, { status: 500 })
    }

    return NextResponse.json({ ok: true, status: newStatus })
  } catch (e) {
    console.error('Admin identity POST error:', e)
    return NextResponse.json({ error: 'Failed to review submission' }, { status: 500 })
  }
}
