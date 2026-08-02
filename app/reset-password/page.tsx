'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { EmailOtpType } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { SiteNav } from '@/components/site-nav'
import { SwiftoWordmark } from '@/components/swifto-wordmark'
import { DesignPhoto } from '@/components/design/design-photo'
import { DESIGN_PHOTOS } from '@/lib/design-photos'
import { fetchUserRole, pickPostLoginPath } from '@/lib/user-role'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [preparing, setPreparing] = useState(true)
  const [sessionReady, setSessionReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    let cancelled = false

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (cancelled) return
      if (event === 'PASSWORD_RECOVERY' || (session && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION'))) {
        if (session) {
          setSessionReady(true)
          setError(null)
        }
      }
    })

    async function prepare() {
      setPreparing(true)
      setError(null)
      try {
        const params = new URLSearchParams(window.location.search)
        const code = params.get('code')
        const tokenHash = params.get('token_hash')
        const type = params.get('type') as EmailOtpType | null

        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
          if (exchangeError) {
            if (!cancelled) {
              setError(exchangeError.message || 'Reset link is invalid or expired.')
            }
          } else if (!cancelled) {
            setSessionReady(true)
          }
          window.history.replaceState({}, '', '/reset-password')
        } else if (tokenHash && type) {
          const { error: otpError } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type,
          })
          if (otpError) {
            if (!cancelled) {
              setError(otpError.message || 'Reset link is invalid or expired.')
            }
          } else if (!cancelled) {
            setSessionReady(true)
          }
          window.history.replaceState({}, '', '/reset-password')
        } else {
          // Implicit/hash flow: give the client a moment to parse #access_token&type=recovery
          await new Promise((r) => setTimeout(r, 400))
          const { data } = await supabase.auth.getSession()
          if (!cancelled && data.session) {
            setSessionReady(true)
          }
        }

        if (!cancelled) {
          const { data } = await supabase.auth.getSession()
          if (data.session) setSessionReady(true)
          else if (!code && !tokenHash) {
            // Still waiting on hash parse / PASSWORD_RECOVERY — keep preparing briefly
            await new Promise((r) => setTimeout(r, 800))
            const again = await supabase.auth.getSession()
            if (!cancelled && again.data.session) setSessionReady(true)
            else if (!cancelled) {
              setError(
                'This reset link is invalid or has expired. Request a new one from the forgot password page.'
              )
            }
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Could not open reset link.')
        }
      } finally {
        if (!cancelled) setPreparing(false)
      }
    }

    void prepare()
    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    if (!sessionReady) {
      setError('No active reset session. Request a new reset link.')
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()
      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) {
        setError(updateError.message)
        setLoading(false)
        return
      }

      setDone(true)
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        const role = await fetchUserRole(supabase, user)
        setTimeout(() => {
          router.replace(pickPostLoginPath(role, null))
        }, 1200)
      } else {
        setTimeout(() => router.replace('/login'), 1200)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  const showForm = !preparing && !done

  return (
    <>
      <SiteNav />
      <main className="min-h-screen bg-canvas">
        <section className="swifto-content py-10 md:py-12 pb-16 md:pb-[72px] grid lg:grid-cols-2 gap-10 items-center min-h-[74vh]">
          <div className="max-w-md w-full mx-auto lg:mx-0 lg:justify-self-center space-y-6">
            <SwiftoWordmark asLink={false} />
            <div>
              <h1 className="text-[34px]">Set a new password</h1>
              <p className="text-base text-ink-2 mt-2">Choose a new password for your Swifto account.</p>
            </div>

            {preparing ? (
              <p className="text-ink-muted">Checking reset link…</p>
            ) : done ? (
              <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-green-900 text-sm">
                Password updated. Redirecting you to your dashboard…
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 text-sm">
                    {error}
                    {!sessionReady && (
                      <p className="mt-2">
                        <Link href="/forgot-password" className="font-semibold underline">
                          Request a new reset link
                        </Link>
                      </p>
                    )}
                  </div>
                )}

                {showForm && sessionReady && (
                  <>
                    <div>
                      <label htmlFor="password" className="block text-[13.5px] font-semibold text-ink-2 mb-1.5">
                        New password
                      </label>
                      <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={8}
                        className="w-full h-[50px] px-4 rounded-btn border-[1.5px] border-line bg-white text-ink placeholder-ink-3 focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/15 transition-all"
                        placeholder="At least 8 characters"
                      />
                    </div>

                    <div>
                      <label htmlFor="confirm" className="block text-[13.5px] font-semibold text-ink-2 mb-1.5">
                        Confirm password
                      </label>
                      <input
                        type="password"
                        id="confirm"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        required
                        minLength={8}
                        className="w-full h-[50px] px-4 rounded-btn border-[1.5px] border-line bg-white text-ink placeholder-ink-3 focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/15 transition-all"
                        placeholder="Repeat new password"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="swifto-btn-primary w-full h-[58px] text-[17px] disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Updating…' : 'Update password'}
                    </button>
                  </>
                )}
              </form>
            )}

            <p className="text-[14.5px] text-ink-2 text-center">
              <Link href="/login" className="text-secondary font-bold hover:text-primary transition-colors">
                Back to log in
              </Link>
            </p>
          </div>

          <div className="relative hidden lg:block">
            <DesignPhoto src={DESIGN_PHOTOS.heroSecond} height={480} className="shadow-pop" tint />
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-transparent from-40% to-ink/72" />
            <div className="absolute bottom-7 left-7 right-7 text-white">
              <p className="font-display text-[22px] font-bold leading-snug">
                Pick a strong password you haven&apos;t used elsewhere.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
