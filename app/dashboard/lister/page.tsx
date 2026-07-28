'use client'

import Link from 'next/link'
import { useState, useEffect, useMemo, useRef } from 'react'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase/client'
import { SiteNav } from '@/components/site-nav'
import { DepositModal } from '@/components/deposit-modal'
import { ProfileAvatar } from '@/components/profile-avatar'
import { captureEvent } from '@/lib/posthog'
import { buildFullyCompletedJobIds, type JobCompletionVerify } from '@/lib/active-jobs'

export default function ListerDashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const [profile, setProfile] = useState<{ first_name: string; last_name: string; balance_cents?: number; avatar_url?: string | null } | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [sessionRefreshing, setSessionRefreshing] = useState(false)
  const [depositSuccessBanner, setDepositSuccessBanner] = useState(false)
  const [showDeposit, setShowDeposit] = useState(false)
  const [activeJobCount, setActiveJobCount] = useState(0)
  const [pendingApplicationCount, setPendingApplicationCount] = useState(0)
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
    if (!user) {
      if (!authLoading && !sessionRefreshing) {
        setProfile(null)
        setProfileLoading(false)
      }
      return
    }

    let cancelled = false
    const userId = user.id

    async function fetchProfile() {
      setProfileLoading(true)
      const supabase = createClient()
      const { data } = await supabase
        .from('profiles')
        .select('first_name, last_name, balance_cents, avatar_url')
        .eq('id', userId)
        .single()

      if (cancelled) return

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
      setProfileLoading(false)
    }

    void fetchProfile()

    if (depositSuccessBanner) {
      const retry1 = setTimeout(() => { if (!cancelled) void fetchProfile() }, 1500)
      const retry2 = setTimeout(() => { if (!cancelled) void fetchProfile() }, 3500)
      return () => {
        cancelled = true
        clearTimeout(retry1)
        clearTimeout(retry2)
      }
    }

    return () => {
      cancelled = true
    }
  }, [user?.id, authLoading, sessionRefreshing, depositSuccessBanner])

  useEffect(() => {
    async function fetchActiveCounts() {
      if (!user) {
        setActiveJobCount(0)
        setPendingApplicationCount(0)
        return
      }
      const supabase = createClient()
      const { data: jobsData } = await supabase
        .from('jobs')
        .select('id, status')
        .eq('lister_id', user.id)
        .in('status', ['active', 'in_progress'])

      if (!jobsData?.length) {
        setActiveJobCount(0)
        setPendingApplicationCount(0)
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

      if (activeJobIds.length === 0) {
        setPendingApplicationCount(0)
        return
      }

      const { count } = await supabase
        .from('job_applications')
        .select('*', { count: 'exact', head: true })
        .in('job_id', activeJobIds)
        .eq('status', 'pending')
      setPendingApplicationCount(count ?? 0)
    }
    fetchActiveCounts()
  }, [user?.id])

  const balanceLoading = sessionRefreshing || profileLoading
  const showDashboardContent = !sessionRefreshing && !!user
  const balanceLabel = balanceLoading
    ? 'Loading…'
    : `$${((profile?.balance_cents ?? 0) / 100).toFixed(2)}`

  if (!showDashboardContent) {
    return (
      <>
        <SiteNav />
        <main className="min-h-screen bg-canvas flex items-center justify-center">
          <p className="text-ink-muted text-lg">Loading your dashboard…</p>
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
                {depositSuccessBanner && !balanceLoading && (
                  <p className="text-sm text-white/90 mt-2">Deposit received. Your balance has been updated.</p>
                )}
                <button
                  onClick={() => setShowDeposit(true)}
                  disabled={balanceLoading}
                  className="mt-5 h-11 px-6 rounded-[14px] bg-white text-brand-deep font-semibold hover:bg-canvas transition-colors disabled:opacity-60 w-full sm:w-auto"
                >
                  Deposit funds
                </button>
              </div>
              <span className="absolute w-48 h-48 rounded-full bg-primary/35 blur-3xl -right-10 -bottom-16 pointer-events-none" aria-hidden />
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { label: 'Active jobs', value: String(activeJobCount), sub: pendingApplicationCount > 0 ? `${pendingApplicationCount} pending apps` : 'listings' },
                { label: 'Completed', value: '—', sub: 'view history' },
                { label: 'Balance', value: balanceLoading ? '…' : balanceLabel.replace('$', ''), sub: 'NZD available' },
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Profile Card */}
              <Link 
                href="/profile/lister"
                className="swifto-card swifto-card-hover p-6 aspect-square flex flex-col items-center justify-center gap-4 cursor-pointer"
              >
                <div className="w-16 h-16 rounded-2xl bg-brand-soft flex items-center justify-center">
                  <svg className="w-8 h-8 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-ink">Profile</h3>
                  <p className="text-xs text-ink/70">View and edit your profile</p>
                </div>
              </Link>

              {/* Deposit Card */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setShowDeposit(true)
                }}
                className="w-full swifto-card swifto-card-hover p-6 aspect-square flex flex-col items-center justify-center gap-4 cursor-pointer text-left"
              >
                <div className="w-16 h-16 rounded-2xl bg-brand-soft flex items-center justify-center">
                  <svg className="w-8 h-8 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-ink">Deposit</h3>
                  <p className="text-xs text-ink/70">Add funds to your account</p>
                </div>
              </button>

              {/* Post a Job Card */}
              <Link 
                href="/dashboard/lister/post-job"
                className="swifto-card swifto-card-hover p-6 aspect-square flex flex-col items-center justify-center gap-4 cursor-pointer"
              >
                <div className="w-16 h-16 rounded-2xl bg-brand-soft flex items-center justify-center">
                  <svg className="w-8 h-8 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-ink">Post a Job</h3>
                  <p className="text-xs text-ink/70">Create a new job listing</p>
                </div>
              </Link>

              {/* Browse Jobs Card */}
              <Link 
                href="/browse"
                className="swifto-card swifto-card-hover p-6 aspect-square flex flex-col items-center justify-center gap-4 cursor-pointer"
              >
                <div className="w-16 h-16 rounded-2xl bg-brand-soft flex items-center justify-center">
                  <svg className="w-8 h-8 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-ink">Browse Jobs</h3>
                  <p className="text-xs text-ink/70">Search and find available jobs</p>
                </div>
              </Link>

              {/* Jobs Completed Card */}
              <Link 
                href="/dashboard/lister/jobs-completed"
                className="swifto-card swifto-card-hover p-6 aspect-square flex flex-col items-center justify-center gap-4 cursor-pointer"
              >
                <div className="w-16 h-16 rounded-2xl bg-brand-soft flex items-center justify-center">
                  <svg className="w-8 h-8 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-ink">Jobs Completed</h3>
                  <p className="text-xs text-ink/70">View your completed jobs</p>
                </div>
              </Link>

              {/* Active Jobs Card */}
              <Link 
                href="/dashboard/lister/jobs-listed"
                className="swifto-card swifto-card-hover p-6 aspect-square flex flex-col items-center justify-center gap-4 cursor-pointer"
              >
                <div className="w-16 h-16 rounded-2xl bg-brand-soft flex items-center justify-center">
                  <svg className="w-8 h-8 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-ink">Active Jobs</h3>
                  <p className="text-sm font-medium text-primary mt-1">
                    {activeJobCount} active
                  </p>
                  {pendingApplicationCount > 0 && (
                    <p className="text-xs text-ink/70 mt-1">
                      {pendingApplicationCount} pending
                    </p>
                  )}
                </div>
              </Link>
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
