import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { LISTER_ID_DOCS_BUCKET } from '@/lib/lister-identity'
import { getClientIp, rateLimit } from '@/lib/rate-limit'

async function emptyFolder(bucket: string, prefix: string) {
  const admin = createAdminClient()
  const { data: files, error } = await admin.storage.from(bucket).list(prefix, { limit: 1000 })
  if (error) {
    console.error(`Storage list error (${bucket}):`, error)
    return
  }
  const paths = (files ?? [])
    .map((file) => (file.name ? `${prefix}/${file.name}` : null))
    .filter((path): path is string => Boolean(path))
  if (paths.length > 0) {
    const { error: removeError } = await admin.storage.from(bucket).remove(paths)
    if (removeError) console.error(`Storage remove error (${bucket}):`, removeError)
  }
}

/**
 * DELETE /api/account
 * Purges uploads and deletes the authenticated Auth user (cascades profile).
 */
export async function DELETE(request: Request) {
  const gated = rateLimit(`account-delete:${getClientIp(request)}`, 5, 60 * 60 * 1000)
  if (!gated.ok) {
    return NextResponse.json(
      { error: 'Too many attempts. Please wait and try again.' },
      { status: 429, headers: { 'Retry-After': String(gated.retryAfterSec) } }
    )
  }

  const authHeader = request.headers.get('Authorization')
  const token = authHeader?.replace(/^Bearer\s+/i, '').trim()
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { confirm?: string }
  try {
    body = await request.json()
  } catch {
    body = {}
  }
  if (body.confirm !== 'DELETE') {
    return NextResponse.json({ error: 'Type DELETE to confirm account deletion.' }, { status: 400 })
  }

  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser(token)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await emptyFolder('avatars', user.id)
    await emptyFolder(LISTER_ID_DOCS_BUCKET, user.id)
  } catch (e) {
    console.error('Upload purge error:', e)
  }

  try {
    const admin = createAdminClient()
    const { error } = await admin.auth.admin.deleteUser(user.id)
    if (error) {
      console.error('Auth delete error:', error)
      return NextResponse.json({ error: 'Could not delete account. Please contact support.' }, { status: 500 })
    }
  } catch (e) {
    console.error('Account delete error:', e)
    return NextResponse.json({ error: 'Could not delete account. Please contact support.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
