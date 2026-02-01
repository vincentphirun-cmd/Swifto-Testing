'use client'

import Link from 'next/link'
import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase/client'
import { SiteNav } from '@/components/site-nav'
import { DepositModal } from '@/components/deposit-modal'
import { captureEvent } from '@/lib/posthog'

export default function ListerDashboardPage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<{ first_name: string; last_name: string; balance_cents?: number } | null>(null)
  const [showDeposit, setShowDeposit] = useState(false)

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

  useEffect(() => {
    if (!user) {
      setProfile(null)
      return
    }
    let cancelled = false
    const userId = user.id

    async function fetchProfile() {
      const supabase = createClient()
      const { data } = await supabase
        .from('profiles')
        .select('first_name, last_name, balance_cents')
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
          }
        })
      }
    }

    const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
    const hadDepositSuccess = params?.get('deposit') === 'success'
    if (hadDepositSuccess) {
      captureEvent('deposit_completed')
      window.history.replaceState({}, '', '/dashboard/lister')
    }

    fetchProfile()

    if (hadDepositSuccess) {
      const retry1 = setTimeout(() => { if (!cancelled) fetchProfile() }, 1500)
      const retry2 = setTimeout(() => { if (!cancelled) fetchProfile() }, 3500)
      return () => {
        cancelled = true
        clearTimeout(retry1)
        clearTimeout(retry2)
      }
    }

    return () => {
      cancelled = true
    }
  }, [user?.id])

  return (
    <>
      <SiteNav />
      <main className="min-h-screen bg-primary">
        <section className="py-16 md:py-24">
          <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
            {/* Balance - Button Style */}
            <div className="mb-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <div className="bg-white rounded-xl border-2 border-white/20 shadow-lg px-6 sm:px-8 py-4 flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-xs text-ink/60 uppercase tracking-wide font-medium">Available Balance</p>
                  <h2 className="text-xl md:text-2xl font-bold text-ink">
                    ${((profile?.balance_cents ?? 0) / 100).toFixed(2)}
                  </h2>
                </div>
              </div>
              
              {/* Deposit CTA Button */}
              <button
                onClick={() => setShowDeposit(true)}
                className="bg-white text-primary rounded-xl px-6 py-3 font-semibold hover:bg-canvas transition-all duration-300 shadow-lg hover:shadow-xl border-2 border-white/20 hover:border-white/40 whitespace-nowrap min-h-[48px]"
              >
                Deposit Funds
              </button>
            </div>

            {showDeposit && (
              <DepositModal
                onClose={() => setShowDeposit(false)}
                onSuccess={() => {
                  setProfile((p) => p ? { ...p } : null)
                }}
              />
            )}

            {/* Welcome Message - Right Side */}
            <div className="mb-6 flex justify-center md:justify-end md:pr-8 -mt-8 md:-mt-12">
              <h2 className="text-white font-semibold text-2xl md:text-3xl">
                Welcome back, {displayName || 'User'}!
              </h2>
            </div>

            {/* Dashboard Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Profile Card */}
              <Link 
                href="/profile/lister"
                className="bg-white rounded-2xl border border-ink/15 shadow-sm p-6 aspect-square flex flex-col items-center justify-center gap-4 hover:shadow-xl hover:scale-105 transition-all duration-300 hover:border-primary/50 cursor-pointer"
              >
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-ink">Profile</h3>
                  <p className="text-xs text-ink/70">View and edit your profile</p>
                </div>
              </Link>

              {/* Deposit Card */}
              <div className="bg-white rounded-2xl border border-ink/15 shadow-sm p-6 aspect-square flex flex-col items-center justify-center gap-4 hover:shadow-xl hover:scale-105 transition-all duration-300 hover:border-primary/50 cursor-pointer">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-ink">Deposit</h3>
                  <p className="text-xs text-ink/70">Add funds to your account</p>
                </div>
              </div>

              {/* Post a Job Card */}
              <Link 
                href="/dashboard/lister/post-job"
                className="bg-white rounded-2xl border border-ink/15 shadow-sm p-6 aspect-square flex flex-col items-center justify-center gap-4 hover:shadow-xl hover:scale-105 transition-all duration-300 hover:border-primary/50 cursor-pointer"
              >
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                className="bg-white rounded-2xl border border-ink/15 shadow-sm p-6 aspect-square flex flex-col items-center justify-center gap-4 hover:shadow-xl hover:scale-105 transition-all duration-300 hover:border-primary/50 cursor-pointer"
              >
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                className="bg-white rounded-2xl border border-ink/15 shadow-sm p-6 aspect-square flex flex-col items-center justify-center gap-4 hover:shadow-xl hover:scale-105 transition-all duration-300 hover:border-primary/50 cursor-pointer"
              >
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                className="bg-white rounded-2xl border border-ink/15 shadow-sm p-6 aspect-square flex flex-col items-center justify-center gap-4 hover:shadow-xl hover:scale-105 transition-all duration-300 hover:border-primary/50 cursor-pointer"
              >
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-ink">Active Jobs</h3>
                  <p className="text-sm font-medium text-primary mt-1">4 active</p>
                  <p className="text-xs text-ink/70 mt-1">2 pending</p>
                </div>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
