'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth-context'
import { SiteNav } from '@/components/site-nav'

export default function LoginPage() {
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
    const safeRedirect = redirectTo?.startsWith('/') && !redirectTo.startsWith('//') ? redirectTo : null
    if (safeRedirect) {
      router.replace(safeRedirect)
      return
    }

    const supabase = createClient()
    let cancelled = false
    supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (cancelled) return
        if (data?.role === 'lister') router.replace('/dashboard/lister')
        else router.replace('/dashboard/student')
      })
      .catch(() => {
        if (!cancelled) router.replace('/dashboard/student')
      })
    return () => { cancelled = true }
  }, [user, router, authLoading, searchParams])

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-white text-center">
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
        const redirectTo = searchParams.get('redirect')
        const safeRedirect = redirectTo?.startsWith('/') && !redirectTo.startsWith('//')
          ? redirectTo
          : null
        if (safeRedirect) {
          router.replace(safeRedirect)
          return
        }
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single()
        if (profile?.role === 'lister') {
          router.replace('/dashboard/lister')
        } else {
          router.replace('/dashboard/student')
        }
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
      <main className="min-h-screen bg-primary">
        <section className="py-16 md:py-24">
          <div className="mx-auto w-full max-w-sm px-4 md:px-8">
            <div className="bg-white rounded-2xl border border-ink/15 shadow-sm p-8 md:p-10 space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-ink">
                  Welcome back
                </h1>
                <p className="text-base text-ink/80">
                  Log in to your Swifto account
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 text-sm">
                    {error}
                  </div>
                )}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-ink mb-2">
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                    className="w-full h-12 px-4 rounded-xl border border-ink/20 text-ink placeholder-ink/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="password" className="block text-sm font-medium text-ink">
                      Password
                    </label>
                    <Link href="/forgot-password" className="text-sm text-accent hover:text-primary transition-colors">
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
                    className="w-full h-12 px-4 rounded-xl border border-ink/20 text-ink placeholder-ink/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    placeholder="Enter your password"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl bg-primary text-white font-medium hover:bg-secondary transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? 'Logging in...' : 'Log in'}
                </button>
              </form>

              <div className="text-center">
                <p className="text-sm text-ink/70">
                  Don't have an account?{' '}
                  <Link href="/signup" className="text-primary hover:text-accent font-medium transition-colors">
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
