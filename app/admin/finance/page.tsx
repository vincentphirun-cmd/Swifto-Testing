'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { SiteNav } from '@/components/site-nav'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth-context'

export default function AdminFinancePage() {
  const { user } = useAuth()
  const [sessionToken, setSessionToken] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState<'excel' | 'csv' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const today = new Date().toISOString().split('T')[0]
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  const [startDate, setStartDate] = useState(thirtyDaysAgo)
  const [endDate, setEndDate] = useState(today)

  useEffect(() => {
    async function init() {
      if (!user) {
        setIsAdmin(false)
        setLoading(false)
        return
      }
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        setIsAdmin(false)
        setLoading(false)
        return
      }
      setSessionToken(session.access_token)
      try {
        const res = await fetch('/api/admin/check', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        })
        const data = await res.json()
        setIsAdmin(data.admin === true)
      } catch {
        setIsAdmin(false)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [user])

  const handleDownload = async (format: 'excel' | 'csv') => {
    if (!sessionToken) return
    setDownloading(format)
    setError(null)
    try {
      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
      })
      if (format === 'csv') params.set('format', 'csv')
      const res = await fetch(`/api/admin/exports/ledger?${params}`, {
        headers: { Authorization: `Bearer ${sessionToken}` },
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || `Download failed (${res.status})`)
      }
      const blob = await res.blob()
      const disposition = res.headers.get('Content-Disposition')
      const match = disposition?.match(/filename="(.+)"/)
      const filename = match?.[1] || `swifto_ledger_${startDate}_to_${endDate}.${format === 'csv' ? 'csv' : 'xlsx'}`
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Download failed')
    } finally {
      setDownloading(null)
    }
  }

  if (loading) {
    return (
      <>
        <SiteNav />
        <main className="min-h-screen bg-primary flex items-center justify-center">
          <p className="text-white">Loading…</p>
        </main>
      </>
    )
  }

  if (!user || !isAdmin) {
    return (
      <>
        <SiteNav />
        <main className="min-h-screen bg-primary flex flex-col items-center justify-center px-4">
          <p className="text-white text-lg mb-4">Access denied. Admin only.</p>
          <Link href="/" className="text-white/80 hover:text-white underline">Back to home</Link>
        </main>
      </>
    )
  }

  return (
    <>
      <SiteNav />
      <main className="min-h-screen bg-primary">
        <section className="py-16 md:py-24">
          <div className="mx-auto w-full max-w-2xl px-4 md:px-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Finance Export</h1>
            <p className="text-white/80 mb-8">Download financial ledger data as Excel or CSV.</p>
            <p className="mb-8">
              <Link href="/admin/messages" className="text-white/90 hover:text-white underline text-sm">
                View job message archive →
              </Link>
            </p>

            <div className="bg-white rounded-2xl border border-ink/15 shadow-lg p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-ink mb-2">Start date</label>
                  <input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-ink/20 text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-ink mb-2">End date</label>
                  <input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-ink/20 text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm">
                  {error}
                </div>
              )}

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => handleDownload('excel')}
                  disabled={!!downloading}
                  className="px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-secondary transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {downloading === 'excel' ? 'Downloading…' : 'Download Excel (.xlsx)'}
                </button>
                <button
                  onClick={() => handleDownload('csv')}
                  disabled={!!downloading}
                  className="px-6 py-3 bg-ink/10 text-ink font-semibold rounded-xl hover:bg-ink/20 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {downloading === 'csv' ? 'Downloading…' : 'Download CSV'}
                </button>
              </div>

              <p className="text-sm text-ink/60">
                The Excel workbook includes 5 sheets: Transactions, Receipts_Lister, Payouts_Students, Daily_Summary, and Student_Earnings_IRD (for IRD reporting).
              </p>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mt-6 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to home
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}
