'use client'

import Link from 'next/link'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { SiteNav } from '@/components/site-nav'
import { SwiftoWordmark } from '@/components/swifto-wordmark'
import { DesignPhoto } from '@/components/design/design-photo'
import { DESIGN_PHOTOS } from '@/lib/design-photos'
import { passAuthGate } from '@/lib/auth-gate'
import { TurnstileField } from '@/components/turnstile-field'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const gated = await passAuthGate('reset', email, turnstileToken)
      if (!gated.ok) {
        setError(gated.error)
        setLoading(false)
        return
      }

      const supabase = createClient()
      const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
      // Land directly on reset page (also allow-list this URL in Supabase Redirect URLs)
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${origin}/reset-password`,
      })

      if (resetError) {
        setError(resetError.message)
        setLoading(false)
        return
      }

      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SiteNav />
      <main className="min-h-screen bg-canvas">
        <section className="swifto-content py-10 md:py-12 pb-16 md:pb-[72px] grid lg:grid-cols-2 gap-10 items-center min-h-[74vh]">
          <div className="max-w-md w-full mx-auto lg:mx-0 lg:justify-self-center space-y-6">
            <SwiftoWordmark asLink={false} />
            <div>
              <h1 className="text-[34px]">Forgot password</h1>
              <p className="text-base text-ink-2 mt-2">
                Enter your email and we&apos;ll send a link to reset your password.
              </p>
            </div>

            {sent ? (
              <div className="space-y-4">
                <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-green-900 text-sm">
                  If an account exists for <strong>{email}</strong>, you&apos;ll get a reset email shortly.
                  Open the link on this device to choose a new password.
                </div>
                <Link href="/login" className="swifto-btn-primary w-full h-[58px] text-[17px] inline-flex items-center justify-center">
                  Back to log in
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 text-sm">
                    {error}
                  </div>
                )}
                <div>
                  <label htmlFor="email" className="block text-[13.5px] font-semibold text-ink-2 mb-1.5">
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full h-[50px] px-4 rounded-btn border-[1.5px] border-line bg-white text-ink placeholder-ink-3 focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/15 transition-all"
                    placeholder="you@example.com"
                  />
                </div>

                <TurnstileField onToken={setTurnstileToken} />

                <button
                  type="submit"
                  disabled={loading}
                  className="swifto-btn-primary w-full h-[58px] text-[17px] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending…' : 'Send reset link'}
                </button>
              </form>
            )}

            <p className="text-[14.5px] text-ink-2 text-center">
              Remembered it?{' '}
              <Link href="/login" className="text-secondary font-bold hover:text-primary transition-colors">
                Log in
              </Link>
            </p>
          </div>

          <div className="relative hidden lg:block">
            <DesignPhoto src={DESIGN_PHOTOS.heroSecond} height={480} className="shadow-pop" tint />
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-transparent from-40% to-ink/72" />
            <div className="absolute bottom-7 left-7 right-7 text-white">
              <p className="font-display text-[22px] font-bold leading-snug">
                We&apos;ll get you back into your account securely.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
