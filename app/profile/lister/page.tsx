'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { SiteNav } from '@/components/site-nav'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase/client'

type Profile = {
  first_name: string
  last_name: string
  role?: 'lister' | 'student'
}

export default function ListerProfilePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const displayName = useMemo(() => {
    // 1) Prefer name from user_metadata
    const meta = (user as any)?.user_metadata
    const metaName = [meta?.first_name, meta?.last_name].filter(Boolean).join(' ').trim()
    if (metaName) return metaName

    // 2) Fallback to profile record
    if (profile) {
      const n = [profile.first_name, profile.last_name].filter(Boolean).join(' ').trim()
      if (n) return n
    }

    // 3) Fallback to email prefix
    if (user?.email) {
      const prefix = user.email.split('@')[0]
      if (prefix) return prefix
    }
    return 'User'
  }, [user, profile])

  useEffect(() => {
    async function fetchProfile() {
      if (!user) {
        setProfile(null)
        return
      }
      const supabase = createClient()
      const { data } = await supabase
        .from('profiles')
        .select('first_name, last_name, role')
        .eq('id', user.id)
        .single()
      if (data) {
        if ((data as { role?: string }).role === 'student') {
          router.replace('/profile/student')
          return
        }
        setProfile(data as Profile)
        setFirstName(data.first_name ?? '')
        setLastName(data.last_name ?? '')
      }
    }
    fetchProfile()
  }, [user])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setError(null)
    setSuccess(false)
    setSaving(true)
    try {
      const supabase = createClient()
      const { error: err } = await supabase
        .from('profiles')
        .update({
          first_name: firstName.trim() || '',
          last_name: lastName.trim() || '',
        })
        .eq('id', user.id)
      if (err) throw err
      setProfile({ first_name: firstName.trim(), last_name: lastName.trim() })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <SiteNav />
      <main className="min-h-screen bg-primary">
        <section className="py-16 md:py-24">
          <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
            <div className="mb-6">
              <Link 
                href="/dashboard/lister"
                className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
              </Link>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Main Profile Box */}
              <div className="bg-white rounded-2xl border border-ink/15 shadow-sm p-8 md:p-10 space-y-8">
              
                {/* Profile Picture */}
                <div className="flex justify-center">
                  <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center border-4 border-primary/20">
                    <svg className="w-16 h-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>

                {/* Editable Profile */}
                <form onSubmit={handleSave} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="block text-sm font-medium text-ink">
                      First name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-ink/20 text-ink placeholder-ink/50 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="First name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="block text-sm font-medium text-ink">
                      Last name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-ink/20 text-ink placeholder-ink/50 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Last name"
                    />
                  </div>
                  {error && (
                    <p className="text-sm text-red-600">{error}</p>
                  )}
                  {success && (
                    <p className="text-sm text-green-600">Profile saved successfully.</p>
                  )}
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full h-11 rounded-xl bg-primary text-white font-semibold hover:bg-secondary transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Saving…' : 'Save changes'}
                  </button>
                  <div className="pt-4">
                    <Link href="/settings/tax-gst" className="text-sm text-primary hover:text-accent transition-colors">
                      Tax &amp; GST help →
                    </Link>
                  </div>
                </form>

                {/* Name display (read-only summary) */}
                <div className="text-center pt-2">
                  <h1 className="text-2xl font-semibold tracking-tight text-ink">
                    {displayName || 'Your profile'}
                  </h1>
                </div>

                {/* Email */}
                <div className="text-center">
                  <p className="text-base text-ink/80">
                    {user?.email ?? ''}
                  </p>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <label htmlFor="location" className="block text-lg font-semibold text-ink">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    placeholder="e.g. Auckland, New Zealand"
                    className="w-full h-12 px-4 rounded-xl border border-ink/20 text-ink placeholder-ink/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  />
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <label htmlFor="bio" className="block text-lg font-semibold text-ink">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    placeholder="Tell us about yourself..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-ink/20 text-ink placeholder-ink/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-y"
                  />
                </div>

                {/* Interests */}
                <div className="space-y-2">
                  <label htmlFor="interests" className="block text-lg font-semibold text-ink">
                    Interests
                  </label>
                  <input
                    type="text"
                    id="interests"
                    name="interests"
                    placeholder="e.g. Photography, Reading, Hiking"
                    className="w-full h-12 px-4 rounded-xl border border-ink/20 text-ink placeholder-ink/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  />
                </div>

                {/* Preferred Job Categories */}
                <div className="space-y-2">
                  <label htmlFor="jobCategories" className="block text-lg font-semibold text-ink">
                    Preferred Job Categories
                  </label>
                  <input
                    type="text"
                    id="jobCategories"
                    name="jobCategories"
                    placeholder="e.g. Moving, Cleaning, Pet Care"
                    className="w-full h-12 px-4 rounded-xl border border-ink/20 text-ink placeholder-ink/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  />
                </div>

                {/* Separator Line with Gaps */}
                <div className="py-6">
                  <div className="flex items-center">
                    <div className="flex-1 border-t border-ink/20"></div>
                    <div className="px-8"></div>
                    <div className="flex-1 border-t border-ink/20"></div>
                  </div>
                </div>

                {/* Swifto Achievements */}
                <div className="space-y-3">
                  <h2 className="text-lg font-semibold text-ink">Swifto Achievements</h2>
                  <div className="space-y-4">
                    {/* Space for Swifto achievements content */}
                    <p className="text-base text-ink/60 italic">
                      Achievements will appear here
                    </p>
                  </div>
                </div>

              </div>

              {/* Posted Jobs & Stats Box */}
              <div className="bg-white rounded-2xl border border-ink/15 shadow-sm p-8 md:p-10 space-y-8">
                {/* Rating System */}
                <div className="space-y-4">
                  <div className="text-center space-y-3">
                    <h2 className="text-lg font-semibold text-ink">Rating</h2>
                    <div className="flex items-center justify-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-8 h-8 ${
                            star <= 4
                              ? 'text-primary fill-primary'
                              : 'text-ink/20 fill-ink/20'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                    </div>
                    <div className="space-y-1">
                      <p className="text-3xl font-bold text-primary">4.0</p>
                      <p className="text-sm text-ink/70">Based on 23 reviews</p>
                    </div>
                  </div>
                  <div className="text-center space-y-2 pt-4 border-t border-ink/10">
                    <p className="text-2xl font-bold text-primary">Total Spent: $1,245</p>
                    <p className="text-sm text-ink/70">23 jobs completed</p>
                  </div>
                </div>

                {/* Posted Jobs */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-ink">Posted Jobs</h2>
                  <div className="space-y-4">
                    {[
                      { title: 'Lawn mowing', date: '3 days ago', budget: '$45', status: 'Completed' },
                      { title: 'Moving boxes', date: '1 week ago', budget: '$120', status: 'Completed' },
                      { title: 'House cleaning', date: '2 weeks ago', budget: '$85', status: 'Completed' },
                      { title: 'Dog walking', date: '3 weeks ago', budget: '$50', status: 'Completed' },
                      { title: 'Garden maintenance', date: '1 month ago', budget: '$95', status: 'Completed' },
                      { title: 'Furniture assembly', date: '1 month ago', budget: '$75', status: 'Completed' },
                      { title: 'Window cleaning', date: '6 weeks ago', budget: '$60', status: 'Completed' },
                    ].map((job, index) => (
                      <div key={index} className="p-4 rounded-xl border border-ink/15 bg-canvas/50 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-ink">{job.title}</h3>
                            <p className="text-sm text-ink/70">{job.date}</p>
                          </div>
                          <span className="text-base font-semibold text-primary">{job.budget}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                            {job.status}
                          </span>
                        </div>
                      </div>
                    ))}
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
