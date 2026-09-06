import type { Session } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

export type ProfilePatch = {
  university?: string | null
  field_of_study?: string | null
  interests?: string | null
  academic_achievements?: string | null
  extracurricular_achievements?: string | null
  location?: string | null
  bio?: string | null
  preferred_job_categories?: string | null
  gst_registered?: boolean
  gst_number?: string | null
  avatar_url?: string | null
  accepted_payment_terms_at?: string | null
  accepted_payout_terms_at?: string | null
}

export async function getAccessToken(): Promise<string | null> {
  const supabase = createClient()
  const { data } = await supabase.auth.getSession()
  return data.session?.access_token ?? null
}

export async function patchOwnProfile(
  payload: ProfilePatch,
  session?: Session | null
): Promise<{ ok: true } | { ok: false; error: string }> {
  const token = session?.access_token ?? (await getAccessToken())
  if (!token) return { ok: false, error: 'Please log in again.' }

  const res = await fetch('/api/profile', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  if (res.ok) return { ok: true }
  const data = await res.json().catch(() => ({}))
  return { ok: false, error: typeof data.error === 'string' ? data.error : 'Failed to save' }
}
