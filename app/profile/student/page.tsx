'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { SiteNav } from '@/components/site-nav'
import { PageHero } from '@/components/page-hero'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase/client'
import { InfoTooltip } from '@/components/info-tooltip'
import { ProfileIdentityNote, ProfileReadOnlyField } from '@/components/profile-read-only-field'
import { ProfileEditableSection } from '@/components/profile-editable-section'
import { StarRatingDisplay } from '@/components/star-rating'
import { ProfileAvatarUpload } from '@/components/profile-avatar'
import { ProfileJobHistoryList } from '@/components/profile-job-history'
import {
  fetchStudentProfileCompletions,
  sumStudentPayoutsFromCompletions,
  type ProfileCompletionJob,
} from '@/lib/profile-completions'
import { getAccountIdentity } from '@/lib/profile-account-identity'
import { summarizeRatings } from '@/lib/ratings'

type Profile = {
  first_name: string
  last_name: string
  avatar_url?: string | null
  university: string | null
  gst_registered?: boolean
  gst_number?: string | null
  field_of_study?: string | null
  interests?: string | null
  academic_achievements?: string | null
  extracurricular_achievements?: string | null
  total_jobs?: number
  total_earnings_cents?: number
}

export default function StudentProfilePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [completedJobs, setCompletedJobs] = useState<ProfileCompletionJob[]>([])
  const [jobsLoading, setJobsLoading] = useState(true)
  const [gstRegistered, setGstRegistered] = useState(false)
  const [gstNumber, setGstNumber] = useState('')
  const [fieldOfStudy, setFieldOfStudy] = useState('')
  const [interests, setInterests] = useState('')
  const [academicAchievements, setAcademicAchievements] = useState('')
  const [extracurricularAchievements, setExtracurricularAchievements] = useState('')
  const [taxEditing, setTaxEditing] = useState(false)
  const [detailsEditing, setDetailsEditing] = useState(false)
  const [draftGstRegistered, setDraftGstRegistered] = useState(false)
  const [draftGstNumber, setDraftGstNumber] = useState('')
  const [draftFieldOfStudy, setDraftFieldOfStudy] = useState('')
  const [draftInterests, setDraftInterests] = useState('')
  const [draftAcademicAchievements, setDraftAcademicAchievements] = useState('')
  const [draftExtracurricularAchievements, setDraftExtracurricularAchievements] = useState('')
  const [taxSaving, setTaxSaving] = useState(false)
  const [detailsSaving, setDetailsSaving] = useState(false)
  const [taxError, setTaxError] = useState<string | null>(null)
  const [detailsError, setDetailsError] = useState<string | null>(null)
  const [taxSuccess, setTaxSuccess] = useState(false)
  const [detailsSuccess, setDetailsSuccess] = useState(false)

  const accountIdentity = useMemo(
    () => getAccountIdentity(user, profile, { includeUniversity: true }),
    [user, profile]
  )

  const displayName = useMemo(() => {
    const n = [accountIdentity.firstName, accountIdentity.lastName]
      .filter(Boolean)
      .join(' ')
      .trim()
    if (n) return n

    if (user?.email) {
      const prefix = user.email.split('@')[0]
      if (prefix) return prefix
    }
    return 'User'
  }, [accountIdentity, user])

  const ratingSummary = useMemo(
    () => summarizeRatings(completedJobs.map((job) => job.rating_from_lister)),
    [completedJobs]
  )

  useEffect(() => {
    async function fetchProfile() {
      if (!user) {
        setProfile(null)
        return
      }
      const supabase = createClient()
      const { data } = await supabase
        .from('profiles')
        .select(
                  'first_name, last_name, avatar_url, university, gst_registered, gst_number, field_of_study, interests, academic_achievements, extracurricular_achievements, role, total_jobs, total_earnings_cents'
        )
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
        setFieldOfStudy(data.field_of_study ?? '')
        setInterests(data.interests ?? '')
        setAcademicAchievements(data.academic_achievements ?? '')
        setExtracurricularAchievements(data.extracurricular_achievements ?? '')
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
    return sumStudentPayoutsFromCompletions(completedJobs, gstRegistered)
  }, [profile?.total_earnings_cents, completedJobs, gstRegistered])

  const startTaxEdit = () => {
    setDraftGstRegistered(gstRegistered)
    setDraftGstNumber(gstNumber)
    setTaxError(null)
    setTaxSuccess(false)
    setTaxEditing(true)
  }

  const cancelTaxEdit = () => {
    setTaxEditing(false)
    setTaxError(null)
  }

  const handleSaveTax = async () => {
    if (!user) return
    setTaxError(null)
    setTaxSuccess(false)
    setTaxSaving(true)
    try {
      const supabase = createClient()
      const nextGstNumber = draftGstRegistered ? draftGstNumber.trim() || null : null
      const { error: err } = await supabase
        .from('profiles')
        .update({
          gst_registered: draftGstRegistered,
          gst_number: nextGstNumber,
        })
        .eq('id', user.id)
      if (err) throw err
      setGstRegistered(draftGstRegistered)
      setGstNumber(draftGstNumber)
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              gst_registered: draftGstRegistered,
              gst_number: nextGstNumber,
            }
          : prev
      )
      setTaxEditing(false)
      setTaxSuccess(true)
      setTimeout(() => setTaxSuccess(false), 3000)
    } catch (e) {
      setTaxError(e instanceof Error ? e.message : 'Failed to save')
    } finally {
      setTaxSaving(false)
    }
  }

  const startDetailsEdit = () => {
    setDraftFieldOfStudy(fieldOfStudy)
    setDraftInterests(interests)
    setDraftAcademicAchievements(academicAchievements)
    setDraftExtracurricularAchievements(extracurricularAchievements)
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
        field_of_study: draftFieldOfStudy.trim() || null,
        interests: draftInterests.trim() || null,
        academic_achievements: draftAcademicAchievements.trim() || null,
        extracurricular_achievements: draftExtracurricularAchievements.trim() || null,
      }
      const { error: err } = await supabase.from('profiles').update(payload).eq('id', user.id)
      if (err) throw err
      setFieldOfStudy(draftFieldOfStudy)
      setInterests(draftInterests)
      setAcademicAchievements(draftAcademicAchievements)
      setExtracurricularAchievements(draftExtracurricularAchievements)
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
      <main className="min-h-screen bg-canvas">
        <PageHero backHref="/dashboard/student" backLabel="Back to Dashboard" title="Your profile" />
        <section className="py-8 md:py-12">
          <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Main Profile Box */}
              <div className="bg-white rounded-2xl border border-ink/15 shadow-sm p-8 md:p-10 space-y-8">
              
                {/* Profile Picture */}
                <div className="flex justify-center">
                  {user ? (
                    <ProfileAvatarUpload
                      userId={user.id}
                      avatarUrl={profile?.avatar_url}
                      onUploaded={(url) => setProfile((prev) => (prev ? { ...prev, avatar_url: url } : prev))}
                    />
                  ) : null}
                </div>

                {/* Account details (fixed at signup) */}
                <div className="space-y-4">
                  <h2 className="text-sm font-semibold text-ink uppercase tracking-wide">Account information</h2>
                  <ProfileReadOnlyField
                    id="firstName"
                    label="First name"
                    value={accountIdentity.firstName}
                  />
                  <ProfileReadOnlyField
                    id="lastName"
                    label="Last name"
                    value={accountIdentity.lastName}
                  />
                  <ProfileReadOnlyField
                    id="university"
                    label="University"
                    value={accountIdentity.university}
                  />
                  <ProfileReadOnlyField
                    id="email"
                    label="Email"
                    value={accountIdentity.email}
                  />
                  <ProfileIdentityNote />
                </div>

                <ProfileEditableSection
                  title="Tax settings"
                  isEditing={taxEditing}
                  onEdit={startTaxEdit}
                  onCancel={cancelTaxEdit}
                  onSave={handleSaveTax}
                  saving={taxSaving}
                  error={taxError}
                  success={taxSuccess}
                  viewContent={
                    <div className="space-y-4">
                      <ProfileReadOnlyField
                        id="gstRegistrationView"
                        label="GST registration"
                        value={gstRegistered ? 'GST-registered' : 'Not GST-registered'}
                      />
                      {gstRegistered && (
                        <ProfileReadOnlyField
                          id="gstNumberView"
                          label="GST number"
                          value={gstNumber}
                        />
                      )}
                      <div className="p-4 bg-canvas/50 rounded-xl border border-ink/15">
                        <h3 className="text-sm font-semibold text-ink mb-2">Tax reminder</h3>
                        <p className="text-sm text-ink/80">
                          Swifto doesn&apos;t file income tax for you. You may need to declare your earnings and keep receipts for expenses.
                        </p>
                      </div>
                      <Link href="/settings/tax-gst" className="text-sm text-primary hover:text-accent transition-colors">
                        Tax &amp; GST help →
                      </Link>
                    </div>
                  }
                  editContent={
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <label htmlFor="gstRegistration" className="block text-sm font-medium text-ink">
                            GST registration
                          </label>
                          <InfoTooltip content="If you're GST-registered, you're responsible for GST on your total taxable activity across all work — not just Swifto." />
                        </div>
                        <select
                          id="gstRegistration"
                          value={draftGstRegistered ? 'registered' : 'not_registered'}
                          onChange={(e) => setDraftGstRegistered(e.target.value === 'registered')}
                          className="w-full h-11 px-4 rounded-xl border border-ink/20 text-ink focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                        >
                          <option value="not_registered">Not GST-registered</option>
                          <option value="registered">GST-registered</option>
                        </select>
                        <p className="text-xs text-ink/60">
                          GST registration is based on your total self-employed turnover across all work (not just Swifto). If you become GST-registered, update this here.
                        </p>
                        {draftGstRegistered && (
                          <div className="pt-2">
                            <label htmlFor="gstNumber" className="block text-sm font-medium text-ink mb-1">
                              GST number (optional)
                            </label>
                            <input
                              id="gstNumber"
                              type="text"
                              value={draftGstNumber}
                              onChange={(e) => setDraftGstNumber(e.target.value)}
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
                      <Link href="/settings/tax-gst" className="text-sm text-primary hover:text-accent transition-colors">
                        Tax &amp; GST help →
                      </Link>
                    </div>
                  }
                />

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
                      <ProfileReadOnlyField
                        id="fieldOfStudyView"
                        label="Field of study"
                        value={fieldOfStudy}
                      />
                      <ProfileReadOnlyField
                        id="interestsView"
                        label="Interests and hobbies"
                        value={interests}
                      />
                      <ProfileReadOnlyField
                        id="academicAchievementsView"
                        label="Academic achievements"
                        value={academicAchievements}
                      />
                      <ProfileReadOnlyField
                        id="extracurricularAchievementsView"
                        label="Extra-curricular achievements"
                        value={extracurricularAchievements}
                      />
                    </div>
                  }
                  editContent={
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="fieldOfStudy" className="block text-sm font-medium text-ink">
                          Field of study
                        </label>
                        <input
                          type="text"
                          id="fieldOfStudy"
                          value={draftFieldOfStudy}
                          onChange={(e) => setDraftFieldOfStudy(e.target.value)}
                          placeholder="e.g. Computer Science"
                          className="w-full h-11 px-4 rounded-xl border border-ink/20 text-ink placeholder-ink/50 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="interests" className="block text-sm font-medium text-ink">
                          Interests and hobbies
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
                        <label htmlFor="academicAchievements" className="block text-sm font-medium text-ink">
                          Academic achievements
                        </label>
                        <textarea
                          id="academicAchievements"
                          value={draftAcademicAchievements}
                          onChange={(e) => setDraftAcademicAchievements(e.target.value)}
                          placeholder="e.g. Dean's List - Fall 2023, Honors Student - 2022-2024"
                          rows={4}
                          className="w-full px-4 py-3 rounded-xl border border-ink/20 text-ink placeholder-ink/50 focus:outline-none focus:ring-2 focus:ring-primary resize-y"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="extracurricularAchievements" className="block text-sm font-medium text-ink">
                          Extra-curricular achievements
                        </label>
                        <textarea
                          id="extracurricularAchievements"
                          value={draftExtracurricularAchievements}
                          onChange={(e) => setDraftExtracurricularAchievements(e.target.value)}
                          placeholder="e.g. President of Student Council - 2023, Volunteer of the Year - 2022"
                          rows={4}
                          className="w-full px-4 py-3 rounded-xl border border-ink/20 text-ink placeholder-ink/50 focus:outline-none focus:ring-2 focus:ring-primary resize-y"
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
                      gstRegistered={gstRegistered}
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
