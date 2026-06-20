'use client'

import Link from 'next/link'
import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase/client'
import { SiteNav } from '@/components/site-nav'
import { WithdrawModal } from '@/components/withdraw-modal'
import { IconDisc } from '@/components/design/icon-disc'
import { DesignBadge } from '@/components/design/design-badge'
import { DESIGN_PHOTOS } from '@/lib/design-photos'
import { buildFullyCompletedJobIds, type JobCompletionVerify } from '@/lib/active-jobs'

type ActiveJobRow = {
  job_id: string
  job_name: string
  area: string
  price: number
  status: 'pending' | 'accepted'
  whenLabel: string
}

const QUICK_LINKS = [
  { href: '/profile/student', icon: 'user', label: 'Edit profile' },
  { href: '/dashboard/student/jobs-applied', icon: 'briefcase', label: 'Active jobs' },
  { href: '/dashboard/student/jobs-completed', icon: 'check', label: 'Completed jobs' },
  { href: '/dashboard/student/achievements', icon: 'trophy', label: 'Achievements' },
]

function QuickIcon({ name }: { name: string }) {
  const paths: Record<string, JSX.Element> = {
    user: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
    briefcase: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
    check: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
    trophy: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />,
  }
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {paths[name]}
    </svg>
  )
}

export default function StudentDashboardPage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<{ first_name: string; last_name: string; balance_cents?: number } | null>(null)
  const [showWithdraw, setShowWithdraw] = useState(false)
  const [activeJobCount, setActiveJobCount] = useState(0)
  const [pendingJobCount, setPendingJobCount] = useState(0)
  const [completedCount, setCompletedCount] = useState(0)
  const [activeJobs, setActiveJobs] = useState<ActiveJobRow[]>([])

  const displayName = useMemo(() => {
    if (profile) {
      const n = [profile.first_name, profile.last_name].filter(Boolean).join(' ').trim()
      if (n) return n
    }
    const meta = (user as any)?.user_metadata
    const metaName = [meta?.first_name, meta?.last_name].filter(Boolean).join(' ').trim()
    if (metaName) return metaName
    const fullName = (user as any)?.raw_user_meta_data?.full_name
    if (typeof fullName === 'string' && fullName.trim()) return fullName.trim()
    if (user?.email) {
      const prefix = user.email.split('@')[0]
      if (prefix) return prefix.replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    }
    return null
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
        .select('first_name, last_name, balance_cents')
        .eq('id', user.id)
        .single()
      if (data) {
        setProfile(data)
      } else if (user.user_metadata?.first_name != null || user.user_metadata?.last_name != null) {
        setProfile({
          first_name: user.user_metadata.first_name ?? '',
          last_name: user.user_metadata.last_name ?? '',
          balance_cents: 0,
        })
      }
    }
    fetchProfile()
  }, [user])

  useEffect(() => {
    async function fetchActiveCounts() {
      if (!user) {
        setActiveJobCount(0)
        setPendingJobCount(0)
        setCompletedCount(0)
        setActiveJobs([])
        return
      }
      const supabase = createClient()
      const { data: appsData } = await supabase
        .from('job_applications')
        .select('job_id, status')
        .eq('student_id', user.id)
        .in('status', ['pending', 'accepted'])

      const jobIds = appsData?.length ? Array.from(new Set(appsData.map((a) => a.job_id))) : []
      const [{ data: jobsData }, { data: compData }, { data: allCompData }] = await Promise.all([
        jobIds.length
          ? supabase.from('jobs').select('id, job_name, area, price, completion_date, is_flexible, status').in('id', jobIds)
          : Promise.resolve({ data: [] as { id: string; job_name: string; area: string; price: number; completion_date: string | null; is_flexible: boolean; status: string }[] }),
        jobIds.length
          ? supabase.from('job_completions').select('job_id, lister_verified_at, student_verified_at').eq('student_id', user.id).in('job_id', jobIds)
          : Promise.resolve({ data: [] as JobCompletionVerify[] }),
        supabase.from('job_completions').select('job_id, lister_verified_at, student_verified_at').eq('student_id', user.id),
      ])

      const completedTotal = (allCompData ?? []).filter((c) => c.lister_verified_at && c.student_verified_at).length

      if (!appsData?.length) {
        setActiveJobCount(0)
        setPendingJobCount(0)
        setCompletedCount(completedTotal)
        setActiveJobs([])
        return
      }

      const jobStatusMap: Record<string, string> = {}
      const jobsMap: Record<string, NonNullable<typeof jobsData>[number]> = {}
      for (const j of jobsData ?? []) {
        jobStatusMap[j.id] = j.status
        jobsMap[j.id] = j
      }
      const fullyCompleted = buildFullyCompletedJobIds(
        (compData ?? []) as JobCompletionVerify[],
        jobStatusMap
      )

      const activeApps = appsData.filter((a) => !fullyCompleted.has(a.job_id))
      setActiveJobCount(activeApps.length)
      setPendingJobCount(activeApps.filter((a) => a.status === 'pending').length)
      setCompletedCount(completedTotal)

      const rows: ActiveJobRow[] = activeApps.slice(0, 5).map((a) => {
        const job = jobsMap[a.job_id]
        const whenLabel = job?.is_flexible
          ? 'Flexible'
          : job?.completion_date
            ? new Date(job.completion_date).toLocaleDateString('en-NZ', { day: 'numeric', month: 'short' })
            : 'TBD'
        return {
          job_id: a.job_id,
          job_name: job?.job_name ?? 'Job',
          area: job?.area ?? '—',
          price: job?.price ?? 0,
          status: a.status,
          whenLabel,
        }
      })
      setActiveJobs(rows)
    }
    fetchActiveCounts()
  }, [user])

  const balance = ((profile?.balance_cents ?? 0) / 100).toFixed(2)

  return (
    <>
      <SiteNav />
      <main className="min-h-screen bg-canvas">
        <div className="swifto-content py-10 md:pt-10 md:pb-[84px]">
          <div className="flex items-center gap-3.5 mb-6 md:mb-[26px]">
            <span className="w-[54px] h-[54px] rounded-full overflow-hidden shadow-card shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={DESIGN_PHOTOS.avatar1} alt="" className="w-full h-full object-cover" />
            </span>
            <div>
              <p className="text-sm text-ink-3">Welcome back,</p>
              <h1 className="text-[28px]">{displayName || 'User'}</h1>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1.1fr_2fr] gap-4 md:gap-[18px] mb-4 md:mb-[18px]">
            <div className="swifto-card overflow-hidden bg-hero-band relative p-0">
              <div className="p-6 md:p-[26px] text-white relative z-10">
                <div className="flex items-center gap-2.5">
                  <IconDisc tone="brand" size={40} className="!bg-white/20 !text-white">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </IconDisc>
                  <span className="text-[13.5px] text-white/85 font-semibold">Available balance</span>
                </div>
                <p className="font-display font-extrabold text-[46px] mt-4 leading-none">${balance}</p>
                <button
                  type="button"
                  onClick={() => setShowWithdraw(true)}
                  disabled={(profile?.balance_cents ?? 0) < 100}
                  className="swifto-btn-white w-full mt-[18px] h-12 disabled:opacity-60"
                >
                  Withdraw earnings
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M7 7h10v10" />
                  </svg>
                </button>
              </div>
              <span className="absolute w-[200px] h-[200px] rounded-full bg-primary/45 blur-[36px] -right-14 -bottom-[70px] pointer-events-none" aria-hidden />
            </div>

            <div className="grid sm:grid-cols-3 gap-4 md:gap-[18px]">
              {[
                { label: 'Active jobs', value: String(activeJobCount), sub: pendingJobCount > 0 ? `${pendingJobCount} pending` : 'applications', tone: 'brand' as const, icon: 'briefcase' },
                { label: 'Completed', value: String(completedCount), sub: 'all-time', tone: 'success' as const, icon: 'check' },
                { label: 'Rating', value: '—', sub: 'from reviews', tone: 'accent' as const, icon: 'star' },
              ].map((s) => (
                <div key={s.label} className="swifto-card p-6 flex flex-col justify-between min-h-[140px]">
                  <IconDisc tone={s.tone}>
                    <QuickIcon name={s.icon === 'star' ? 'trophy' : s.icon} />
                  </IconDisc>
                  <div className="mt-[18px]">
                    <p className="font-display font-extrabold text-[34px] leading-none">{s.value}</p>
                    <p className="text-sm font-bold mt-0.5">{s.label}</p>
                    <p className="text-xs text-ink-3 mt-0.5">{s.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {showWithdraw && user && (
            <WithdrawModal
              balanceCents={profile?.balance_cents ?? 0}
              onClose={() => setShowWithdraw(false)}
              onSuccess={async () => {
                const supabase = createClient()
                const { data } = await supabase.from('profiles').select('first_name, last_name, balance_cents').eq('id', user.id).single()
                if (data) setProfile(data)
              }}
            />
          )}

          <div className="grid lg:grid-cols-[2fr_1.1fr] gap-4 md:gap-[18px]">
            <div className="swifto-card p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl">Active jobs</h2>
                <Link href="/browse" className="swifto-btn-ghost h-10 px-4 text-sm">
                  Find more
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
              {activeJobs.length === 0 ? (
                <p className="text-ink-2 text-sm py-6 text-center">
                  No active jobs yet.{' '}
                  <Link href="/browse" className="text-brand font-semibold hover:text-primary">Browse jobs</Link>
                </p>
              ) : (
                <div className="flex flex-col gap-3">
                  {activeJobs.map((j) => (
                    <Link
                      key={j.job_id}
                      href="/dashboard/student/jobs-applied"
                      className="flex items-center gap-3.5 p-3 rounded-2xl border border-line-card hover:border-brand/30 hover:bg-brand-soft/30 transition-colors"
                    >
                      <span className="w-[52px] h-[52px] rounded-xl bg-brand-soft shrink-0 flex items-center justify-center text-brand">
                        <QuickIcon name="briefcase" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[15.5px] truncate">{j.job_name}</p>
                        <p className="text-[13px] text-ink-3 mt-0.5">{j.area} · {j.whenLabel}</p>
                      </div>
                      <DesignBadge tone={j.status === 'pending' ? 'warning' : 'brand'}>
                        {j.status === 'pending' ? 'Pending' : 'Accepted'}
                      </DesignBadge>
                      <span className="font-display font-extrabold text-primary text-lg shrink-0">${j.price}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4 md:gap-[18px]">
              <div className="swifto-card p-5 bg-primary-soft border-primary/20">
                <div className="flex items-center gap-3">
                  <IconDisc tone="accent" size={48} className="!bg-white">
                    <QuickIcon name="trophy" />
                  </IconDisc>
                  <div>
                    <p className="font-extrabold text-base text-accent-deep">Rising star</p>
                    <p className="text-[13px] text-ink-2 mt-0.5">Track milestones on Achievements</p>
                  </div>
                </div>
                <Link href="/dashboard/student/achievements" className="swifto-btn-primary w-full mt-4 h-10 text-sm">
                  View achievements
                </Link>
              </div>
              {QUICK_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="swifto-card swifto-card-hover p-4 flex items-center gap-3"
                >
                  <IconDisc tone="brand" size={42}>
                    <QuickIcon name={link.icon} />
                  </IconDisc>
                  <span className="font-semibold text-[15px]">{link.label}</span>
                  <svg className="w-[18px] h-[18px] text-ink-3 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
