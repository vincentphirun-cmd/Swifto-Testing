'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { SiteNav } from '@/components/site-nav'
import { PageHero } from '@/components/page-hero'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth-context'

type Metrics = {
  users: { students: number; listers: number; admins: number; total: number }
  jobs: { active: number; in_progress: number; completed: number }
  applications_pending: number
  identity_pending: number
  money: { deposits_cents: number; withdrawals_cents: number; refunds_cents: number }
}

function nzd(cents: number) {
  return `$${(cents / 100).toFixed(2)}`
}

export default function AdminHubPage() {
  const { user } = useAuth()
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      if (!user) return
      setLoading(true)
      setError(null)
      try {
        const supabase = createClient()
        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (!session?.access_token) {
          setError('Please log in again')
          setLoading(false)
          return
        }
        const res = await fetch('/api/admin/metrics', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        })
        const data = await res.json()
        if (!res.ok) {
          setError(data.error || 'Failed to load metrics')
          setLoading(false)
          return
        }
        setMetrics(data)
      } catch {
        setError('Failed to load metrics')
      }
      setLoading(false)
    }
    load()
  }, [user])

  const tools = [
    {
      href: '/admin/identity',
      title: 'Identity verification',
      body: 'Review lister ID submissions and approve or reject accounts.',
      badge: metrics ? `${metrics.identity_pending} pending` : null,
    },
    {
      href: '/admin/finance',
      title: 'Finance export',
      body: 'Download ledger data as Excel or CSV for a date range.',
      badge: null,
    },
    {
      href: '/admin/messages',
      title: 'Message archive',
      body: 'Read-only access to job conversations across the platform.',
      badge: null,
    },
  ]

  return (
    <>
      <SiteNav />
      <main className="min-h-screen bg-canvas">
        <PageHero
          title="Admin"
          subtitle="Platform metrics, verification, and operations"
          centered
        />
        <section className="py-10 md:py-14">
          <div className="mx-auto max-w-5xl px-4 space-y-8">
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                {error}
              </p>
            )}

            <div>
              <h2 className="text-lg font-bold text-ink mb-4">KPIs</h2>
              {loading || !metrics ? (
                <p className="text-ink/60">Loading metrics…</p>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Users', value: String(metrics.users.total), sub: `${metrics.users.students} students · ${metrics.users.listers} listers` },
                    { label: 'Active jobs', value: String(metrics.jobs.active), sub: `${metrics.jobs.in_progress} in progress` },
                    { label: 'Completed jobs', value: String(metrics.jobs.completed), sub: `${metrics.applications_pending} pending apps` },
                    { label: 'ID reviews', value: String(metrics.identity_pending), sub: 'awaiting approval' },
                    { label: 'Deposits', value: nzd(metrics.money.deposits_cents), sub: 'succeeded (all time)' },
                    { label: 'Withdrawals', value: nzd(metrics.money.withdrawals_cents), sub: 'to students' },
                    { label: 'Refunds', value: nzd(metrics.money.refunds_cents), sub: 'to lister cards' },
                    { label: 'Admins', value: String(metrics.users.admins), sub: 'role = admin' },
                  ].map((card) => (
                    <div key={card.label} className="swifto-card p-5">
                      <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">
                        {card.label}
                      </p>
                      <p className="text-2xl font-extrabold text-ink mt-2">{card.value}</p>
                      <p className="text-xs text-ink/60 mt-1">{card.sub}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h2 className="text-lg font-bold text-ink mb-4">Tools</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {tools.map((t) => (
                  <Link
                    key={t.href}
                    href={t.href}
                    className="swifto-card p-5 hover:border-brand/40 transition-colors block"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-ink">{t.title}</h3>
                      {t.badge && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 whitespace-nowrap">
                          {t.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-ink/70 mt-2">{t.body}</p>
                    <span className="inline-block mt-4 text-sm font-semibold text-primary">
                      Open →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
