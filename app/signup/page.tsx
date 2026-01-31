'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth-context'
import { SiteNav } from '@/components/site-nav'
import { captureEvent } from '@/lib/posthog'

export default function SignUpPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [userType, setUserType] = useState<'student' | 'lister'>('student')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    university: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Redirect if already logged in — get role from profiles table (canonical source)
  useEffect(() => {
    if (authLoading) return // Wait for auth to finish loading
    if (!user) return

    const supabase = createClient()
    let cancelled = false

    void (async () => {
      try {
        const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single()
        if (cancelled) return
        if (data?.role === 'lister') router.replace('/dashboard/lister')
        else router.replace('/dashboard/student')
      } catch {
        if (!cancelled) router.replace('/dashboard/student')
      }
    })()

    return () => {
      cancelled = true
    }
  }, [user, authLoading, router])

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

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.')
      setLoading(false)
      return
    }

    if (userType === 'student' && !formData.university) {
      setError('Please select a university.')
      setLoading(false)
      return
    }

    if (!formData.name.trim()) {
      setError('Please enter your full name.')
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()

      // Parse name into first and last
      const nameParts = formData.name.trim().split(' ')
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ') || ''

      // Sign up with Supabase Auth - store profile data in user metadata
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            role: userType,
            first_name: firstName,
            last_name: lastName,
            university: userType === 'student' ? formData.university : null,
          },
        },
      })

      if (authError) {
        // User already exists (e.g. signed up before but never confirmed / no profile)
        const isAlreadyRegistered =
          /already registered|already exists|user already/i.test(authError.message)
        if (isAlreadyRegistered) {
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
          })
          if (signInError) {
            setError('An account with this email already exists. Try logging in, or use a different email.')
            setLoading(false)
            return
          }
          if (signInData?.session?.user) {
            const accessToken = signInData.session.access_token
            const res = await fetch('/api/profile', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify({
                first_name: nameParts[0] || '',
                last_name: nameParts.slice(1).join(' ') || '',
                role: userType,
                university: userType === 'student' ? formData.university : null,
              }),
            })
            if (res.ok) {
              captureEvent('signed_up', { role: userType })
              if (userType === 'lister') router.push('/dashboard/lister')
              else router.push('/dashboard/student')
              return
            }
            if (res.status === 409) {
              captureEvent('signed_up', { role: userType })
              if (userType === 'lister') router.push('/dashboard/lister')
              else router.push('/dashboard/student')
              return
            }
            const data = await res.json().catch(() => ({}))
            setError(data?.error ?? 'Could not create profile. Please try logging in.')
            setLoading(false)
            return
          }
        }
        setError(authError.message)
        setLoading(false)
        return
      }

      if (!authData.user) {
        setError('Failed to create account. Please try again.')
        setLoading(false)
        return
      }

      // Check if email confirmation is required
      if (authData.session) {
        // User is already confirmed - create profile via API (uses service-role, bypasses RLS)
        const accessToken = authData.session.access_token
        const res = await fetch('/api/profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            role: userType,
            university: userType === 'student' ? formData.university : null,
          }),
        })

        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          setError(data?.error ?? 'Failed to create profile. Please try again.')
          setLoading(false)
          return
        }

        captureEvent('signed_up', { role: userType })
        if (userType === 'lister') {
          router.push('/dashboard/lister')
        } else {
          router.push('/dashboard/student')
        }
      } else {
        captureEvent('signup_initiated', { role: userType })
        setError(null)
        alert('Please check your email to confirm your account. After confirming, you can log in.')
        router.push('/login')
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
      setLoading(false)
    }
  }

  return (
    <>
      <SiteNav />
      <main className="min-h-screen bg-primary">
        <section className="py-16 md:py-24">
          <div className="mx-auto w-full max-w-5xl px-4 md:px-8">
            <div className="bg-white rounded-2xl border border-ink/15 shadow-sm p-8 md:p-10">
              <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                {/* Left Column */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-ink">
                      Create your account
                    </h1>
                    <p className="text-base text-ink/80">
                      Join Swifto and start connecting
                    </p>
                  </div>

                  {/* User Type Selection */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-ink">
                      I want to sign up as:
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setUserType('student')}
                        className={`h-12 px-4 rounded-xl border-2 font-medium transition-colors ${
                          userType === 'student'
                            ? 'border-primary bg-primary text-white'
                            : 'border-ink/20 bg-white text-ink hover:border-primary/50'
                        }`}
                      >
                        Student
                      </button>
                      <button
                        type="button"
                        onClick={() => setUserType('lister')}
                        className={`h-12 px-4 rounded-xl border-2 font-medium transition-colors ${
                          userType === 'lister'
                            ? 'border-primary bg-primary text-white'
                            : 'border-ink/20 bg-white text-ink hover:border-primary/50'
                        }`}
                      >
                        Lister
                      </button>
                    </div>
                  </div>

                  {/* Full Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-ink mb-2">
                      Full name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                      className="w-full h-12 px-4 rounded-xl border border-ink/20 text-ink placeholder-ink/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* University (only for students) */}
                  {userType === 'student' && (
                    <div>
                      <label htmlFor="university" className="block text-sm font-medium text-ink mb-2">
                        University
                      </label>
                      <select
                        id="university"
                        name="university"
                        value={formData.university}
                        onChange={(e) => setFormData(prev => ({ ...prev, university: e.target.value }))}
                        required
                        className="w-full h-12 px-4 rounded-xl border border-ink/20 text-ink focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors bg-white"
                      >
                        <option value="">Select a university</option>
                        <option value="University of Auckland">University of Auckland</option>
                        <option value="University of Otago">University of Otago</option>
                        <option value="University of Canterbury">University of Canterbury</option>
                        <option value="Victoria University of Wellington">Victoria University of Wellington</option>
                        <option value="Massey University">Massey University</option>
                        <option value="University of Waikato">University of Waikato</option>
                        <option value="Auckland University of Technology (AUT)">Auckland University of Technology (AUT)</option>
                        <option value="Lincoln University">Lincoln University</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Right Column - Form */}
                <div>
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 text-sm">
                    {error}
                  </div>
                )}
                {userType === 'student' && (
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-ink mb-2">
                      University email address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                      className="w-full h-12 px-4 rounded-xl border border-ink/20 text-ink placeholder-ink/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                      placeholder="your.email@university.ac.nz"
                    />
                  </div>
                )}

                {userType === 'lister' && (
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
                )}

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-ink mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    required
                    minLength={6}
                    className="w-full h-12 px-4 rounded-xl border border-ink/20 text-ink placeholder-ink/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    placeholder="Create a password"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-ink mb-2">
                    Confirm password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    required
                    className="w-full h-12 px-4 rounded-xl border border-ink/20 text-ink placeholder-ink/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    placeholder="Confirm your password"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl bg-primary text-white font-medium hover:bg-secondary transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating account...' : 'Create account'}
                </button>
              </form>

              <div className="space-y-4 pt-2">
                <p className="text-sm text-ink/70">
                  Already have an account?{' '}
                  <Link href="/login" className="text-primary hover:text-accent font-medium transition-colors">
                    Log in
                  </Link>
                </p>
                <p className="text-xs text-ink/60">
                  By signing up, you agree to our{' '}
                  <Link href="/terms" className="text-accent hover:underline">
                    Terms and Conditions
                  </Link>
                  {' '}and{' '}
                  <Link href="/privacy" className="text-accent hover:underline">
                    Privacy Policy
                  </Link>
                </p>
              </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
