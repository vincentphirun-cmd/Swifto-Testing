'use client'

import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth-context'
import { SiteNav } from '@/components/site-nav'
import { PageHero } from '@/components/page-hero'
import { LoadingSpinner } from '@/components/loading-spinner'
import { ErrorAlert } from '@/components/error-alert'
import { FeeBreakdown } from '@/components/fee-breakdown'
import { CancelJobModal } from '@/components/cancel-job-modal'
import { buildFullyCompletedJobIds, type JobCompletionVerify } from '@/lib/active-jobs'
import { fetchStudentGstRegistered } from '@/lib/profile-completions'
import { fetchOpenChatJobIds } from '@/lib/job-chat'

type ApplicationWithJob = {
  id: string
  job_id: string
  student_id: string
  status: 'pending' | 'accepted' | 'not_selected' | 'cancelled'
  applied_at: string
  jobs: {
    job_name: string
    category: string
    size_or_time: string
    address: string
    area: string
    price: number
    completion_date: string | null
    is_flexible: boolean
    start_time: string | null
    urgent_rebook_until: string | null
    status: string
  } | null
  listerProfile: { first_name: string; last_name: string } | null
}

export default function JobsAppliedPage() {
  const { user } = useAuth()
  const [applications, setApplications] = useState<ApplicationWithJob[]>([])
  const [fullyCompletedJobIds, setFullyCompletedJobIds] = useState<Set<string>>(new Set())
  const [awaitingStudentVerify, setAwaitingStudentVerify] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [gstRegistered, setGstRegistered] = useState(false)
  const [openChatJobIds, setOpenChatJobIds] = useState<Set<string>>(new Set())
  const [error, setError] = useState<string | null>(null)
  const [cancelModalApp, setCancelModalApp] = useState<ApplicationWithJob | null>(null)

  const fetchApplications = useCallback(async () => {
      if (!user) {
        setLoading(false)
        return
      }
      setLoading(true)
      setError(null)
      try {
      const supabase = createClient()
      const gstReg = await fetchStudentGstRegistered(user.id)
      setGstRegistered(gstReg)
      const chatIds = await fetchOpenChatJobIds(user.id)
      setOpenChatJobIds(chatIds)
      const { data: appsData } = await supabase
        .from('job_applications')
        .select('id, job_id, student_id, status, applied_at')
        .eq('student_id', user.id)
        .order('applied_at', { ascending: false })

      if (!appsData || appsData.length === 0) {
        setApplications([])
        setFullyCompletedJobIds(new Set())
        setAwaitingStudentVerify(new Set())
        setError(null)
        setLoading(false)
        return
      }

      const jobIds = Array.from(new Set(appsData.map((a) => a.job_id)))
      const { data: jobsData } = await supabase
        .from('jobs')
        .select('id, job_name, category, size_or_time, address, area, price, completion_date, is_flexible, start_time, urgent_rebook_until, lister_id, status')
        .in('id', jobIds)

      const jobsMap: Record<string, NonNullable<typeof jobsData>[number]> = {}
      for (const j of jobsData ?? []) jobsMap[j.id] = j

      const jobStatusMap: Record<string, string> = {}
      for (const j of jobsData ?? []) jobStatusMap[j.id] = j.status

      const { data: allCompData } = await supabase
        .from('job_completions')
        .select('job_id, lister_verified_at, student_verified_at')
        .eq('student_id', user.id)
        .in('job_id', jobIds)

      const completions = (allCompData ?? []) as JobCompletionVerify[]
      setFullyCompletedJobIds(buildFullyCompletedJobIds(completions, jobStatusMap))

      const listerIds = Array.from(new Set((jobsData ?? []).map((j) => j.lister_id)))
      let listersMap: Record<string, { first_name: string; last_name: string }> = {}
      if (listerIds.length > 0) {
        const { data: profData } = await supabase
          .from('profiles')
          .select('id, first_name, last_name')
          .in('id', listerIds)
        for (const p of profData ?? []) listersMap[p.id] = p
      }

      const acceptedJobIds = appsData.filter((a) => a.status === 'accepted').map((a) => a.job_id)
      let verifyJobIds = new Set<string>()
      if (acceptedJobIds.length > 0) {
        for (const c of completions) {
          if (acceptedJobIds.includes(c.job_id) && c.lister_verified_at && !c.student_verified_at) {
            verifyJobIds.add(c.job_id)
          }
        }
      }
      setAwaitingStudentVerify(verifyJobIds)

      const combined: ApplicationWithJob[] = appsData.map((app) => {
        const job = jobsMap[app.job_id]
        const listerId = job?.lister_id
        return {
          id: app.id,
          job_id: app.job_id,
          student_id: app.student_id,
          status: app.status,
          applied_at: app.applied_at,
          jobs: job
            ? {
                job_name: job.job_name,
                category: job.category,
                size_or_time: job.size_or_time,
                address: job.address,
                area: job.area,
                price: job.price,
                completion_date: job.completion_date,
                is_flexible: job.is_flexible,
                start_time: job.start_time ?? null,
                urgent_rebook_until: job.urgent_rebook_until ?? null,
                status: job.status,
              }
            : null,
          listerProfile: listerId ? listersMap[listerId] ?? null : null,
        }
      })
      setApplications(combined)
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load applications')
      setApplications([])
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) fetchApplications()
  }, [user, fetchApplications])

  const formatDate = (d: string | null, flexible: boolean) =>
    flexible ? 'Flexible' : d ? new Date(d).toLocaleDateString('en-NZ', { day: 'numeric', month: 'long', year: 'numeric' }) : 'TBD'
  const isCompleted = (jobId: string) => fullyCompletedJobIds.has(jobId)
  const activeApps = applications.filter(
    (a) => (a.status === 'pending' || a.status === 'accepted') && !isCompleted(a.job_id)
  )
  const pastApps = applications.filter(
    (a) =>
      a.status === 'not_selected' ||
      a.status === 'cancelled' ||
      (a.status === 'accepted' && isCompleted(a.job_id))
  )
  const listerName = (p: ApplicationWithJob['listerProfile']) =>
    p ? `${p.first_name} ${p.last_name}`.trim() : '—'

  const handleCancelConfirm = async (reason: string) => {
    if (!cancelModalApp || !user) return
    const { data: { session } } = await createClient().auth.getSession()
    const token = session?.access_token
    if (!token) throw new Error('Not logged in')
    const res = await fetch('/api/jobs/cancel-application', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ application_id: cancelModalApp.id, reason }),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.error || 'Failed to cancel')
    }
    setCancelModalApp(null)
    fetchApplications()
  }

  if (!user) {
    return (
      <>
        <SiteNav />
        <main className="min-h-screen bg-canvas flex items-center justify-center">
          <p className="text-ink-muted">Please log in to view your applications.</p>
        </main>
      </>
    )
  }

  return (
    <>
      <SiteNav />
      <main className="min-h-screen bg-canvas">
        <PageHero
          backHref="/dashboard/student"
          backLabel="Back to Dashboard"
          title="Active jobs"
          subtitle="View your active job applications and their status"
        />
        <section className="py-8 md:py-12">
          <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <LoadingSpinner size="lg" variant="default" />
                <p className="text-lg text-ink-muted">Loading applications…</p>
              </div>
            ) : error ? (
              <ErrorAlert message={error} onRetry={fetchApplications}  className="max-w-xl" />
            ) : (
              <>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-ink mb-4">Active Applications</h2>
                  {activeApps.length === 0 ? (
                    <p className="text-ink-muted">No active applications. <Link href="/browse" className="text-primary hover:underline">Browse jobs</Link> to apply.</p>
                  ) : (
                    <div className="space-y-4">
                      {activeApps.map((app) => (
                        <div
                          key={app.id}
                          className="bg-white rounded-2xl border border-ink/15 shadow-sm p-6 hover:shadow-xl transition-all duration-300"
                        >
                          {app.jobs && (
                            <>
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                                    <h3 className="text-2xl font-semibold text-ink">{app.jobs.job_name}</h3>
                                    <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                                      {app.jobs.category}
                                    </span>
                                    {app.status === 'pending' && app.jobs.urgent_rebook_until && new Date(app.jobs.urgent_rebook_until) > new Date() && (
                                      <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full">
                                        Spot reopened — tap to accept
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-ink/70 mb-2">{app.jobs.size_or_time}</p>
                                  <div className="flex items-center gap-2 text-sm text-ink/60">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    </svg>
                                    <span>{app.jobs.address}</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="mb-2">
                                    <span
                                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                        app.status === 'accepted'
                                          ? 'bg-green-100 text-green-800'
                                          : 'bg-yellow-100 text-yellow-800'
                                      }`}
                                    >
                                      {app.status === 'accepted' ? 'Accepted' : 'Pending'}
                                    </span>
                                  </div>
                                  <p className="text-xl font-bold text-primary">${Number(app.jobs.price).toFixed(2)}</p>
                                  <p className="text-xs text-ink/60">Job price</p>
                                </div>
                              </div>
                              <div className="border-t border-ink/10 pt-4 space-y-3">
                                <FeeBreakdown price={app.jobs.price} gstRegistered={gstRegistered} showPayoutNote className="mb-4" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-xs font-semibold text-ink/60 uppercase tracking-wide mb-1">Size/Time</p>
                                    <p className="text-sm text-ink">{app.jobs.size_or_time}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs font-semibold text-ink/60 uppercase tracking-wide mb-1">Completion Date</p>
                                    <p className="text-sm text-ink">{formatDate(app.jobs.completion_date, app.jobs.is_flexible)}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs font-semibold text-ink/60 uppercase tracking-wide mb-1">Applied On</p>
                                    <p className="text-sm text-ink">{new Date(app.applied_at).toLocaleDateString('en-NZ', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs font-semibold text-ink/60 uppercase tracking-wide mb-1">Lister</p>
                                    <p className="text-sm text-ink">{listerName(app.listerProfile)}</p>
                                  </div>
                                </div>
                                <div className="pt-2 flex flex-wrap gap-2">
                                  {awaitingStudentVerify.has(app.job_id) && (
                                    <Link
                                      href={`/dashboard/student/verify-completion/${app.job_id}`}
                                      className="inline-flex px-4 py-2 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
                                    >
                                      Verify work complete
                                    </Link>
                                  )}
                                  {app.status === 'accepted' && openChatJobIds.has(app.job_id) && (
                                    <Link
                                      href={`/messages/${app.job_id}`}
                                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-semibold hover:bg-secondary transition-colors"
                                    >
                                      Message lister
                                    </Link>
                                  )}
                                  {app.status === 'accepted' && (
                                    <button
                                      onClick={() => setCancelModalApp(app)}
                                      className="inline-flex px-4 py-2 border border-red-300 text-red-700 rounded-xl font-medium hover:bg-red-50 transition-colors"
                                    >
                                      Cancel job
                                    </button>
                                  )}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-12">
                  <h2 className="text-2xl font-bold text-ink mb-4">Past Applications</h2>
                  {pastApps.length === 0 ? (
                    <p className="text-ink-muted">No past applications.</p>
                  ) : (
                    <div className="space-y-4">
                      {pastApps.map((app) => (
                        <div
                          key={app.id}
                          className="bg-white rounded-2xl border border-ink/15 shadow-sm p-6 hover:shadow-xl transition-all duration-300 opacity-75"
                        >
                          {app.jobs && (
                            <>
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-2xl font-semibold text-ink">{app.jobs.job_name}</h3>
                                    <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                                      {app.jobs.category}
                                    </span>
                                  </div>
                                  <p className="text-sm text-ink/70 mb-2">{app.jobs.size_or_time}</p>
                                  <div className="flex items-center gap-2 text-sm text-ink/60">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    </svg>
                                    <span>{app.jobs.address}</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="mb-2">
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                      app.status === 'cancelled'
                                        ? 'bg-red-100 text-red-800'
                                        : app.status === 'accepted' && isCompleted(app.job_id)
                                          ? 'bg-green-100 text-green-800'
                                          : 'bg-gray-100 text-gray-800'
                                    }`}>
                                      {app.status === 'cancelled'
                                        ? 'Cancelled'
                                        : app.status === 'accepted' && isCompleted(app.job_id)
                                          ? 'Completed'
                                          : 'Job filled'}
                                    </span>
                                  </div>
                                  <p className="text-xl font-bold text-primary">${Number(app.jobs.price).toFixed(2)}</p>
                                  <p className="text-xs text-ink/60">Job price</p>
                                </div>
                              </div>
                              <div className="border-t border-ink/10 pt-4 space-y-3">
                                <FeeBreakdown price={app.jobs.price} gstRegistered={gstRegistered} showPayoutNote className="mb-4" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-xs font-semibold text-ink/60 uppercase tracking-wide mb-1">Size/Time</p>
                                    <p className="text-sm text-ink">{app.jobs.size_or_time}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs font-semibold text-ink/60 uppercase tracking-wide mb-1">Completion Date</p>
                                    <p className="text-sm text-ink">{formatDate(app.jobs.completion_date, app.jobs.is_flexible)}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs font-semibold text-ink/60 uppercase tracking-wide mb-1">Applied On</p>
                                    <p className="text-sm text-ink">{new Date(app.applied_at).toLocaleDateString('en-NZ', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs font-semibold text-ink/60 uppercase tracking-wide mb-1">Lister</p>
                                    <p className="text-sm text-ink">{listerName(app.listerProfile)}</p>
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
              </>
            )}
          </div>
        </section>

        {cancelModalApp && (
          <CancelJobModal
            jobName={cancelModalApp.jobs?.job_name ?? ''}
            listerName={listerName(cancelModalApp.listerProfile)}
            startTime={cancelModalApp.jobs?.start_time ? new Date(cancelModalApp.jobs.start_time) : null}
            onClose={() => setCancelModalApp(null)}
            onConfirm={handleCancelConfirm}
          />
        )}
      </main>
    </>
  )
}
