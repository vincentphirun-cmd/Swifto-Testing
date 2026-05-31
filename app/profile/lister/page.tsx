'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { SiteNav } from '@/components/site-nav'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase/client'
import { ProfileIdentityNote, ProfileReadOnlyField } from '@/components/profile-read-only-field'
import { ProfileEditableSection } from '@/components/profile-editable-section'
import { StarRatingDisplay } from '@/components/star-rating'
import { ProfileJobHistoryList } from '@/components/profile-job-history'
import {
  fetchListerProfileCompletions,
  type ProfileCompletionJob,
} from '@/lib/profile-completions'

type Profile = {
  first_name: string
  last_name: string
  role?: 'lister' | 'student'
  rating?: number
  location?: string | null
  bio?: string | null
  interests?: string | null
  preferred_job_categories?: string | null
}

export default function ListerProfilePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [reviewCount, setReviewCount] = useState(0)
  const [completedJobsCount, setCompletedJobsCount] = useState(0)
  const [completedJobs, setCompletedJobs] = useState<ProfileCompletionJob[]>([])
  const [jobsLoading, setJobsLoading] = useState(true)
  const [location, setLocation] = useState('')
  const [bio, setBio] = useState('')
  const [interests, setInterests] = useState('')
  const [preferredJobCategories, setPreferredJobCategories] = useState('')
  const [detailsEditing, setDetailsEditing] = useState(false)
  const [draftLocation, setDraftLocation] = useState('')
  const [draftBio, setDraftBio] = useState('')
  const [draftInterests, setDraftInterests] = useState('')
  const [draftPreferredJobCategories, setDraftPreferredJobCategories] = useState('')
  const [detailsSaving, setDetailsSaving] = useState(false)
  const [detailsError, setDetailsError] = useState<string | null>(null)
  const [detailsSuccess, setDetailsSuccess] = useState(false)

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
        .select('first_name, last_name, role, rating, location, bio, interests, preferred_job_categories')
        .eq('id', user.id)
        .single()
      if (data) {
        if ((data as { role?: string }).role === 'student') {
          router.replace('/profile/student')
          return
        }
        setProfile(data as Profile)
        setLocation(data.location ?? '')
        setBio(data.bio ?? '')
        setInterests(data.interests ?? '')
        setPreferredJobCategories(data.preferred_job_categories ?? '')

        const { count: reviewCountResult } = await supabase
          .from('job_completions')
          .select('*', { count: 'exact', head: true })
          .eq('lister_id', user.id)
          .not('rating_from_student', 'is', null)
        setReviewCount(reviewCountResult ?? 0)
      }
    }
    fetchProfile()
  }, [user, router])

  useEffect(() => {
    async function loadCompletions() {
      if (!user) {
        setCompletedJobs([])
        setJobsLoading(false)
        return
      }
      setJobsLoading(true)
      try {
        const jobs = await fetchListerProfileCompletions(user.id)
        setCompletedJobs(jobs)
        setCompletedJobsCount(jobs.length)
      } catch {
        setCompletedJobs([])
      } finally {
        setJobsLoading(false)
      }
    }
    loadCompletions()
  }, [user])

  const startDetailsEdit = () => {
    setDraftLocation(location)
    setDraftBio(bio)
    setDraftInterests(interests)
    setDraftPreferredJobCategories(preferredJobCategories)
    setDetailsError(null)
    setDetailsSuccess(false)
    setDetailsEditing(true)
  }

  const cancelDetailsEdit = () => {
    setDetailsEditing(false)
    setDetailsError(null)
  }

  const handleSaveDetails = async () => {
    if (!user) return
    setDetailsError(null)
    setDetailsSuccess(false)
    setDetailsSaving(true)
    try {
      const supabase = createClient()
      const payload = {
        location: draftLocation.trim() || null,
        bio: draftBio.trim() || null,
        interests: draftInterests.trim() || null,
        preferred_job_categories: draftPreferredJobCategories.trim() || null,
      }
      const { error: err } = await supabase.from('profiles').update(payload).eq('id', user.id)
      if (err) throw err
      setLocation(draftLocation)
      setBio(draftBio)
      setInterests(draftInterests)
      setPreferredJobCategories(draftPreferredJobCategories)
      setProfile((prev) => (prev ? { ...prev, ...payload } : prev))
      setDetailsEditing(false)
      setDetailsSuccess(true)
      setTimeout(() => setDetailsSuccess(false), 3000)
    } catch (e) {
      setDetailsError(e instanceof Error ? e.message : 'Failed to save')
    } finally {
      setDetailsSaving(false)
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
                    id="email"
                    label="Email"
                    value={user?.email ?? ''}
                  />
                  <ProfileIdentityNote />
                  <div className="pt-2">
                    <Link href="/settings/tax-gst" className="text-sm text-primary hover:text-accent transition-colors">
                      Tax &amp; GST help →
                    </Link>
                  </div>
                </div>

                <div className="text-center pt-2">
                  <h1 className="text-2xl font-semibold tracking-tight text-ink">
                    {displayName || 'Your profile'}
                  </h1>
                </div>

                <ProfileEditableSection
                  title="Profile details"
                  isEditing={detailsEditing}
                  onEdit={startDetailsEdit}
                  onCancel={cancelDetailsEdit}
                  onSave={handleSaveDetails}
                  saving={detailsSaving}
                  error={detailsError}
                  success={detailsSuccess}
                  viewContent={
                    <div className="space-y-4">
                      <ProfileReadOnlyField id="locationView" label="Location" value={location} />
                      <ProfileReadOnlyField id="bioView" label="Bio" value={bio} />
                      <ProfileReadOnlyField id="interestsView" label="Interests" value={interests} />
                      <ProfileReadOnlyField
                        id="jobCategoriesView"
                        label="Preferred job categories"
                        value={preferredJobCategories}
                      />
                    </div>
                  }
                  editContent={
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="location" className="block text-sm font-medium text-ink">
                          Location
                        </label>
                        <input
                          type="text"
                          id="location"
                          value={draftLocation}
                          onChange={(e) => setDraftLocation(e.target.value)}
                          placeholder="e.g. Auckland, New Zealand"
                          className="w-full h-11 px-4 rounded-xl border border-ink/20 text-ink placeholder-ink/50 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="bio" className="block text-sm font-medium text-ink">
                          Bio
                        </label>
                        <textarea
                          id="bio"
                          value={draftBio}
                          onChange={(e) => setDraftBio(e.target.value)}
                          placeholder="Tell us about yourself..."
                          rows={4}
                          className="w-full px-4 py-3 rounded-xl border border-ink/20 text-ink placeholder-ink/50 focus:outline-none focus:ring-2 focus:ring-primary resize-y"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="interests" className="block text-sm font-medium text-ink">
                          Interests
                        </label>
                        <input
                          type="text"
                          id="interests"
                          value={draftInterests}
                          onChange={(e) => setDraftInterests(e.target.value)}
                          placeholder="e.g. Photography, Reading, Hiking"
                          className="w-full h-11 px-4 rounded-xl border border-ink/20 text-ink placeholder-ink/50 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="jobCategories" className="block text-sm font-medium text-ink">
                          Preferred job categories
                        </label>
                        <input
                          type="text"
                          id="jobCategories"
                          value={draftPreferredJobCategories}
                          onChange={(e) => setDraftPreferredJobCategories(e.target.value)}
                          placeholder="e.g. Moving, Cleaning, Pet Care"
                          className="w-full h-11 px-4 rounded-xl border border-ink/20 text-ink placeholder-ink/50 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                  }
                />

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
                    <StarRatingDisplay
                      rating={profile?.rating ?? 0}
                      reviewCount={reviewCount}
                    />
                  </div>
                  {completedJobsCount > 0 && (
                    <div className="text-center space-y-2 pt-4 border-t border-ink/10">
                      <p className="text-sm text-ink/70">
                        {completedJobsCount} job{completedJobsCount === 1 ? '' : 's'} completed on Swifto
                      </p>
                    </div>
                  )}
                </div>

                {/* Completed Jobs */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-ink">Completed Jobs</h2>
                  {jobsLoading ? (
                    <p className="text-sm text-ink/60">Loading jobs…</p>
                  ) : (
                    <ProfileJobHistoryList
                      jobs={completedJobs}
                      variant="lister"
                      emptyMessage="No completed jobs yet. Jobs appear here after both you and the student verify completion."
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
