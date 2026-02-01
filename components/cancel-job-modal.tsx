'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  CANCEL_REASONS,
  getCancelConsequence,
  type CancelReason,
} from '@/lib/cancellation-policy'

type Props = {
  jobName: string
  listerName: string
  startTime: Date | null
  onClose: () => void
  onConfirm: (reason: CancelReason) => Promise<void>
}

export function CancelJobModal({ jobName, listerName, startTime, onClose, onConfirm }: Props) {
  const [reason, setReason] = useState<CancelReason | ''>('')
  const [step, setStep] = useState<'contact' | 'cancel'>('contact')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const consequence = reason ? getCancelConsequence(startTime, reason as CancelReason) : null

  const handleConfirm = async () => {
    if (!reason) return
    setError(null)
    setSubmitting(true)
    try {
      await onConfirm(reason as CancelReason)
      onClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to cancel')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <h2 className="text-xl font-bold text-ink mb-2">
          {step === 'contact' ? 'Need to cancel?' : 'Cancel job'}
        </h2>

        {step === 'contact' ? (
          <>
            <p className="text-ink/80 mb-4">
              Try contacting the lister first—many issues can be resolved without cancelling.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href={`/contact?context=cancel&job=${encodeURIComponent(jobName)}`}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-secondary transition-colors"
              >
                Contact lister
              </Link>
              <button
                onClick={() => setStep('cancel')}
                className="px-4 py-3 border border-ink/30 text-ink rounded-xl font-medium hover:bg-ink/5 transition-colors"
              >
                Continue to cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-ink/70 mb-4">Job: {jobName}</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-2">Reason for cancelling *</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value as CancelReason | '')}
                  className="w-full px-4 py-3 rounded-xl border border-ink/20 text-ink focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                >
                  <option value="">Select a reason</option>
                  {CANCEL_REASONS.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              {consequence && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <p className="text-sm font-medium text-amber-900">{consequence.message}</p>
                  <Link
                    href="/settings/cancellation-policy"
                    className="text-xs text-amber-700 underline mt-1 inline-block"
                  >
                    View full cancellation policy
                  </Link>
                </div>
              )}

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 border border-ink/30 text-ink rounded-xl font-medium hover:bg-ink/5"
                >
                  Keep job
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={!reason || submitting}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Cancelling…' : 'Confirm cancel'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
