import type { SupabaseClient } from '@supabase/supabase-js'

export type RatingSummary = {
  averageRating: number
  reviewCount: number
}

function round1(n: number): number {
  return Math.round(n * 10) / 10
}

function average(values: number[]): number {
  if (values.length === 0) return 0
  return round1(values.reduce((sum, v) => sum + v, 0) / values.length)
}

export function summarizeRatings(values: (number | null | undefined)[]): RatingSummary {
  const ratings = values
    .map((v) => (v == null ? NaN : Number(v)))
    .filter((n) => Number.isFinite(n))
  return {
    averageRating: average(ratings),
    reviewCount: ratings.length,
  }
}

/** Live average rating for a student or lister from job_completions. */
export async function fetchRatingSummary(
  supabase: SupabaseClient,
  userId: string,
  role: 'student' | 'lister'
): Promise<RatingSummary> {
  const idColumn = role === 'student' ? 'student_id' : 'lister_id'
  const ratingColumn =
    role === 'student' ? 'rating_from_lister' : 'rating_from_student'

  const { data } = await supabase
    .from('job_completions')
    .select(`${ratingColumn}`)
    .eq(idColumn, userId)
    .not(ratingColumn, 'is', null)

  const ratings = (data ?? [])
    .map((row) => Number((row as Record<string, unknown>)[ratingColumn]))
    .filter((n) => Number.isFinite(n))

  return {
    averageRating: average(ratings),
    reviewCount: ratings.length,
  }
}

/** Batch live student ratings for applicant cards (jobs-listed). */
export async function fetchStudentRatingSummariesBatch(
  supabase: SupabaseClient,
  studentIds: string[]
): Promise<Record<string, RatingSummary>> {
  const result: Record<string, RatingSummary> = {}
  for (const id of studentIds) {
    result[id] = { averageRating: 0, reviewCount: 0 }
  }
  if (studentIds.length === 0) return result

  const { data } = await supabase
    .from('job_completions')
    .select('student_id, rating_from_lister')
    .in('student_id', studentIds)
    .not('rating_from_lister', 'is', null)

  const byStudent: Record<string, number[]> = {}
  for (const row of data ?? []) {
    const rating = Number(row.rating_from_lister)
    if (!Number.isFinite(rating)) continue
    const arr = byStudent[row.student_id] ?? []
    arr.push(rating)
    byStudent[row.student_id] = arr
  }

  for (const id of studentIds) {
    const ratings = byStudent[id] ?? []
    result[id] = {
      averageRating: average(ratings),
      reviewCount: ratings.length,
    }
  }

  return result
}
