'use client'

import { useState } from 'react'
import { getPlatformFee, getStudentPayoutEstimate, getStripeFeeEstimate } from '@/lib/fees'

interface FeeBreakdownProps {
  /** Job price in NZD */
  price: number
  /** Show Stripe estimate in breakdown */
  showStripeEstimate?: boolean
  /** Show payout release note (for student views) */
  showPayoutNote?: boolean
  /** Compact mode for cards (single line + expand) vs full for modal */
  variant?: 'compact' | 'full'
  className?: string
}

export function FeeBreakdown({
  price,
  showStripeEstimate = false,
  showPayoutNote = false,
  variant = 'compact',
  className = '',
}: FeeBreakdownProps) {
  const [expanded, setExpanded] = useState(false)
  const platformFee = getPlatformFee(price)
  const payout = getStudentPayoutEstimate(price)
  const stripeEst = showStripeEstimate ? getStripeFeeEstimate(price) : 0

  return (
    <div className={className}>
      <p className="text-sm font-medium text-ink">You&apos;ll earn</p>
      <p className="text-sm text-ink/80">
        <span className="font-semibold text-primary">${payout.toFixed(2)}</span> after Swifto fees
      </p>
      {showPayoutNote && (
        <p className="text-xs text-ink/60 mt-1">Payouts are released after the lister approves completion.</p>
      )}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="mt-1 text-xs text-primary hover:text-accent transition-colors font-medium"
      >
        {expanded ? 'Hide breakdown' : 'Show fee breakdown'}
      </button>
      {expanded && (
        <div className="mt-2 p-3 bg-canvas/50 rounded-lg border border-ink/10 text-xs space-y-1.5">
          <div className="flex justify-between">
            <span className="text-ink/70">Job price</span>
            <span className="font-medium text-ink">${price.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink/70">Swifto fee</span>
            <span className="font-medium text-ink">−${platformFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between pt-1 border-t border-ink/10">
            <span className="text-ink/70">Estimated payout</span>
            <span className="font-semibold text-primary">${payout.toFixed(2)}</span>
          </div>
          {showStripeEstimate && stripeEst > 0 && (
            <>
              <div className="flex justify-between pt-1">
                <span className="text-ink/70">Payment processing (est.)</span>
                <span className="text-ink/70">~${stripeEst.toFixed(2)}</span>
              </div>
              <p className="text-[10px] text-ink/50 pt-1 italic">
                Payment processing fees are estimated and may vary by payment method.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  )
}
