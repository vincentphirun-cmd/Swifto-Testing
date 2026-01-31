'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { SiteNav } from '@/components/site-nav'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase/client'

type Profile = {
  first_name: string
  last_name: string
  university: string | null
}

export default function StudentProfilePage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)

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

  const university = useMemo(() => {
    const metaUni = (user as any)?.user_metadata?.university
    if (metaUni) return metaUni as string
    if (profile?.university) return profile.university
    return ''
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
        .select('first_name, last_name, university')
        .eq('id', user.id)
        .single()
      if (data) {
        setProfile(data as Profile)
      }
    }
    fetchProfile()
  }, [user])

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

                {/* Name */}
                <div className="text-center">
                  <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-ink">
                    {displayName}
                  </h1>
                </div>

                {/* Email */}
                <div className="text-center">
                  <p className="text-base text-ink/80">
                    {user?.email ?? ''}
                  </p>
                </div>

                {/* University */}
                <div className="space-y-2">
                  <label htmlFor="university" className="block text-lg font-semibold text-ink">
                    University
                  </label>
                  <input
                    id="university"
                    name="university"
                    type="text"
                    value={university}
                    readOnly
                    className="w-full h-12 px-4 rounded-xl border border-ink/20 text-ink bg-gray-50"
                  />
                </div>

                {/* What they are Studying */}
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
                </div>

                {/* Level Progress Bar */}
                <div className="space-y-4 pt-4 border-t border-ink/10">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-ink">Level 9</h2>
                    <span className="text-sm text-ink/70">$455/$500 to Level 10</span>
                  </div>
                  <div className="w-full h-4 bg-canvas rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: '91%' }}
                    ></div>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">Total Earnt: $455</p>
                  </div>
                </div>

                {/* Past Jobs */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-ink">Past Jobs</h2>
                  <div className="space-y-4">
                    {[
                      { title: 'Lawn mowing', date: '2 days ago', payout: '$45', status: 'Completed' },
                      { title: 'Moving boxes', date: '1 week ago', payout: '$120', status: 'Completed' },
                      { title: 'Vacuuming', date: '2 weeks ago', payout: '$30', status: 'Completed' },
                      { title: 'Dog sitting', date: '3 weeks ago', payout: '$80', status: 'Completed' },
                      { title: 'Car wash', date: '1 month ago', payout: '$25', status: 'Completed' },
                      { title: 'Furniture assembly', date: '1 month ago', payout: '$95', status: 'Completed' },
                      { title: 'Garden cleanup', date: '6 weeks ago', payout: '$60', status: 'Completed' },
                    ].map((job, index) => (
                      <div key={index} className="p-4 rounded-xl border border-ink/15 bg-canvas/50 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-ink">{job.title}</h3>
                            <p className="text-sm text-ink/70">{job.date}</p>
                          </div>
                          <span className="text-base font-semibold text-primary">{job.payout}</span>
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
