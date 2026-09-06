import type { SupabaseClient } from '@supabase/supabase-js'
import { PUBLIC_JOBS_TABLE, PUBLIC_PROFILES_TABLE } from './security-constants'

export type PublicProfile = {
  id: string
  first_name: string
  last_name: string
  university?: string | null
  rating?: number | null
  total_jobs?: number | null
  member_since?: string | null
  avatar_url?: string | null
}

export async function fetchPublicProfiles(
  supabase: SupabaseClient,
  ids: string[],
  columns = 'id, first_name, last_name'
): Promise<PublicProfile[]> {
  if (ids.length === 0) return []

  const fromView = await supabase.from(PUBLIC_PROFILES_TABLE).select(columns).in('id', ids)
  if (!fromView.error) return (fromView.data ?? []) as unknown as PublicProfile[]

  const fromTable = await supabase.from('profiles').select(columns).in('id', ids)
  return (fromTable.data ?? []) as unknown as PublicProfile[]
}

export type JobDetail = {
  id: string
  job_name: string
  category: string
  size_or_time: string
  address: string | null
  area: string
  price: number
  completion_date: string | null
  is_flexible: boolean
  start_time: string | null
  urgent_rebook_until: string | null
  lister_id: string
  status: string
  created_at?: string
}

const FULL_JOB_COLUMNS =
  'id, job_name, category, size_or_time, address, area, price, completion_date, is_flexible, start_time, urgent_rebook_until, lister_id, status, created_at'

const PUBLIC_JOB_COLUMNS =
  'id, job_name, category, size_or_time, area, price, completion_date, is_flexible, start_time, urgent_rebook_until, lister_id, status, created_at'

/** Full job rows the caller is allowed to see, plus public (no-address) rows for the rest. */
export async function fetchJobsByIds(
  supabase: SupabaseClient,
  jobIds: string[]
): Promise<JobDetail[]> {
  if (jobIds.length === 0) return []

  const map = new Map<string, JobDetail>()
  const { data: full } = await supabase.from('jobs').select(FULL_JOB_COLUMNS).in('id', jobIds)
  for (const row of full ?? []) {
    map.set(row.id, { ...row, address: row.address ?? null })
  }

  const missing = jobIds.filter((id) => !map.has(id))
  if (missing.length > 0) {
    const { data: pub } = await supabase.from(PUBLIC_JOBS_TABLE).select(PUBLIC_JOB_COLUMNS).in('id', missing)
    for (const row of pub ?? []) {
      map.set(row.id, { ...row, address: null })
    }
  }

  return jobIds.map((id) => map.get(id)).filter((row): row is JobDetail => Boolean(row))
}

export function jobLocationLabel(opts: {
  status?: string | null
  address?: string | null
  area?: string | null
}): string {
  if (opts.status === 'accepted' && opts.address?.trim()) return opts.address.trim()
  return opts.area?.trim() || '—'
}
