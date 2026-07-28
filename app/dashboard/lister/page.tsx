'use client'

import Link from 'next/link'
import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase/client'
import { SiteNav } from '@/components/site-nav'
import { DepositModal } from '@/components/deposit-modal'
import { IconDisc } from '@/components/design/icon-disc'
import { DesignBadge } from '@/components/design/design-badge'
import { ProfileAvatar } from '@/components/profile-avatar'
import { captureEvent } from '@/lib/posthog'
import { buildFullyCompletedJobIds, type JobCompletionVerify } from '@/lib/active-jobs'

type ActiveListingRow = {
  id: string
  job_name: string
  area: string
  price: number
  whenLabel: string
  pendingCount: number
}

export default function ListerDashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const [profile, setProfile] = useState<{ first_name: string; last_name: string; balance_cents?: number; avatar_url?: string | null } | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [sessionRefreshing, setSessionRefreshing] = useState(false)
  const [depositSuccessBanner, setDepositSuccessBanner] = useState(false)
  const [showDeposit, setShowDeposit] = useState(false)
  const [activeJobCount, setActiveJobCount] = useState(0)
  const [completedJobCount, setCompletedJobCount] = useState(0)
  const [pendingApplicationCount, setPendingApplicationCount] = useState(0)
  const [activeListings, setActiveListings] = useState<ActiveListingRow[]>([])
  const depositReturnHandled = useRef(false)

  const displayName = useMemo(() => {
    // 1) Profile record (DB is canonical after signup)
    if (profile) {
      const n = [profile.first_name, profile.last_name].filter(Boolean).join(' ').trim()
      if (n) return n
    }
    // 2) user_metadata (set at signup, before profile fetched)
    const meta = (user as any)?.user_metadata
    const metaName = [meta?.first_name, meta?.last_name].filter(Boolean).join(' ').trim()
    if (metaName) return metaName
    // 3) raw_user_meta_data full_name (some auth flows)
    const fullName = (user as any)?.raw_user_meta_data?.full_name
    if (typeof fullName === 'string' && fullName.trim()) return fullName.trim()
    // 4) Email prefix
    if (user?.email) {
      const prefix = user.email.split('@')[0]
      if (prefix) return prefix.replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    }
    return null
  }, [user, profile])

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null)
      setProfileLoading(false)
      return
    }

    setProfileLoading(true)
    const supabase = createClient()

    try {
      const { data } = await supabase
        .from('profiles')
        .select('first_name, last_name, balance_cents, avatar_url')
        .eq('id', user.id)
        .single()

      if (data) {
        setProfile(data)
      } else {
        setProfile((prev) => {
          if (prev) return prev
          return {
            first_name: (user as any).user_metadata?.first_name ?? '',
            last_name: (user as any).user_metadata?.last_name ?? '',
            balance_cents: 0,
            avatar_url: null,
          }
        })
      }
    } finally {
      setProfileLoading(false)
    }
  }, [user])

  // After Stripe redirect, refresh auth session before treating user as logged out
  useEffect(() => {
    if (depositReturnHandled.current) return
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    if (params.get('deposit') !== 'success') return

    depositReturnHandled.current = true
    let cancelled = false

    async function refreshAfterDeposit() {
      setSessionRefreshing(true)
      const supabase = createClient()
      try {
        await supabase.auth.getSession()
        await supabase.auth.refreshSession()
        await fetchProfile()
      } catch {
        // Session may still restore via auth listener
      }
      if (cancelled) return
      captureEvent('deposit_completed')
      setDepositSuccessBanner(true)
      window.history.replaceState({}, '', '/dashboard/lister')
      setSessionRefreshing(false)
    }

    void refreshAfterDeposit()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (authLoading) return
    void fetchProfile()
  }, [authLoading, fetchProfile])

  useEffect(() => {
    async function fetchActiveCounts() {
      if (!user) {
        setActiveJobCount(0)
        setCompletedJobCount(0)
        setPendingApplicationCount(0)
        setActiveListings([])
        return
      }
      const supabase = createClient()
      const { count: completedCountExact } = await supabase
        .from('job_completions')
        .select('*', { count: 'exact', head: true })
        .eq('lister_id', user.id)
      const { data: jobsData } = await supabase
        .from('jobs')
        .select('id, job_name, area, price, completion_date, is_flexible, status')
        .eq('lister_id', user.id)
        .in('status', ['active', 'in_progress'])

      if (!jobsData?.length) {
        setActiveJobCount(0)
        setCompletedJobCount(completedCountExact ?? 0)
        setPendingApplicationCount(0)
        setActiveListings([])
        return
      }

      const { data: compData } = await supabase
        .from('job_completions')
        .select('job_id, lister_verified_at, student_verified_at')
        .eq('lister_id', user.id)

      const jobStatusMap: Record<string, string> = {}
      for (const j of jobsData) jobStatusMap[j.id] = j.status
      const fullyCompleted = buildFullyCompletedJobIds(
        (compData ?? []) as JobCompletionVerify[],
        jobStatusMap
      )
      const activeJobIds = jobsData.filter((j) => !fullyCompleted.has(j.id)).map((j) => j.id)
      setActiveJobCount(activeJobIds.length)
      setCompletedJobCount(completedCountExact ?? 0)

      if (activeJobIds.length === 0) {
        setPendingApplicationCount(0)
        setActiveListings([])
        return
      }

      const { data: pendingApps, count } = await supabase
        .from('job_applications')
        .select('job_id, status', { count: 'exact' })
        .in('job_id', activeJobIds)
        .eq('status', 'pending')
      setPendingApplicationCount(count ?? 0)

      const pendingByJob: Record<string, number> = {}
      for (const row of pendingApps ?? []) {
        pendingByJob[row.job_id] = (pendingByJob[row.job_id] ?? 0) + 1
      }

      setActiveListings(
        jobsData
          .filter((job) => activeJobIds.includes(job.id))
          .slice(0, 5)
          .map((job) => ({
            id: job.id,
            job_name: job.job_name,
            area: job.area,
            price: job.price,
            whenLabel: job.is_flexible
              ? 'Flexible'
              : job.completion_date
                ? new Date(job.completion_date).toLocaleDateString('en-NZ', { day: 'numeric', month: 'short' })
                : 'TBD',
            pendingCount: pendingByJob[job.id] ?? 0,
          }))
      )
    }
    fetchActiveCounts()
  }, [user?.id])

  const balanceLoading = sessionRefreshing || profileLoading
  const showDashboardContent = !!user
  const hasKnownBalance = profile?.balance_cents != null
  const balanceLabel = hasKnownBalance
    ? `$${((profile?.balance_cents ?? 0) / 100).toFixed(2)}`
    : balanceLoading
      ? 'Loading…'
      : '$0.00'

  if (!showDashboardContent) {
    return (
      <>
        <SiteNav />
        <main className="min-h-screen bg-canvas flex items-center justify-center">
          <p className="text-ink-muted text-lg">
            {authLoading || sessionRefreshing ? 'Loading your dashboard…' : 'Please log in to continue.'}
          </p>
        </main>
      </>
    )
  }

  return (
    <>
      <SiteNav />
      <main className="min-h-screen bg-canvas">
        <div className="swifto-content py-10 md:py-12 pb-20">
          <div className="flex items-center gap-4 mb-8">
            <ProfileAvatar avatarUrl={profile?.avatar_url} sizeClassName="w-14 h-14 shrink-0" iconClassName="w-7 h-7 text-primary" />
            <div>
              <p className="text-sm text-ink-muted">Welcome back,</p>
              <h1 className="text-2xl md:text-3xl font-bold text-ink">{displayName || 'User'}</h1>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1.1fr_2fr] gap-5 mb-10">
            <div className="rounded-2xl bg-hero-band text-white p-6 md:p-7 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-white/90">Available balance</span>
                </div>
                <p className="font-display text-[46px] font-extrabold mt-4 leading-none" aria-busy={balanceLoading}>
                  {balanceLabel}
                </p>
                {depositSuccessBanner && (
                  <p className="text-sm text-white/90 mt-2">Deposit received. Your balance has been updated.</p>
                )}
                <button
                  onClick={() => setShowDeposit(true)}
                  className="mt-5 h-11 px-6 rounded-[14px] bg-white text-brand-deep font-semibold hover:bg-canvas transition-colors w-full sm:w-auto"
                >
                  Deposit funds
                </button>
              </div>
              <span className="absolute w-48 h-48 rounded-full bg-primary/35 blur-3xl -right-10 -bottom-16 pointer-events-none" aria-hidden />
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
                {[
                { label: 'Active jobs', value: String(activeJobCount), sub: pendingApplicationCount > 0 ? `${pendingApplicationCount} pending apps` : 'listings' },
                { label: 'Completed', value: String(completedJobCount), sub: 'all-time' },
                  { label: 'Balance', value: hasKnownBalance ? balanceLabel.replace('$', '') : (balanceLoading ? '…' : '0.00'), sub: 'NZD available' },
              ].map((s) => (
                <div key={s.label} className="swifto-card p-5 flex flex-col justify-between min-h-[120px]">
                  <div className="w-10 h-10 rounded-xl bg-brand-soft flex items-center justify-center">
                    <svg className="w-5 h-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div className="mt-4">
                    <p className="text-2xl font-extrabold text-ink">{s.value}</p>
                    <p className="text-sm font-semibold text-ink mt-0.5">{s.label}</p>
                    <p className="text-xs text-ink-muted">{s.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-[2fr_1.1fr] gap-4 md:gap-[18px]">
            <div className="swifto-card p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl">Active jobs</h2>
                <Link href="/dashboard/lister/jobs-listed" className="swifto-btn-ghost h-10 px-4 text-sm">
                  View all
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
              {activeListings.length === 0 ? (
                <p className="text-ink-2 text-sm py-6 text-center">
                  No active jobs yet.{' '}
                  <Link href="/dashboard/lister/post-job" className="text-brand font-semibold hover:text-primary">Post a job</Link>
                </p>
              ) : (
                <div className="flex flex-col gap-3">
                  {activeListings.map((job) => (
                    <Link
                      key={job.id}
                      href="/dashboard/lister/jobs-listed"
                      className="flex items-center gap-3.5 p-3 rounded-2xl border border-line-card hover:border-brand/30 hover:bg-brand-soft/30 transition-colors"
                    >
                      <span className="w-[52px] h-[52px] rounded-xl bg-brand-soft shrink-0 flex items-center justify-center text-brand">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[15.5px] truncate">{job.job_name}</p>
                        <p className="text-[13px] text-ink-3 mt-0.5">{job.area} · {job.whenLabel}</p>
                      </div>
                      <DesignBadge tone={job.pendingCount > 0 ? 'warning' : 'brand'}>
                        {job.pendingCount > 0 ? `${job.pendingCount} pending` : 'Active'}
                      </DesignBadge>
                      <span className="font-display font-extrabold text-primary text-lg shrink-0">${job.price}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4 md:gap-[18px]">
              <div className="swifto-card p-5 bg-primary-soft border-primary/20">
                <div className="flex items-center gap-3">
                  <IconDisc tone="accent" size={48} className="!bg-white">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </IconDisc>
                  <div>
                    <p className="font-extrabold text-base text-accent-deep">Need another listing?</p>
                    <p className="text-[13px] text-ink-2 mt-0.5">Post a fresh job in a few taps.</p>
                  </div>
                </div>
                <Link href="/dashboard/lister/post-job" className="swifto-btn-primary w-full mt-4 h-10 text-sm">
                  Post a job
                </Link>
              </div>

              <Link
                href="/profile/lister"
                className="swifto-card swifto-card-hover p-4 flex items-center gap-3"
              >
                <IconDisc tone="brand" size={42}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </IconDisc>
                <span className="font-semibold text-[15px]">Edit profile</span>
                <svg className="w-[18px] h-[18px] text-ink-3 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>

              <button
                type="button"
                onClick={() => setShowDeposit(true)}
                className="w-full swifto-card swifto-card-hover p-4 flex items-center gap-3 text-left"
              >
                <IconDisc tone="brand" size={42}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </IconDisc>
                <span className="font-semibold text-[15px]">Deposit funds</span>
                <svg className="w-[18px] h-[18px] text-ink-3 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>

              <Link
                href="/dashboard/lister/jobs-completed"
                className="swifto-card swifto-card-hover p-4 flex items-center gap-3"
              >
                <IconDisc tone="brand" size={42}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </IconDisc>
                <span className="font-semibold text-[15px]">Completed jobs</span>
                <svg className="w-[18px] h-[18px] text-ink-3 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>

              <Link
                href="/browse"
                className="swifto-card swifto-card-hover p-4 flex items-center gap-3"
              >
                <IconDisc tone="brand" size={42}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </IconDisc>
                <span className="font-semibold text-[15px]">Browse jobs</span>
                <svg className="w-[18px] h-[18px] text-ink-3 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </main>
      {showDeposit && (
        <DepositModal
          onClose={() => setShowDeposit(false)}
          onSuccess={() => {
            setProfile((p) => p ? { ...p } : null)
          }}
        />
      )}
    </>
  )
}
