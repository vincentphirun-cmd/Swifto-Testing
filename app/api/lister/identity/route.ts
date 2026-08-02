import { NextRequest, NextResponse } from 'next/server'
import { requireBearerUser } from '@/lib/stripe/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import {
  LISTER_IDENTITY_DOC_TYPES,
  type ListerIdentityDocType,
} from '@/lib/lister-identity'

/**
 * POST /api/lister/identity/submit
 * Body: legal_full_name, date_of_birth, document_type, document_number?, address_line?, document_paths[]
 * Files must already be uploaded to lister-id-docs/{userId}/...
 */
export async function POST(req: NextRequest) {
  try {
    const auth = await requireBearerUser(req)
    if (auth instanceof NextResponse) return auth
    const { user } = auth

    const body = await req.json()
    const legalFullName = String(body?.legal_full_name ?? '').trim()
    const dateOfBirth = String(body?.date_of_birth ?? '').trim()
    const documentType = String(body?.document_type ?? '').trim() as ListerIdentityDocType
    const documentNumber = String(body?.document_number ?? '').trim() || null
    const addressLine = String(body?.address_line ?? '').trim() || null
    const documentPaths = Array.isArray(body?.document_paths)
      ? body.document_paths.map((p: unknown) => String(p)).filter(Boolean)
      : []

    if (!legalFullName || legalFullName.length < 2) {
      return NextResponse.json({ error: 'Enter your full legal name' }, { status: 400 })
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth)) {
      return NextResponse.json({ error: 'Enter a valid date of birth' }, { status: 400 })
    }
    if (!LISTER_IDENTITY_DOC_TYPES.includes(documentType)) {
      return NextResponse.json({ error: 'Select a valid document type' }, { status: 400 })
    }
    if (!documentPaths.length) {
      return NextResponse.json({ error: 'Upload at least one document image' }, { status: 400 })
    }

    const prefix = `${user.id}/`
    if (!documentPaths.every((p: string) => p.startsWith(prefix))) {
      return NextResponse.json({ error: 'Invalid document paths' }, { status: 400 })
    }

    const admin = createAdminClient()
    const { data: profile } = await admin
      .from('profiles')
      .select('role, identity_status')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'lister') {
      return NextResponse.json({ error: 'Only listers can submit identity verification' }, { status: 403 })
    }
    if (profile.identity_status === 'verified') {
      return NextResponse.json({ error: 'Identity already verified' }, { status: 400 })
    }
    if (profile.identity_status === 'pending') {
      return NextResponse.json(
        { error: 'Your submission is already pending review' },
        { status: 400 }
      )
    }

    const { data: submission, error: insertErr } = await admin
      .from('lister_identity_submissions')
      .insert({
        user_id: user.id,
        legal_full_name: legalFullName,
        date_of_birth: dateOfBirth,
        document_type: documentType,
        document_number: documentNumber,
        address_line: addressLine,
        document_paths: documentPaths,
        status: 'pending',
      })
      .select('id, status, created_at')
      .single()

    if (insertErr || !submission) {
      console.error('Identity submit insert error:', insertErr)
      return NextResponse.json({ error: 'Failed to save submission' }, { status: 500 })
    }

    await admin
      .from('profiles')
      .update({ identity_status: 'pending' })
      .eq('id', user.id)

    return NextResponse.json({ ok: true, submission })
  } catch (e) {
    console.error('Identity submit error:', e)
    return NextResponse.json({ error: 'Failed to submit identity' }, { status: 500 })
  }
}

/**
 * GET /api/lister/identity/status
 */
export async function GET(req: NextRequest) {
  try {
    const auth = await requireBearerUser(req)
    if (auth instanceof NextResponse) return auth
    const { user } = auth

    const admin = createAdminClient()
    const { data: profile } = await admin
      .from('profiles')
      .select('role, identity_status')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'lister') {
      return NextResponse.json({ error: 'Not a lister' }, { status: 403 })
    }

    const { data: latest } = await admin
      .from('lister_identity_submissions')
      .select(
        'id, status, legal_full_name, document_type, admin_notes, created_at, reviewed_at'
      )
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    return NextResponse.json({
      identity_status: profile.identity_status ?? 'unverified',
      latest_submission: latest,
    })
  } catch (e) {
    console.error('Identity status error:', e)
    return NextResponse.json({ error: 'Failed to load status' }, { status: 500 })
  }
}
