import { createClient } from '@/lib/supabase/client'
import { getStudentPayoutEstimate } from '@/lib/fees'

export type ProfileCompletionJob = {
  id: string
  job_id: string
  completed_at: string
  rating_from_lister: number | null
  rating_from_student: number | null
  job_name: string
  price: number
  category: string | null
  counterpartyName: string | null
}

type CompletionRow = {
  id: string
  job_id: string
  lister_id: string
  student_id: string
  completed_at: string
  rating_from_lister: number | null
  rating_from_student: number | null
  lister_verified_at: string | null
  student_verified_at: string | null
}

function formatName(first: string, last: string): string {
  return [first, last].filter(Boolean).join(' ').trim() || '—'
}

async function loadJobsAndNames(
  completions: CompletionRow[],
  counterpartyKey: 'lister_id' | 'student_id'
): Promise<ProfileCompletionJob[]> {
  if (completions.length === 0) return []

  const supabase = createClient()
  const jobIds = completions.map((c) => c.job_id)
  const counterpartyIds = Array.from(new Set(completions.map((c) => c[counterpartyKey])))

  const [{ data: jobsData }, { data: profData }] = await Promise.all([
    supabase.from('jobs').select('id, job_name, price, category').in('id', jobIds),
    supabase.from('profiles').select('id, first_name, last_name').in('id', counterpartyIds),
  ])

  const jobsMap: Record<string, { job_name: string; price: number; category: string | null }> = {}
  for (const j of jobsData ?? []) {
    jobsMap[j.id] = { job_name: j.job_name, price: j.price, category: j.category ?? null }
  }

  const profMap: Record<string, string> = {}
  for (const p of profData ?? []) {
    profMap[p.id] = formatName(p.first_name, p.last_name)
  }

  return completions.map((c) => {
    const job = jobsMap[c.job_id]
    return {
      id: c.id,
      job_id: c.job_id,
      completed_at: c.completed_at,
      rating_from_lister: c.rating_from_lister,
      rating_from_student: c.rating_from_student,
      job_name: job?.job_name ?? 'Unknown job',
      price: Number(job?.price ?? 0),
      category: job?.category ?? null,
      counterpartyName: profMap[c[counterpartyKey]] ?? null,
    }
  })
}

/** Student profile: fully completed jobs where they were the student. */
export async function fetchStudentProfileCompletions(
  userId: string
): Promise<ProfileCompletionJob[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from('job_completions')
    .select(
      'id, job_id, lister_id, student_id, completed_at, rating_from_lister, rating_from_student, lister_verified_at, student_verified_at'
    )
    .eq('student_id', userId)
    .not('lister_verified_at', 'is', null)
    .not('student_verified_at', 'is', null)
    .order('completed_at', { ascending: false })

  return loadJobsAndNames((data ?? []) as CompletionRow[], 'lister_id')
}

/** Lister profile: fully completed jobs only (both parties verified). */
export async function fetchListerProfileCompletions(
  userId: string
): Promise<ProfileCompletionJob[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from('job_completions')
    .select(
      'id, job_id, lister_id, student_id, completed_at, rating_from_lister, rating_from_student, lister_verified_at, student_verified_at'
    )
    .eq('lister_id', userId)
    .not('lister_verified_at', 'is', null)
    .not('student_verified_at', 'is', null)
    .order('completed_at', { ascending: false })

  return loadJobsAndNames((data ?? []) as CompletionRow[], 'student_id')
}

export async function fetchStudentGstRegistered(userId: string): Promise<boolean> {
  const supabase = createClient()
  const { data } = await supabase
    .from('profiles')
    .select('gst_registered')
    .eq('id', userId)
    .maybeSingle()
  return data?.gst_registered ?? false
}

export function sumStudentPayoutsFromCompletions(
  jobs: ProfileCompletionJob[],
  gstRegistered = false
): number {
  return jobs.reduce(
    (sum, j) => sum + getStudentPayoutEstimate(j.price, { gstRegistered }),
    0
  )
}

export function formatCompletionDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-NZ', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
