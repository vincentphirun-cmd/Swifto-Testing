'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Props = {
  onClose: () => void
  onSuccess?: () => void
}

export function DepositModal({ onClose, onSuccess }: Props) {
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [legalStatusLoading, setLegalStatusLoading] = useState(true)
  const [acceptedPaymentTermsAt, setAcceptedPaymentTermsAt] = useState<string | null>(null)
  const [agreeToPaymentTerms, setAgreeToPaymentTerms] = useState(false)

  const isMissingLegalColumn = (code: string | undefined) => code === 'PGRST204'

  useEffect(() => {
    let cancelled = false
    async function loadLegalStatus() {
      setLegalStatusLoading(true)
      try {
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) return

        const { data, error } = await supabase
          .from('profiles')
          .select('accepted_payment_terms_at')
          .eq('id', user.id)
          .single()

        if (error && !isMissingLegalColumn(error.code)) {
          throw error
        }

        if (cancelled) return
        const acceptedAt = error && isMissingLegalColumn(error.code)
          ? null
          : data?.accepted_payment_terms_at ?? null
        setAcceptedPaymentTermsAt(acceptedAt)
        setAgreeToPaymentTerms(!!acceptedAt)
      } catch {
        if (!cancelled) setAcceptedPaymentTermsAt(null)
      } finally {
        if (!cancelled) setLegalStatusLoading(false)
      }
    }

    loadLegalStatus()
    return () => {
      cancelled = true
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const form = e.currentTarget
    const amountStr = (form.elements.namedItem('amount') as HTMLInputElement | null)?.value?.trim() ?? ''
    const dollars = parseFloat(amountStr)
    if (isNaN(dollars) || dollars < 1) {
      setError('Enter at least $1')
      return
    }
    const amountCents = Math.round(dollars * 100)
    if (amountCents < 100) {
      setError('Enter at least $1')
      return
    }
    setLoading(true)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        setError('Please log in again')
        setLoading(false)
        return
      }

      if (!acceptedPaymentTermsAt) {
        if (!agreeToPaymentTerms) {
          setError('Please agree to Payment & Payout Terms to continue.')
          setLoading(false)
          return
        }

        if (!user) {
          setError('Please log in again')
          setLoading(false)
          return
        }

        const acceptedAt = new Date().toISOString()
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ accepted_payment_terms_at: acceptedAt })
          .eq('id', user.id)

        if (updateError && !isMissingLegalColumn(updateError.code)) {
          setError('Could not record Payment & Payout Terms acceptance. Please try again.')
          setLoading(false)
          return
        }

        setAcceptedPaymentTermsAt(acceptedAt)
      }

      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ amount_cents: amountCents }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Something went wrong')
        setLoading(false)
        return
      }
      if (data.url) {
        onSuccess?.()
        window.location.href = data.url
      }
    } catch (e) {
      setError('Failed to start checkout')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-ink mb-2">Deposit Funds</h2>
        <p className="text-ink/70 mb-6">Add funds to your balance to post jobs.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-ink mb-2">
              Amount (NZD)
            </label>
            <input
              id="amount"
              name="amount"
              type="number"
              min="1"
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
          <p className="text-xs text-ink/60 leading-relaxed">
            By continuing to payment, you agree to our{' '}
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

          {!legalStatusLoading && !acceptedPaymentTermsAt && (
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreeToPaymentTerms}
                onChange={(e) => setAgreeToPaymentTerms(e.target.checked)}
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
              disabled={loading || legalStatusLoading || (!acceptedPaymentTermsAt && !agreeToPaymentTerms)}
              className="flex-1 py-3 rounded-xl bg-primary text-white font-medium hover:bg-secondary disabled:opacity-70"
            >
              {loading ? 'Loading…' : 'Continue to payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
