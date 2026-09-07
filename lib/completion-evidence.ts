import type { SupabaseClient } from '@supabase/supabase-js'
import {
  COMPLETION_EVIDENCE_MAX_BYTES,
  COMPLETION_EVIDENCE_MAX_PHOTOS,
  COMPLETION_EVIDENCE_MIME_TYPES,
} from '@/lib/security-constants'

export const COMPLETION_EVIDENCE_BUCKET = 'job-completion-evidence'

export type CompletionPhotoRole = 'lister' | 'student'

export type CompletionPhotoRow = {
  id: string
  job_id: string
  uploaded_by: string
  role: CompletionPhotoRole
  storage_path: string
  created_at: string
  url?: string
}

export function validateCompletionPhoto(file: File): string | null {
  if (!(COMPLETION_EVIDENCE_MIME_TYPES as readonly string[]).includes(file.type)) {
    return 'Photos must be JPG, PNG, or WEBP.'
  }
  if (file.size > COMPLETION_EVIDENCE_MAX_BYTES) {
    return 'Each photo must be under 5MB.'
  }
  return null
}

export function evidenceStoragePath(jobId: string, userId: string, file: File) {
  const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg'
  const stamp = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  return `${jobId}/${userId}/${stamp}.${ext}`
}

export async function uploadCompletionPhotos(
  supabase: SupabaseClient,
  jobId: string,
  userId: string,
  role: CompletionPhotoRole,
  files: File[]
): Promise<{ error: string | null }> {
  if (files.length < 1) return { error: 'Add at least one photo of the finished job.' }
  if (files.length > COMPLETION_EVIDENCE_MAX_PHOTOS) {
    return { error: `You can upload up to ${COMPLETION_EVIDENCE_MAX_PHOTOS} photos.` }
  }

  const paths: string[] = []
  for (const file of files) {
    const invalid = validateCompletionPhoto(file)
    if (invalid) return { error: invalid }

    const path = evidenceStoragePath(jobId, userId, file)
    const { error: uploadErr } = await supabase.storage
      .from(COMPLETION_EVIDENCE_BUCKET)
      .upload(path, file, { upsert: false, contentType: file.type })
    if (uploadErr) {
      return { error: uploadErr.message || 'Could not upload photos. Have you run the completion evidence SQL?' }
    }
    paths.push(path)
  }

  const rows = paths.map((storage_path) => ({
    job_id: jobId,
    uploaded_by: userId,
    role,
    storage_path,
  }))
  const { error: insertErr } = await supabase.from('job_completion_photos').insert(rows)
  if (insertErr) {
    return { error: insertErr.message || 'Photos uploaded but could not be saved. Please try again.' }
  }
  return { error: null }
}

export async function fetchSignedCompletionPhotos(
  supabase: SupabaseClient,
  jobIds: string[]
): Promise<Record<string, { lister: CompletionPhotoRow[]; student: CompletionPhotoRow[] }>> {
  const empty: Record<string, { lister: CompletionPhotoRow[]; student: CompletionPhotoRow[] }> = {}
  if (jobIds.length === 0) return empty

  const { data } = await supabase
    .from('job_completion_photos')
    .select('id, job_id, uploaded_by, role, storage_path, created_at')
    .in('job_id', jobIds)
    .order('created_at', { ascending: true })

  const rows = (data ?? []) as CompletionPhotoRow[]
  for (const row of rows) {
    const { data: signed } = await supabase.storage
      .from(COMPLETION_EVIDENCE_BUCKET)
      .createSignedUrl(row.storage_path, 60 * 60)
    row.url = signed?.signedUrl
    if (!empty[row.job_id]) empty[row.job_id] = { lister: [], student: [] }
    if (row.role === 'lister') empty[row.job_id].lister.push(row)
    else empty[row.job_id].student.push(row)
  }
  return empty
}
