'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { SiteNav } from '@/components/site-nav'
import { PageHero } from '@/components/page-hero'
import { useAuth } from '@/lib/auth-context'
import {
  fetchStudentAchievementStats,
  getCountProgress,
  getEarningsProgress,
  type StudentAchievementStats,
} from '@/lib/student-achievements'

const ACH = {
  yellow: { unlockedText: 'text-yellow-600' },
  orange: { unlockedText: 'text-orange-600' },
  purple: { unlockedText: 'text-purple-600' },
  blue: { unlockedText: 'text-blue-600' },
  green: { unlockedText: 'text-green-600' },
  indigo: { unlockedText: 'text-indigo-600' },
  emerald: { unlockedText: 'text-emerald-600' },
  pink: { unlockedText: 'text-pink-600' },
  cyan: { unlockedText: 'text-cyan-600' },
  red: { unlockedText: 'text-red-600' },
}

export default function AchievementsPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<StudentAchievementStats>({
    totalEarned: 0,
    completedJobCount: 0,
    byCategory: {},
  })

  useEffect(() => {
    if (!user) return
    fetchStudentAchievementStats(user.id).then(setStats).catch(() => {})
  }, [user])

  const earn10 = getEarningsProgress(stats.totalEarned, 10, ACH.yellow)
  const earn100 = getEarningsProgress(stats.totalEarned, 100, ACH.yellow)
  const earn200 = getEarningsProgress(stats.totalEarned, 200, ACH.yellow)
  const earn500 = getEarningsProgress(stats.totalEarned, 500, ACH.orange)
  const earn750 = getEarningsProgress(stats.totalEarned, 750, ACH.orange)
  const earn1000 = getEarningsProgress(stats.totalEarned, 1000, ACH.purple)
  const moving = getCountProgress(stats.byCategory.moving ?? 0, 5, ACH.blue)
  const cleaning = getCountProgress(stats.byCategory.cleaning ?? 0, 10, ACH.green)
  const assembly = getCountProgress(stats.byCategory.assembly ?? 0, 3, ACH.indigo)
  const yardWork = getCountProgress(stats.byCategory['yard-work'] ?? 0, 7, ACH.emerald)
  const petCare = getCountProgress(stats.byCategory['pet-care'] ?? 0, 5, ACH.pink)
  const delivery = getCountProgress(stats.byCategory.delivery ?? 0, 8, ACH.cyan)
  const jobs10 = getCountProgress(stats.completedJobCount, 10, ACH.yellow)
  const jobs25 = getCountProgress(stats.completedJobCount, 25, ACH.orange)
  const jobs50 = getCountProgress(stats.completedJobCount, 50, ACH.red)
  const jobs100 = getCountProgress(stats.completedJobCount, 100, ACH.purple)

  return (
    <>
      <SiteNav />
      <main className="min-h-screen bg-canvas">
        <PageHero
          backHref="/dashboard/student"
          backLabel="Back to Dashboard"
          title="Achievements"
          subtitle="Track your progress and unlock milestones"
        />
        <section className="py-8 md:py-12">
          <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
            <div className="space-y-6">
              {/* Earnings Milestones Section */}
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-ink mb-6">Earnings Milestones</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Level 1 - $10 */}
                  <div className="bg-white rounded-2xl border-2 border-yellow-400 shadow-lg p-6 relative overflow-hidden hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-400/20 rounded-bl-full"></div>
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                        <svg className="w-10 h-10 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.482 4.482 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-ink mb-1">First Dollar</h3>
                      <p className="text-sm text-ink/70 mb-3">Earn $10</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-ink/10 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${earn10.percent}%` }}></div>
                        </div>
                        <span className={`text-xs font-semibold ${earn10.statusClassName}`}>{earn10.statusLabel}</span>
                      </div>
                    </div>
                  </div>

                  {/* Level 10 - $100 */}
                  <div className="bg-white rounded-2xl border-2 border-yellow-400 shadow-lg p-6 relative overflow-hidden hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-400/20 rounded-bl-full"></div>
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                        <svg className="w-10 h-10 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.482 4.482 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-ink mb-1">Hundred Club</h3>
                      <p className="text-sm text-ink/70 mb-3">Earn $100</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-ink/10 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${earn100.percent}%` }}></div>
                        </div>
                        <span className={`text-xs font-semibold ${earn100.statusClassName}`}>{earn100.statusLabel}</span>
                      </div>
                    </div>
                  </div>

                  {/* Level 20 - $200 */}
                  <div className="bg-white rounded-2xl border-2 border-yellow-400 shadow-lg p-6 relative overflow-hidden hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-400/20 rounded-bl-full"></div>
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                        <svg className="w-10 h-10 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.482 4.482 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-ink mb-1">Two Hundred</h3>
                      <p className="text-sm text-ink/70 mb-3">Earn $200</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-ink/10 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${earn200.percent}%` }}></div>
                        </div>
                        <span className={`text-xs font-semibold ${earn200.statusClassName}`}>{earn200.statusLabel}</span>
                      </div>
                    </div>
                  </div>

                  {/* Level 50 - $500 */}
                  <div className="bg-white rounded-2xl border-2 border-orange-400 shadow-lg p-6 relative overflow-hidden hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-orange-400/20 rounded-bl-full"></div>
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                        <svg className="w-10 h-10 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.482 4.482 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-ink mb-1">Half Grand</h3>
                      <p className="text-sm text-ink/70 mb-3">Earn $500</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-ink/10 rounded-full overflow-hidden">
                          <div className="h-full bg-orange-400 rounded-full" style={{ width: `${earn500.percent}%` }}></div>
                        </div>
                        <span className={`text-xs font-semibold ${earn500.statusClassName}`}>{earn500.statusLabel}</span>
                      </div>
                    </div>
                  </div>

                  {/* Level 75 - $750 */}
                  <div className="bg-white rounded-2xl border-2 border-orange-400 shadow-lg p-6 relative overflow-hidden hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-orange-400/20 rounded-bl-full"></div>
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                        <svg className="w-10 h-10 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.482 4.482 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-ink mb-1">Three Quarters</h3>
                      <p className="text-sm text-ink/70 mb-3">Earn $750</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-ink/10 rounded-full overflow-hidden">
                          <div className="h-full bg-orange-400 rounded-full" style={{ width: `${earn750.percent}%` }}></div>
                        </div>
                        <span className={`text-xs font-semibold ${earn750.statusClassName}`}>{earn750.statusLabel}</span>
                      </div>
                    </div>
                  </div>

                  {/* Level 100 - $1000 */}
                  <div className="bg-white rounded-2xl border-2 border-purple-400 shadow-lg p-6 relative overflow-hidden hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-purple-400/20 rounded-bl-full"></div>
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                        <svg className="w-10 h-10 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.482 4.482 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-ink mb-1">Grand Master</h3>
                      <p className="text-sm text-ink/70 mb-3">Earn $1,000</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-ink/10 rounded-full overflow-hidden">
                          <div className="h-full bg-purple-400 rounded-full" style={{ width: `${earn1000.percent}%` }}></div>
                        </div>
                        <span className={`text-xs font-semibold ${earn1000.statusClassName}`}>{earn1000.statusLabel}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Type Achievements Section */}
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-ink mb-6">Job Type Master</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Moving Jobs */}
                  <div className="bg-white rounded-2xl border-2 border-blue-400 shadow-lg p-6 relative overflow-hidden hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-blue-400/20 rounded-bl-full"></div>
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                        <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-ink mb-1">Moving Expert</h3>
                      <p className="text-sm text-ink/70 mb-3">Complete 5 Moving jobs</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-ink/10 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-400 rounded-full" style={{ width: `${moving.percent}%` }}></div>
                        </div>
                        <span className={`text-xs font-semibold ${moving.statusClassName}`}>{moving.statusLabel}</span>
                      </div>
                    </div>
                  </div>

                  {/* Cleaning Jobs */}
                  <div className="bg-white rounded-2xl border-2 border-green-400 shadow-lg p-6 relative overflow-hidden hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-green-400/20 rounded-bl-full"></div>
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-ink mb-1">Cleaning Pro</h3>
                      <p className="text-sm text-ink/70 mb-3">Complete 10 Cleaning jobs</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-ink/10 rounded-full overflow-hidden">
                          <div className="h-full bg-green-400 rounded-full" style={{ width: `${cleaning.percent}%` }}></div>
                        </div>
                        <span className={`text-xs font-semibold ${cleaning.statusClassName}`}>{cleaning.statusLabel}</span>
                      </div>
                    </div>
                  </div>

                  {/* Assembly Jobs */}
                  <div className="bg-white rounded-2xl border-2 border-indigo-400 shadow-lg p-6 relative overflow-hidden hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-400/20 rounded-bl-full"></div>
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                        <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-ink mb-1">Assembly Ace</h3>
                      <p className="text-sm text-ink/70 mb-3">Complete 3 Assembly jobs</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-ink/10 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${assembly.percent}%` }}></div>
                        </div>
                        <span className={`text-xs font-semibold ${assembly.statusClassName}`}>{assembly.statusLabel}</span>
                      </div>
                    </div>
                  </div>

                  {/* Yard Work Jobs */}
                  <div className="bg-white rounded-2xl border-2 border-emerald-400 shadow-lg p-6 relative overflow-hidden hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-400/20 rounded-bl-full"></div>
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                        <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-ink mb-1">Garden Guru</h3>
                      <p className="text-sm text-ink/70 mb-3">Complete 7 Yard Work jobs</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-ink/10 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${yardWork.percent}%` }}></div>
                        </div>
                        <span className={`text-xs font-semibold ${yardWork.statusClassName}`}>{yardWork.statusLabel}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pet Care Jobs */}
                  <div className="bg-white rounded-2xl border-2 border-pink-400 shadow-lg p-6 relative overflow-hidden hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-pink-400/20 rounded-bl-full"></div>
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center mb-4">
                        <svg className="w-10 h-10 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-ink mb-1">Pet Lover</h3>
                      <p className="text-sm text-ink/70 mb-3">Complete 5 Pet Care jobs</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-ink/10 rounded-full overflow-hidden">
                          <div className="h-full bg-pink-400 rounded-full" style={{ width: `${petCare.percent}%` }}></div>
                        </div>
                        <span className={`text-xs font-semibold ${petCare.statusClassName}`}>{petCare.statusLabel}</span>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Jobs */}
                  <div className="bg-white rounded-2xl border-2 border-cyan-400 shadow-lg p-6 relative overflow-hidden hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-400/20 rounded-bl-full"></div>
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-cyan-100 flex items-center justify-center mb-4">
                        <svg className="w-10 h-10 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-ink mb-1">Delivery Driver</h3>
                      <p className="text-sm text-ink/70 mb-3">Complete 8 Delivery jobs</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-ink/10 rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${delivery.percent}%` }}></div>
                        </div>
                        <span className={`text-xs font-semibold ${delivery.statusClassName}`}>{delivery.statusLabel}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Jobs Completed Milestones */}
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-ink mb-6">Total Jobs Milestones</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* 10 Jobs */}
                  <div className="bg-white rounded-2xl border-2 border-yellow-400 shadow-lg p-6 relative overflow-hidden hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-400/20 rounded-bl-full"></div>
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                        <span className="text-2xl font-bold text-yellow-600">10</span>
                      </div>
                      <h3 className="text-xl font-bold text-ink mb-1">Getting Started</h3>
                      <p className="text-sm text-ink/70 mb-3">Complete 10 jobs</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-ink/10 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${jobs10.percent}%` }}></div>
                        </div>
                        <span className={`text-xs font-semibold ${jobs10.statusClassName}`}>{jobs10.statusLabel}</span>
                      </div>
                    </div>
                  </div>

                  {/* 25 Jobs */}
                  <div className="bg-white rounded-2xl border-2 border-orange-400 shadow-lg p-6 relative overflow-hidden hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-orange-400/20 rounded-bl-full"></div>
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                        <span className="text-2xl font-bold text-orange-600">25</span>
                      </div>
                      <h3 className="text-xl font-bold text-ink mb-1">Quarter Century</h3>
                      <p className="text-sm text-ink/70 mb-3">Complete 25 jobs</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-ink/10 rounded-full overflow-hidden">
                          <div className="h-full bg-orange-400 rounded-full" style={{ width: `${jobs25.percent}%` }}></div>
                        </div>
                        <span className={`text-xs font-semibold ${jobs25.statusClassName}`}>{jobs25.statusLabel}</span>
                      </div>
                    </div>
                  </div>

                  {/* 50 Jobs */}
                  <div className="bg-white rounded-2xl border-2 border-red-400 shadow-lg p-6 relative overflow-hidden hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-red-400/20 rounded-bl-full"></div>
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                        <span className="text-2xl font-bold text-red-600">50</span>
                      </div>
                      <h3 className="text-xl font-bold text-ink mb-1">Half Century</h3>
                      <p className="text-sm text-ink/70 mb-3">Complete 50 jobs</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-ink/10 rounded-full overflow-hidden">
                          <div className="h-full bg-red-400 rounded-full" style={{ width: `${jobs50.percent}%` }}></div>
                        </div>
                        <span className={`text-xs font-semibold ${jobs50.statusClassName}`}>{jobs50.statusLabel}</span>
                      </div>
                    </div>
                  </div>

                  {/* 100 Jobs */}
                  <div className="bg-white rounded-2xl border-2 border-purple-400 shadow-lg p-6 relative overflow-hidden hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-purple-400/20 rounded-bl-full"></div>
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                        <span className="text-2xl font-bold text-purple-600">100</span>
                      </div>
                      <h3 className="text-xl font-bold text-ink mb-1">Century Club</h3>
                      <p className="text-sm text-ink/70 mb-3">Complete 100 jobs</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-ink/10 rounded-full overflow-hidden">
                          <div className="h-full bg-purple-400 rounded-full" style={{ width: `${jobs100.percent}%` }}></div>
                        </div>
                        <span className={`text-xs font-semibold ${jobs100.statusClassName}`}>{jobs100.statusLabel}</span>
                      </div>
                    </div>
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
