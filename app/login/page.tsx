'use client'

import Link from 'next/link'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth-context'
import { SiteNav } from '@/components/site-nav'
import { SwiftoWordmark } from '@/components/swifto-wordmark'
import { DesignPhoto } from '@/components/design/design-photo'
import { StarRating } from '@/components/design/star-rating'
import { DESIGN_PHOTOS } from '@/lib/design-photos'
import { captureEvent } from '@/lib/posthog'
import { fetchUserRole, pickPostLoginPath } from '@/lib/user-role'

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading: authLoading } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const errorParam = searchParams.get('error')
    const reason = searchParams.get('reason')
    if (errorParam === 'auth_failed') {
      let errorMessage = 'Email confirmation failed. Please try signing up again or contact support.'
      if (reason) {
        errorMessage += ` (Reason: ${reason})`
      }
      setError(errorMessage)
    }
  }, [searchParams])

  // Redirect if already logged in
  useEffect(() => {
    if (authLoading) return
    if (!user) return

    const redirectTo = searchParams.get('redirect')
    let cancelled = false
    void (async () => {
      try {
        const supabase = createClient()
        const role = await fetchUserRole(supabase, user)
        if (cancelled) return
        router.replace(pickPostLoginPath(role, redirectTo))
      } catch {
        if (!cancelled) router.replace('/dashboard/student')
      }
    })()
    return () => { cancelled = true }
  }, [user, router, authLoading, searchParams])

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="text-ink-muted text-center">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const supabase = createClient()
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (signInError) {
        setError(signInError.message)
        setLoading(false)
        return
      }

      if (data.user) {
        captureEvent('logged_in')
        const redirectTo = searchParams.get('redirect')
        const role = await fetchUserRole(supabase, data.user)
        router.replace(pickPostLoginPath(role, redirectTo))
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
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
              <h1 className="text-[34px]">Welcome back</h1>
              <p className="text-base text-ink-2 mt-2">Log in to pick up where you left off.</p>
            </div>

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
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                    className="w-full h-[50px] px-4 rounded-btn border-[1.5px] border-line bg-white text-ink placeholder-ink-3 focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/15 transition-all"
                    placeholder="mia@student.ac.nz"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="password" className="block text-[13.5px] font-semibold text-ink-2">
                      Password
                    </label>
                    <Link href="/forgot-password" className="text-sm text-secondary hover:text-primary transition-colors">
                      Forgot password?
                    </Link>
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    required
                    className="w-full h-[50px] px-4 rounded-btn border-[1.5px] border-line bg-white text-ink placeholder-ink-3 focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/15 transition-all"
                    placeholder="Enter your password"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="swifto-btn-primary w-full h-[58px] text-[17px] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? 'Logging in...' : 'Log in'}
                </button>
              </form>

              <p className="text-[14.5px] text-ink-2 text-center">
                New to Swifto?{' '}
                <Link href="/signup" className="text-secondary font-bold hover:text-primary transition-colors">
                  Create an account
                </Link>
              </p>
          </div>

          <div className="relative hidden lg:block">
            <DesignPhoto src={DESIGN_PHOTOS.heroSecond} height={480} className="shadow-pop" tint />
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-transparent from-40% to-ink/72" />
            <div className="absolute bottom-7 left-7 right-7 text-white">
              <StarRating size={18} />
              <p className="font-display text-[22px] font-bold mt-2.5 leading-snug">
                &ldquo;Swifto helped me cover rent without dropping a single class.&rdquo;
              </p>
              <p className="text-sm text-white/85 mt-2">— Aroha, second-year student</p>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <p className="text-ink-muted">Loading…</p>
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
