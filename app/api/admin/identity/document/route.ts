import { NextRequest, NextResponse } from 'next/server'
import { requireAdminUser } from '@/lib/admin-auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { LISTER_ID_DOCS_BUCKET } from '@/lib/lister-identity'

/**
 * GET /api/admin/identity/document?path=...
 * Returns a short-lived signed URL for a private ID document.
 */
export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdminUser(req)
    if (auth instanceof NextResponse) return auth

    const path = req.nextUrl.searchParams.get('path')?.trim()
    if (!path || path.includes('..')) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
    }

    const admin = createAdminClient()
    const { data, error } = await admin.storage
      .from(LISTER_ID_DOCS_BUCKET)
      .createSignedUrl(path, 60 * 10)

    if (error || !data?.signedUrl) {
      console.error('Signed URL error:', error)
      return NextResponse.json({ error: 'Could not create document URL' }, { status: 500 })
    }

    return NextResponse.json({ url: data.signedUrl })
  } catch (e) {
    console.error('Admin identity document error:', e)
    return NextResponse.json({ error: 'Failed to load document' }, { status: 500 })
  }
}
