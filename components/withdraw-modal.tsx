'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { captureEvent } from '@/lib/posthog'

type ConnectStatus = {
  has_account: boolean
  details_submitted: boolean
  payouts_enabled: boolean
}

type Props = {
  balanceCents: number
  onClose: () => void
  onSuccess?: () => void
}

async function authHeaders() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session?.access_token) return null
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${session.access_token}`,
  }
}

export function WithdrawModal({ balanceCents, onClose, onSuccess }: Props) {
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [onboarding, setOnboarding] = useState(false)
  const [statusLoading, setStatusLoading] = useState(true)
  const [connect, setConnect] = useState<ConnectStatus | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [acceptedPayoutTermsAt, setAcceptedPayoutTermsAt] = useState<string | null>(null)
  const [agreeToPayoutTerms, setAgreeToPayoutTerms] = useState(false)
  const isMissingLegalColumn = (code: string | undefined) => code === 'PGRST204'

  const maxAmount = balanceCents / 100
  const payoutsReady = !!connect?.payouts_enabled

  useEffect(() => {
    let cancelled = false
    async function loadStatus() {
      setStatusLoading(true)
      setError(null)
      try {
        const headers = await authHeaders()
        if (!headers) {
          if (!cancelled) setError('Please log in again')
          return
        }
        const res = await fetch('/api/stripe/connect/status', { headers })
        const data = await res.json()
        if (!res.ok) {
          if (!cancelled) setError(data.error || 'Could not load bank account status')
          return
        }
        if (!cancelled) {
          setConnect({
            has_account: !!data.has_account,
            details_submitted: !!data.details_submitted,
            payouts_enabled: !!data.payouts_enabled,
          })
        }

        if (!cancelled) {
          const supabase = createClient()
          const {
            data: { user },
          } = await supabase.auth.getUser()

          if (user) {
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('accepted_payout_terms_at')
              .eq('id', user.id)
              .single()

            if (profileError && !isMissingLegalColumn(profileError.code)) {
              throw profileError
            }

            const acceptedAt =
              profileError && isMissingLegalColumn(profileError.code)
                ? null
                : profile?.accepted_payout_terms_at ?? null
            setAcceptedPayoutTermsAt(acceptedAt)
            setAgreeToPayoutTerms(!!acceptedAt)
          } else {
            setAcceptedPayoutTermsAt(null)
            setAgreeToPayoutTerms(false)
          }
        }
      } catch {
        if (!cancelled) setError('Could not load bank account status')
      } finally {
        if (!cancelled) setStatusLoading(false)
      }
    }
    loadStatus()
    return () => {
      cancelled = true
    }
  }, [])

  const handleConnectBank = async () => {
    setError(null)
    setOnboarding(true)
    try {
      const headers = await authHeaders()
      if (!headers) {
        setError('Please log in again')
        setOnboarding(false)
        return
      }
      const res = await fetch('/api/stripe/connect/onboard', {
        method: 'POST',
        headers,
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Could not start bank setup')
        setOnboarding(false)
        return
      }
      if (data.already_complete) {
        setConnect({
          has_account: true,
          details_submitted: true,
          payouts_enabled: true,
        })
        setOnboarding(false)
        return
      }
      if (data.url) {
        window.location.href = data.url
        return
      }
      setError('No onboarding URL returned')
    } catch {
      setError('Could not start bank setup')
    }
    setOnboarding(false)
  }

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
    if (!payoutsReady) {
      setError('Connect your bank account before withdrawing')
      return
    }

    if (!acceptedPayoutTermsAt) {
      if (!agreeToPayoutTerms) {
        setError('Please agree to Payment & Payout Terms to withdraw.')
        return
      }
    }

    setLoading(true)
    try {
      const headers = await authHeaders()
      if (!headers) {
        setError('Please log in again')
        setLoading(false)
        return
      }

      if (!acceptedPayoutTermsAt) {
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          setError('Please log in again')
          setLoading(false)
          return
        }

        const acceptedAt = new Date().toISOString()
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ accepted_payout_terms_at: acceptedAt })
          .eq('id', user.id)

        if (updateError && !isMissingLegalColumn(updateError.code)) {
          setError('Could not record Payment & Payout Terms acceptance. Please try again.')
          setLoading(false)
          return
        }

        setAcceptedPayoutTermsAt(acceptedAt)
      }

      const res = await fetch('/api/stripe/request-withdrawal', {
        method: 'POST',
        headers,
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
    } catch {
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

        {statusLoading ? (
          <p className="text-sm text-ink/60 mb-6">Checking bank account status…</p>
        ) : payoutsReady ? (
          <p className="text-sm text-ink/60 mb-6">
            Funds will be transferred to your connected bank account via Stripe.
          </p>
        ) : (
          <div className="mb-6 rounded-xl border border-ink/10 bg-canvas p-4">
            <p className="text-sm text-ink/80 mb-3">
              Connect a NZ bank account once to withdraw earnings. Stripe handles identity
              verification securely.
            </p>
            <button
              type="button"
              onClick={handleConnectBank}
              disabled={onboarding}
              className="w-full py-3 rounded-xl bg-primary text-white font-medium hover:bg-secondary disabled:opacity-70"
            >
              {onboarding ? 'Opening Stripe…' : 'Connect bank account'}
            </button>
          </div>
        )}

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
              disabled={!payoutsReady}
              className="w-full px-4 py-3 rounded-xl border border-ink/20 focus:outline-none focus:ring-2 focus:ring-primary text-ink disabled:opacity-60"
              placeholder="e.g. 50"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <p className="text-xs text-ink/60 leading-relaxed">
            By continuing, you agree to our{' '}
            <a
              href="/payment-terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              Payment &amp; Payout Terms
            </a>
            .
          </p>

          {!statusLoading && !acceptedPayoutTermsAt && (
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreeToPayoutTerms}
                onChange={(e) => setAgreeToPayoutTerms(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-ink/30 text-primary focus:ring-primary"
                required
              />
              <span className="text-xs text-ink/70 leading-relaxed">
                I agree to the{' '}
                <a
                  href="/payment-terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline font-medium"
                >
                  Payment &amp; Payout Terms
                </a>
                .
              </span>
            </label>
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
              disabled={
                loading ||
                statusLoading ||
                !payoutsReady ||
                maxAmount < 1 ||
                (!acceptedPayoutTermsAt && !agreeToPayoutTerms)
              }
              className="flex-1 py-3 rounded-xl bg-primary text-white font-medium hover:bg-secondary disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing…' : 'Withdraw'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
