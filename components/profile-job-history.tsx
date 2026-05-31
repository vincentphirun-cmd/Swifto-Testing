import { getStudentPayoutEstimate } from '@/lib/fees'
import {
  formatCompletionDate,
  type ProfileCompletionJob,
} from '@/lib/profile-completions'

type Props = {
  jobs: ProfileCompletionJob[]
  variant: 'student' | 'lister'
  emptyMessage?: string
}

function RatingBadge({ rating }: { rating: number | null }) {
  if (rating == null) return null
  return (
    <span className="inline-flex items-center gap-1 text-xs text-ink/70">
      <svg className="w-3.5 h-3.5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      {Number(rating).toFixed(1)}
    </span>
  )
}

export function ProfileJobHistoryList({
  jobs,
  variant,
  emptyMessage = 'No completed jobs yet.',
}: Props) {
  if (jobs.length === 0) {
    return <p className="text-sm text-ink/60 italic">{emptyMessage}</p>
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <div key={job.id} className="p-4 rounded-xl border border-ink/15 bg-canvas/50 space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-semibold text-ink">{job.job_name}</h3>
              <p className="text-sm text-ink/70">{formatCompletionDate(job.completed_at)}</p>
              {variant === 'lister' && job.counterpartyName && (
                <p className="text-sm text-ink/60 mt-1">Completed by {job.counterpartyName}</p>
              )}
            </div>
            <div className="text-right shrink-0">
              {variant === 'student' ? (
                <>
                  <span className="text-base font-semibold text-primary">
                    ${getStudentPayoutEstimate(job.price).toFixed(2)}
                  </span>
                  <p className="text-xs text-ink/60">Earned</p>
                </>
              ) : (
                <>
                  <span className="text-base font-semibold text-primary">
                    ${job.price.toFixed(2)}
                  </span>
                  <p className="text-xs text-ink/60">Job cost</p>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
              Completed
            </span>
            {variant === 'student' && job.rating_from_lister != null && (
              <RatingBadge rating={job.rating_from_lister} />
            )}
            {variant === 'lister' && job.rating_from_lister != null && (
              <span className="text-xs text-ink/60 inline-flex items-center gap-1">
                Your rating:
                <RatingBadge rating={job.rating_from_lister} />
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
