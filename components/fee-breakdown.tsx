'use client'

import { useState } from 'react'
import {
  getJobPayoutBreakdown,
  getStripeFeeEstimate,
  FEE_CONFIG,
} from '@/lib/fees'

interface FeeBreakdownProps {
  /** Job price in NZD (GST-inclusive) */
  price: number
  /** Student GST registration status (affects flat-rate credit) */
  gstRegistered?: boolean
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
  gstRegistered = false,
  showStripeEstimate = false,
  showPayoutNote = false,
  variant = 'compact',
  className = '',
}: FeeBreakdownProps) {
  const [expanded, setExpanded] = useState(variant === 'full')
  const {
    gstInJob,
    serviceExGst,
    flatRateCredit,
    swiftoFee,
    studentPayout,
  } = getJobPayoutBreakdown(price, { gstRegistered })
  const stripeEst = showStripeEstimate ? getStripeFeeEstimate(price) : 0
  const swiftoPct = (FEE_CONFIG.SWIFTO_FEE_RATE * 100).toFixed(1)

  return (
    <div className={className}>
      <p className="text-sm font-medium text-ink">You&apos;ll earn</p>
      <p className="text-sm text-ink/80">
        <span className="font-semibold text-primary">${studentPayout.toFixed(2)}</span> after fees
      </p>
      {showPayoutNote && (
        <p className="text-xs text-ink/60 mt-1">Payouts are released after both parties verify completion.</p>
      )}
      {variant === 'compact' && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="mt-1 text-xs text-primary hover:text-accent transition-colors font-medium"
        >
          {expanded ? 'Hide breakdown' : 'Show fee breakdown'}
        </button>
      )}
      {expanded && (
        <div className="mt-2 p-3 bg-canvas/50 rounded-lg border border-ink/10 text-xs space-y-1.5">
          <div className="flex justify-between">
            <span className="text-ink/70">Job price (incl. GST)</span>
            <span className="font-medium text-ink">${price.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink/70">GST in job price</span>
            <span className="font-medium text-ink">${gstInJob.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink/70">Service value (ex GST)</span>
            <span className="font-medium text-ink">${serviceExGst.toFixed(2)}</span>
          </div>
          {flatRateCredit > 0 && (
            <div className="flex justify-between">
              <span className="text-ink/70">Flat-rate credit</span>
              <span className="font-medium text-green-700">+${flatRateCredit.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-ink/70">Swifto fee ({swiftoPct}%)</span>
            <span className="font-medium text-ink">−${swiftoFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between pt-1 border-t border-ink/10">
            <span className="text-ink/70">Your earnings</span>
            <span className="font-semibold text-primary">${studentPayout.toFixed(2)}</span>
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
