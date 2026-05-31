'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { SiteNav } from '@/components/site-nav'
import { AchievementCard } from '@/components/achievement-card'
import { useAuth } from '@/lib/auth-context'
import {
  EARNINGS_MILESTONES,
  JOB_TYPE_MILESTONES,
  TOTAL_JOBS_MILESTONES,
  countUnlockedAchievements,
  fetchStudentAchievementStats,
  getCountProgress,
  getEarningsProgress,
  type StudentAchievementStats,
} from '@/lib/student-achievements'

function DollarIcon({ className }: { className: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.482 4.482 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
        clipRule="evenodd"
      />
    </svg>
  )
}

const JOB_TYPE_ICONS: Record<string, React.ReactNode> = {
  moving: (
    <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>
  ),
  cleaning: (
    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  assembly: (
    <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
    </svg>
  ),
  'yard-work': (
    <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  'pet-care': (
    <svg className="w-10 h-10 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  delivery: (
    <svg className="w-10 h-10 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
    </svg>
  ),
}

export default function AchievementsPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<StudentAchievementStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      if (!user) {
        setStats(null)
        setLoading(false)
        return
      }
      setLoading(true)
      try {
        const data = await fetchStudentAchievementStats(user.id)
        setStats(data)
      } catch {
        setStats({ totalEarned: 0, completedJobCount: 0, byCategory: {} })
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user])

  const unlockedSummary = stats ? countUnlockedAchievements(stats) : null

  return (
    <>
      <SiteNav />
      <main className="min-h-screen bg-primary">
        <section className="py-16 md:py-24">
          <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
            <div className="mb-8">
              <Link
                href="/dashboard/student"
                className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
              </Link>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Achievements</h1>
              <p className="text-white/80 text-lg">Track your progress and unlock milestones</p>
              {!loading && unlockedSummary && (
                <p className="text-white/70 text-sm mt-2">
                  {unlockedSummary.unlocked} of {unlockedSummary.total} achievements unlocked
                </p>
              )}
            </div>

            {loading ? (
              <p className="text-white/80">Loading achievements…</p>
            ) : stats ? (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                    Earnings Milestones
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {EARNINGS_MILESTONES.map((milestone) => (
                      <AchievementCard
                        key={milestone.id}
                        title={milestone.title}
                        description={`Earn $${milestone.target.toLocaleString()}`}
                        theme={milestone.theme}
                        progress={getEarningsProgress(
                          stats.totalEarned,
                          milestone.target,
                          milestone.theme
                        )}
                        icon={
                          <DollarIcon className={`w-10 h-10 ${milestone.theme.iconColor}`} />
                        }
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Job Type Master</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {JOB_TYPE_MILESTONES.map((milestone) => {
                      const count = stats.byCategory[milestone.category] ?? 0
                      return (
                        <AchievementCard
                          key={milestone.id}
                          title={milestone.title}
                          description={`Complete ${milestone.target} ${milestone.categoryLabel} jobs`}
                          theme={milestone.theme}
                          progress={getCountProgress(count, milestone.target, milestone.theme)}
                          icon={JOB_TYPE_ICONS[milestone.category]}
                        />
                      )
                    })}
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                    Total Jobs Milestones
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {TOTAL_JOBS_MILESTONES.map((milestone) => (
                      <AchievementCard
                        key={milestone.id}
                        title={milestone.title}
                        description={`Complete ${milestone.target} jobs`}
                        theme={milestone.theme}
                        progress={getCountProgress(
                          stats.completedJobCount,
                          milestone.target,
                          milestone.theme
                        )}
                        icon={
                          <span className={`text-2xl font-bold ${milestone.theme.iconColor}`}>
                            {milestone.target}
                          </span>
                        }
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </section>
      </main>
    </>
  )
}
