'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { captureEvent } from '@/lib/posthog'

type Props = {
  balanceCents: number
  onClose: () => void
  onSuccess?: () => void
}

export function WithdrawModal({ balanceCents, onClose, onSuccess }: Props) {
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const maxAmount = balanceCents / 100

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const num = parseFloat(amount)
    if (isNaN(num) || num < 1) {
      setError('Enter at least $1')
      return
    }
    if (num > maxAmount) {
      setError('Amount exceeds your balance')
      return
    }
    setLoading(true)
    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        setError('Please log in again')
        setLoading(false)
        return
      }
      const res = await fetch('/api/stripe/request-withdrawal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ amount: num }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Something went wrong')
        setLoading(false)
        return
      }
      captureEvent('withdrawal_requested', { amount: num })
      onSuccess?.()
      onClose()
    } catch (e) {
      setError('Failed to process withdrawal')
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-ink mb-2">Withdraw Earnings</h2>
        <p className="text-ink/70 mb-2">Available: ${maxAmount.toFixed(2)}</p>
        <p className="text-sm text-ink/60 mb-6">
          Withdrawal requests are recorded. Stripe Connect integration is required for actual bank payouts.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-ink mb-2">
              Amount (NZD)
            </label>
            <input
              id="amount"
              type="number"
              min="1"
              max={maxAmount}
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-ink/20 focus:outline-none focus:ring-2 focus:ring-primary text-ink"
              placeholder="e.g. 50"
            />
          </div>
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-ink/20 text-ink font-medium hover:bg-ink/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || maxAmount < 1}
              className="flex-1 py-3 rounded-xl bg-primary text-white font-medium hover:bg-secondary disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing…' : 'Request withdrawal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
