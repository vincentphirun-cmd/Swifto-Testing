'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { SiteNav } from '@/components/site-nav'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase/client'
import { InfoTooltip } from '@/components/info-tooltip'
import { ProfileIdentityNote, ProfileReadOnlyField } from '@/components/profile-read-only-field'
import { StarRatingDisplay } from '@/components/star-rating'
import { ProfileJobHistoryList } from '@/components/profile-job-history'
import {
  fetchStudentProfileCompletions,
  sumStudentPayoutsFromCompletions,
  type ProfileCompletionJob,
} from '@/lib/profile-completions'
import { fetchRatingSummary, type RatingSummary } from '@/lib/ratings'

type Profile = {
  first_name: string
  last_name: string
  university: string | null
  gst_registered?: boolean
  gst_number?: string | null
  total_jobs?: number
  total_earnings_cents?: number
}

export default function StudentProfilePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [ratingSummary, setRatingSummary] = useState<RatingSummary>({
    averageRating: 0,
    reviewCount: 0,
  })
  const [completedJobs, setCompletedJobs] = useState<ProfileCompletionJob[]>([])
  const [jobsLoading, setJobsLoading] = useState(true)
  const [gstRegistered, setGstRegistered] = useState(false)
  const [gstNumber, setGstNumber] = useState('')
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
        .select('first_name, last_name, university, gst_registered, gst_number, role, total_jobs, total_earnings_cents')
        .eq('id', user.id)
        .single()
      if (data) {
        if ((data as { role?: string }).role === 'lister') {
          router.replace('/profile/lister')
          return
        }
        setProfile(data as Profile)
        setGstRegistered(data.gst_registered ?? false)
        setGstNumber(data.gst_number ?? '')

        const summary = await fetchRatingSummary(supabase, user.id, 'student')
        setRatingSummary(summary)
      }
    }
    fetchProfile()
  }, [user])

  useEffect(() => {
    async function loadCompletions() {
      if (!user) {
        setCompletedJobs([])
        setJobsLoading(false)
        return
      }
      setJobsLoading(true)
      try {
        const jobs = await fetchStudentProfileCompletions(user.id)
        setCompletedJobs(jobs)
      } catch {
        setCompletedJobs([])
      } finally {
        setJobsLoading(false)
      }
    }
    loadCompletions()
  }, [user])

  const totalEarnedDollars = useMemo(() => {
    if (profile?.total_earnings_cents != null && profile.total_earnings_cents > 0) {
      return profile.total_earnings_cents / 100
    }
    return sumStudentPayoutsFromCompletions(completedJobs)
  }, [profile?.total_earnings_cents, completedJobs])

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
          gst_registered: gstRegistered,
          gst_number: gstRegistered ? (gstNumber.trim() || null) : null,
        })
        .eq('id', user.id)
      if (err) throw err
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              gst_registered: gstRegistered,
              gst_number: gstRegistered ? (gstNumber.trim() || null) : null,
            }
          : prev
      )
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
                href="/dashboard/student"
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

                {/* Account details (fixed at signup) */}
                <div className="space-y-4">
                  <h2 className="text-sm font-semibold text-ink uppercase tracking-wide">Account information</h2>
                  <ProfileReadOnlyField
                    id="firstName"
                    label="First name"
                    value={profile?.first_name ?? ''}
                  />
                  <ProfileReadOnlyField
                    id="lastName"
                    label="Last name"
                    value={profile?.last_name ?? ''}
                  />
                  <ProfileReadOnlyField
                    id="university"
                    label="University"
                    value={profile?.university ?? ''}
                  />
                  <ProfileReadOnlyField
                    id="email"
                    label="Email"
                    value={user?.email ?? ''}
                  />
                  <ProfileIdentityNote />
                </div>

                {/* Editable tax settings */}
                <form onSubmit={handleSave} className="space-y-4 pt-4 border-t border-ink/10">
                  <h2 className="text-sm font-semibold text-ink uppercase tracking-wide">Tax settings</h2>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <label htmlFor="gstRegistration" className="block text-sm font-medium text-ink">
                        GST registration
                      </label>
                      <InfoTooltip content="If you're GST-registered, you're responsible for GST on your total taxable activity across all work — not just Swifto." />
                    </div>
                    <select
                      id="gstRegistration"
                      value={gstRegistered ? 'registered' : 'not_registered'}
                      onChange={(e) => setGstRegistered(e.target.value === 'registered')}
                      className="w-full h-11 px-4 rounded-xl border border-ink/20 text-ink focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                    >
                      <option value="not_registered">Not GST-registered</option>
                      <option value="registered">GST-registered</option>
                    </select>
                    <p className="text-xs text-ink/60">
                      GST registration is based on your total self-employed turnover across all work (not just Swifto). If you become GST-registered, update this here.
                    </p>
                    {gstRegistered && (
                      <div className="pt-2">
                        <label htmlFor="gstNumber" className="block text-sm font-medium text-ink mb-1">
                          GST number (optional)
                        </label>
                        <input
                          id="gstNumber"
                          type="text"
                          value={gstNumber}
                          onChange={(e) => setGstNumber(e.target.value)}
                          className="w-full h-11 px-4 rounded-xl border border-ink/20 text-ink placeholder-ink/50 focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="e.g. 12-345-678"
                        />
                      </div>
                    )}
                  </div>
                  <div className="p-4 bg-canvas/50 rounded-xl border border-ink/15">
                    <h3 className="text-sm font-semibold text-ink mb-2">Tax reminder</h3>
                    <p className="text-sm text-ink/80">
                      Swifto doesn&apos;t file income tax for you. You may need to declare your earnings and keep receipts for expenses.
                    </p>
                  </div>
                  <div className="pt-2">
                    <Link href="/settings/tax-gst" className="text-sm text-primary hover:text-accent transition-colors">
                      Tax &amp; GST help →
                    </Link>
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
                    {saving ? 'Saving…' : 'Save tax settings'}
                  </button>
                </form>

                <div className="text-center pt-2">
                  <h1 className="text-2xl font-semibold tracking-tight text-ink">
                    {displayName || 'Your profile'}
                  </h1>
                </div>

                {/* Field of study and below — not yet persisted */}
                <div className="space-y-2">
                  <label htmlFor="fieldOfStudy" className="block text-lg font-semibold text-ink">
                    Field of Study
                  </label>
                  <input
                    type="text"
                    id="fieldOfStudy"
                    name="fieldOfStudy"
                    placeholder="e.g. Computer Science"
                    className="w-full h-12 px-4 rounded-xl border border-ink/20 text-ink placeholder-ink/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  />
                </div>

                {/* Interests and Hobbies */}
                <div className="space-y-2">
                  <label htmlFor="interests" className="block text-lg font-semibold text-ink">
                    Interests and Hobbies
                  </label>
                  <input
                    type="text"
                    id="interests"
                    name="interests"
                    placeholder="e.g. Photography, Reading, Hiking"
                    className="w-full h-12 px-4 rounded-xl border border-ink/20 text-ink placeholder-ink/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  />
                </div>

                {/* Achievements - Academic */}
                <div className="space-y-2">
                  <label htmlFor="academicAchievements" className="block text-lg font-semibold text-ink">
                    Academic Achievements
                  </label>
                  <textarea
                    id="academicAchievements"
                    name="academicAchievements"
                    placeholder="e.g. Dean's List - Fall 2023, Honors Student - 2022-2024"
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-ink/20 text-ink placeholder-ink/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-y"
                  />
                </div>

                {/* Achievements - Extra-Curricular */}
                <div className="space-y-2">
                  <label htmlFor="extracurricularAchievements" className="block text-lg font-semibold text-ink">
                    Extra-Curricular Achievements
                  </label>
                  <textarea
                    id="extracurricularAchievements"
                    name="extracurricularAchievements"
                    placeholder="e.g. President of Student Council - 2023, Volunteer of the Year - 2022"
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-ink/20 text-ink placeholder-ink/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-y"
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

              {/* Past Jobs & Progress Box */}
              <div className="bg-white rounded-2xl border border-ink/15 shadow-sm p-8 md:p-10 space-y-8">
                {/* Rating System */}
                <div className="space-y-4">
                  <div className="text-center space-y-3">
                    <h2 className="text-lg font-semibold text-ink">Rating</h2>
                    <StarRatingDisplay
                      rating={ratingSummary.averageRating}
                      reviewCount={ratingSummary.reviewCount}
                    />
                  </div>
                  {(profile?.total_jobs ?? 0) > 0 && (
                    <p className="text-center text-sm text-ink/70">
                      {profile?.total_jobs} job{profile?.total_jobs === 1 ? '' : 's'} completed on Swifto
                    </p>
                  )}
                </div>

                {/* Total earned */}
                <div className="space-y-2 pt-4 border-t border-ink/10 text-center">
                  <p className="text-2xl font-bold text-primary">
                    Total earned: ${totalEarnedDollars.toFixed(2)}
                  </p>
                  <p className="text-xs text-ink/60">From completed Swifto jobs</p>
                </div>

                {/* Past Jobs */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-ink">Past Jobs</h2>
                  {jobsLoading ? (
                    <p className="text-sm text-ink/60">Loading jobs…</p>
                  ) : (
                    <ProfileJobHistoryList
                      jobs={completedJobs}
                      variant="student"
                      emptyMessage="No completed jobs yet. Jobs appear here after both you and the lister verify completion."
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
