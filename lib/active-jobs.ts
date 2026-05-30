export type JobCompletionVerify = {
  job_id: string
  lister_verified_at: string | null
  student_verified_at: string | null
}

export function isJobFullyCompleted(
  jobId: string,
  jobStatus: string | null | undefined,
  completions: JobCompletionVerify[]
): boolean {
  if (jobStatus === 'completed') return true
  const row = completions.find((c) => c.job_id === jobId)
  return !!(row?.lister_verified_at && row?.student_verified_at)
}

export function buildFullyCompletedJobIds(
  completions: JobCompletionVerify[],
  jobStatuses: Record<string, string | null | undefined>
): Set<string> {
  const ids = new Set<string>()
  for (const [jobId, status] of Object.entries(jobStatuses)) {
    if (isJobFullyCompleted(jobId, status, completions)) {
      ids.add(jobId)
    }
  }
  for (const c of completions) {
    if (c.lister_verified_at && c.student_verified_at) {
      ids.add(c.job_id)
    }
  }
  return ids
}
