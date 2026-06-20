'use client'

import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth-context'
import { SiteNav } from '@/components/site-nav'
import { PageHero } from '@/components/page-hero'
import { LoadingSpinner } from '@/components/loading-spinner'
import { ErrorAlert } from '@/components/error-alert'

type CompletionRow = {
  id: string
  job_id: string
  student_id: string
  lister_id: string
  completed_at: string
  rating_from_lister: number | null
  job: {
    job_name: string
    category: string
    size_or_time: string
    address: string
    price: number
  } | null
  studentProfile: { first_name: string; last_name: string } | null
}

export default function ListerJobsCompletedPage() {
  const { user } = useAuth()
  const [completions, setCompletions] = useState<CompletionRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCompletions = useCallback(async () => {
      if (!user) {
        setLoading(false)
        return
      }
      setLoading(true)
      setError(null)
      try {
      const supabase = createClient()
      const { data: compData } = await supabase
        .from('job_completions')
        .select('id, job_id, student_id, lister_id, completed_at, rating_from_lister')
        .eq('lister_id', user.id)
        .order('completed_at', { ascending: false })

      if (!compData || compData.length === 0) {
        setCompletions([])
        setError(null)
        setLoading(false)
        return
      }

      const jobIds = compData.map((c) => c.job_id)
      const studentIds = compData.map((c) => c.student_id)
      const { data: jobsData } = await supabase.from('jobs').select('id, job_name, category, size_or_time, address, price').in('id', jobIds)
      const { data: profData } = await supabase.from('profiles').select('id, first_name, last_name').in('id', studentIds)

      const jobsMap: Record<string, NonNullable<typeof jobsData>[number]> = {}
      for (const j of jobsData ?? []) jobsMap[j.id] = j
      const profMap: Record<string, { first_name: string; last_name: string }> = {}
      for (const p of profData ?? []) profMap[p.id] = p

      const combined: CompletionRow[] = compData.map((c) => ({
        ...c,
        job: jobsMap[c.job_id] ?? null,
        studentProfile: profMap[c.student_id] ?? null,
      }))
      setCompletions(combined)
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load completed jobs')
      setCompletions([])
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) fetchCompletions()
  }, [user, fetchCompletions])

  if (!user) {
    return (
      <>
        <SiteNav />
        <main className="min-h-screen bg-canvas flex items-center justify-center">
          <p className="text-ink-muted">Please log in to view your completed jobs.</p>
        </main>
      </>
    )
  }

  return (
    <>
      <SiteNav />
      <main className="min-h-screen bg-canvas">
        <PageHero
          backHref="/dashboard/lister"
          backLabel="Back to Dashboard"
          title="Jobs completed"
          subtitle="View all your completed job listings and the students who completed them"
        />
        <section className="py-8 md:py-12">
          <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <LoadingSpinner size="lg" variant="default" />
                <p className="text-lg text-ink-muted">Loading completed jobs…</p>
              </div>
            ) : error ? (
              <ErrorAlert message={error} onRetry={fetchCompletions}  className="max-w-xl mx-auto" />
            ) : completions.length === 0 ? (
              <div className="text-center py-16 text-ink-muted">
                <p className="text-lg">No completed jobs yet.</p>
                <p className="text-sm mt-2">Jobs will appear here once both you and the student verify completion.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {completions.map((c) => (
                  <div key={c.id} className="bg-white rounded-2xl border border-ink/15 shadow-sm p-6 hover:shadow-xl transition-all duration-300">
                    {c.job && (
                      <>
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-2xl font-semibold text-ink">{c.job.job_name}</h3>
                              <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                                {c.job.category}
                              </span>
                            </div>
                            <p className="text-sm text-ink/70 mb-3">{c.job.size_or_time}</p>
                            <div className="flex items-center gap-4 mt-3">
                              <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                  </svg>
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-ink">Completed by</p>
                                  <p className="text-sm text-ink/70">
                                    {c.studentProfile ? `${c.studentProfile.first_name} ${c.studentProfile.last_name}`.trim() : '—'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-primary mb-1">${Number(c.job.price).toFixed(2)}</p>
                            <p className="text-xs text-ink/60">Total job cost</p>
                          </div>
                        </div>
                        <div className="border-t border-ink/10 pt-4 space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs font-semibold text-ink/60 uppercase tracking-wide mb-1">Size/Time</p>
                              <p className="text-sm text-ink">{c.job.size_or_time}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-ink/60 uppercase tracking-wide mb-1">Location</p>
                              <p className="text-sm text-ink">{c.job.address}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-ink/60 uppercase tracking-wide mb-1">Completed On</p>
                              <p className="text-sm text-ink">
                                {new Date(c.completed_at).toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-ink/60 uppercase tracking-wide mb-1">Rating Given</p>
                              <div className="flex items-center gap-1">
                                <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span className="text-sm font-semibold text-ink">{c.rating_from_lister ?? '—'}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  )
}
