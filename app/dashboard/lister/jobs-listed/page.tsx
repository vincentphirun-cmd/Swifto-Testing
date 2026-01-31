'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth-context'
import { SiteNav } from '@/components/site-nav'

type ApplicationStatus = 'pending' | 'accepted' | 'not_selected'

type JobRow = {
  id: string
  job_name: string
  category: string
  size_or_time: string
  address: string
  area: string
  price: number
  completion_date: string | null
  is_flexible: boolean
  status: string
  created_at: string
}

type ApplicationRow = {
  id: string
  job_id: string
  student_id: string
  status: ApplicationStatus
  application_name: string | null
  experience: string | null
  availability: string | null
  profiles: {
    first_name: string
    last_name: string
    university: string | null
    rating: number | null
    total_jobs: number | null
    member_since: string
  } | null
}

export default function JobsListedPage() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState<JobRow[]>([])
  const [applicationsByJob, setApplicationsByJob] = useState<Record<string, ApplicationRow[]>>({})
  const [completionJobIds, setCompletionJobIds] = useState<Set<string>>(new Set())
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'active' | 'not_selected'>('active')
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    async function fetch() {
      if (!user) {
        setLoading(false)
        return
      }
      const supabase = createClient()
      const { data: jobsData, error: jobsErr } = await supabase
        .from('jobs')
        .select('*')
        .eq('lister_id', user.id)
        .in('status', ['active', 'in_progress'])
        .order('created_at', { ascending: false })

      if (jobsErr) {
        setLoading(false)
        return
      }
      setJobs(jobsData ?? [])

      const jobIds = (jobsData ?? []).map((j) => j.id)
      if (jobIds.length === 0) {
        setApplicationsByJob({})
        setLoading(false)
        return
      }

      const { data: appsData } = await supabase
        .from('job_applications')
        .select('id, job_id, student_id, status, application_name, experience, availability')
        .in('job_id', jobIds)

      const studentIds = [...new Set((appsData ?? []).map((a: { student_id: string }) => a.student_id))]
      let profilesMap: Record<string, ApplicationRow['profiles']> = {}
      if (studentIds.length > 0) {
        const { data: profData } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, university, rating, total_jobs, member_since')
          .in('id', studentIds)
        for (const p of profData ?? []) {
          profilesMap[p.id] = p
        }
      }

      const byJob: Record<string, ApplicationRow[]> = {}
      for (const app of appsData ?? []) {
        const row: ApplicationRow = {
          ...app,
          profiles: profilesMap[app.student_id] ?? null,
        }
        const arr = byJob[row.job_id] ?? []
        arr.push(row)
        byJob[row.job_id] = arr
      }
      setApplicationsByJob(byJob)

      const { data: compData } = await supabase
        .from('job_completions')
        .select('job_id')
        .eq('lister_id', user.id)
      setCompletionJobIds(new Set((compData ?? []).map((c: { job_id: string }) => c.job_id)))
      setLoading(false)
    }
    fetch()
  }, [user])

  const handleViewApplications = (jobId: string) => {
    setSelectedJobId(jobId)
    setActiveTab('active')
  }

  const handleCloseModal = () => {
    setSelectedJobId(null)
    setActiveTab('active')
  }

  const handleAccept = async (jobId: string, applicationId: string) => {
    if (!user) return
    setUpdating(true)
    const supabase = createClient()
    const apps = applicationsByJob[jobId] ?? []
    const otherIds = apps.filter((a) => a.id !== applicationId).map((a) => a.id)

    await supabase
      .from('job_applications')
      .update({ status: 'accepted' })
      .eq('id', applicationId)

    if (otherIds.length > 0) {
      await supabase
        .from('job_applications')
        .update({ status: 'not_selected' })
        .in('id', otherIds)
    }

    setApplicationsByJob((prev) => {
      const next = { ...prev }
      const arr = [...(next[jobId] ?? [])]
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === applicationId) arr[i] = { ...arr[i], status: 'accepted' }
        else if (otherIds.includes(arr[i].id)) arr[i] = { ...arr[i], status: 'not_selected' }
      }
      next[jobId] = arr
      return next
    })
    setUpdating(false)
  }

  const handleDecline = async (jobId: string, applicationId: string) => {
    if (!user) return
    setUpdating(true)
    const supabase = createClient()
    await supabase
      .from('job_applications')
      .update({ status: 'not_selected' })
      .eq('id', applicationId)

    setApplicationsByJob((prev) => {
      const next = { ...prev }
      const arr = [...(next[jobId] ?? [])]
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === applicationId) arr[i] = { ...arr[i], status: 'not_selected' }
      }
      next[jobId] = arr
      return next
    })
    setUpdating(false)
  }

  const getApplicationStatus = (jobId: string, applicationId: string): ApplicationStatus => {
    const app = (applicationsByJob[jobId] ?? []).find((a) => a.id === applicationId)
    return app?.status ?? 'pending'
  }

  const hasAcceptedApplication = (jobId: string): boolean => {
    return (applicationsByJob[jobId] ?? []).some((a) => a.status === 'accepted')
  }

  const selectedJob = selectedJobId ? jobs.find((j) => j.id === selectedJobId) : null
  const selectedJobApplications = selectedJobId ? applicationsByJob[selectedJobId] ?? [] : []

  const activeApplications = selectedJobApplications.filter(
    (a) => a.status === 'pending' || a.status === 'accepted'
  )
  const notSelectedApplications = selectedJobApplications.filter((a) => a.status === 'not_selected')
  const displayedApplications = activeTab === 'active' ? activeApplications : notSelectedApplications
  const jobHasAccepted = selectedJobId ? hasAcceptedApplication(selectedJobId) : false

  const formatDate = (d: string | null, flexible: boolean) =>
    flexible ? 'Flexible' : d ? new Date(d).toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric' }) : 'TBD'
  const formatSince = (s: string) =>
    s ? new Date(s).toLocaleDateString('en-NZ', { month: 'short', year: 'numeric' }) : ''
  const timeAgo = (s: string) => {
    const diff = Date.now() - new Date(s).getTime()
    const days = Math.floor(diff / 86400000)
    if (days < 1) return 'Today'
    if (days === 1) return '1 day ago'
    if (days < 7) return `${days} days ago`
    if (days < 30) return `${Math.floor(days / 7)} week(s) ago`
    return `${Math.floor(days / 30)} month(s) ago`
  }

  if (!user) {
    return (
      <>
        <SiteNav />
        <main className="min-h-screen bg-primary flex items-center justify-center">
          <p className="text-white">Please log in to view your jobs.</p>
        </main>
      </>
    )
  }

  return (
    <>
      <SiteNav />
      <main className="min-h-screen bg-primary">
        <section className="py-16 md:py-24">
          <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
            <div className="mb-8">
              <Link
                href="/dashboard/lister"
                className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
              </Link>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Active Jobs</h1>
              <p className="text-white/80 text-lg">View and manage your active job listings</p>
            </div>

            {loading ? (
              <div className="text-center py-16 text-white/80">
                <p className="text-lg">Loading jobs…</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-16 text-white/80">
                <p className="text-lg">No active jobs yet.</p>
                <Link href="/dashboard/lister/post-job" className="text-primary hover:underline mt-2 inline-block">
                  Post a job
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => {
                  const apps = applicationsByJob[job.id] ?? []
                  const acceptedCount = apps.filter((a) => a.status === 'accepted').length
                  const pendingCount = apps.filter((a) => a.status === 'pending').length
                  return (
                    <div
                      key={job.id}
                      className="bg-white rounded-2xl border border-ink/15 shadow-sm p-6 hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-2xl font-semibold text-ink">{job.job_name}</h3>
                            <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                              {job.category}
                            </span>
                          </div>
                          <p className="text-sm text-ink/70 mb-3">{job.size_or_time}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary mb-1">${Number(job.price).toFixed(2)}</p>
                          <p className="text-xs text-ink/60">Price</p>
                        </div>
                      </div>

                      <div className="border-t border-ink/10 pt-4 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs font-semibold text-ink/60 uppercase tracking-wide mb-1">Size/Time</p>
                            <p className="text-sm text-ink">{job.size_or_time}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-ink/60 uppercase tracking-wide mb-1">Location</p>
                            <p className="text-sm text-ink">{job.address}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-ink/60 uppercase tracking-wide mb-1">Area</p>
                            <p className="text-sm text-ink">{job.area}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-ink/60 uppercase tracking-wide mb-1">Completion Date</p>
                            <p className="text-sm text-ink">{formatDate(job.completion_date, job.is_flexible)}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-ink/10">
                          <div className="flex items-center gap-4">
                            <div>
                              <p className="text-xs font-medium text-ink/60">Applications</p>
                              <p className="text-sm font-semibold text-primary">{apps.length}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-ink/60">Status</p>
                              <p className="text-sm font-semibold text-green-600 capitalize">{job.status.replace('_', ' ')}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-ink/60">Posted</p>
                              <p className="text-sm text-ink/60">{timeAgo(job.created_at)}</p>
                            </div>
                          </div>
                          <div className="flex gap-3 flex-wrap">
                            <button
                              onClick={() => handleViewApplications(job.id)}
                              className="px-4 py-2 bg-primary/10 text-primary rounded-xl font-semibold hover:bg-primary/20 transition-colors"
                            >
                              View Applications
                            </button>
                            {job.status === 'in_progress' &&
                              (applicationsByJob[job.id] ?? []).some((a) => a.status === 'accepted') &&
                              !completionJobIds.has(job.id) && (
                                <Link
                                  href={`/dashboard/lister/verify-completion/${job.id}`}
                                  className="px-4 py-2 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors inline-flex items-center"
                                >
                                  Verify work complete
                                </Link>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      {selectedJobId && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleCloseModal} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-ink mb-2">Student Applications</h2>
                  <p className="text-lg text-ink/70">{selectedJob.job_name}</p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="w-10 h-10 rounded-full bg-ink/5 hover:bg-ink/10 flex items-center justify-center transition-colors"
                >
                  <svg className="w-6 h-6 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex gap-2 mb-6 border-b border-ink/10">
                <button
                  onClick={() => setActiveTab('active')}
                  className={`px-4 py-2 font-semibold transition-colors border-b-2 ${
                    activeTab === 'active' ? 'text-primary border-primary' : 'text-ink/60 border-transparent hover:text-ink'
                  }`}
                >
                  Active applications ({activeApplications.length})
                </button>
                <button
                  onClick={() => setActiveTab('not_selected')}
                  className={`px-4 py-2 font-semibold transition-colors border-b-2 ${
                    activeTab === 'not_selected' ? 'text-primary border-primary' : 'text-ink/60 border-transparent hover:text-ink'
                  }`}
                >
                  Not selected ({notSelectedApplications.length})
                </button>
              </div>

              {displayedApplications.length > 0 ? (
                <div className="space-y-4">
                  {displayedApplications.map((app) => {
                    const status = app.status
                    const isAccepted = status === 'accepted'
                    const canAccept = !jobHasAccepted || isAccepted
                    const p = app.profiles
                    const displayName = app.application_name || (p ? `${p.first_name} ${p.last_name}`.trim() : 'Unknown')
                    return (
                      <div key={app.id} className="bg-canvas/50 rounded-2xl border border-ink/15 shadow-sm p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className="text-xl font-semibold text-ink">{displayName}</h3>
                                {status === 'pending' && (
                                  <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">Pending</span>
                                )}
                                {status === 'accepted' && (
                                  <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-semibold rounded-full">Accepted</span>
                                )}
                                {status === 'not_selected' && (
                                  <span className="px-2 py-0.5 bg-gray-100 text-gray-800 text-xs font-semibold rounded-full">Not selected</span>
                                )}
                              </div>
                              <p className="text-sm text-ink/70">{p?.university ?? '—'}</p>
                              <p className="text-xs text-ink/60 mt-1">Applied for: {selectedJob.job_name}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-lg">
                            <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-primary font-semibold">{p?.rating ?? '—'}</span>
                          </div>
                        </div>

                        {(app.experience || app.availability) && (
                          <div className="border-t border-ink/10 pt-4 space-y-2">
                            {app.experience && (
                              <div>
                                <p className="text-sm font-semibold text-ink mb-1">Experience</p>
                                <p className="text-sm text-ink/80">{app.experience}</p>
                              </div>
                            )}
                            {app.availability && (
                              <div>
                                <p className="text-sm font-semibold text-ink mb-1">Availability</p>
                                <p className="text-sm text-ink/80">{app.availability}</p>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex items-center gap-2 pt-2 mt-2 border-t border-ink/10">
                          <span className="text-xs font-medium text-ink/60">Total Jobs:</span>
                          <span className="text-xs font-semibold text-primary">{p?.total_jobs ?? 0}</span>
                          <span className="text-xs text-ink/40">•</span>
                          <span className="text-xs font-medium text-ink/60">Member since:</span>
                          <span className="text-xs text-ink/60">{formatSince(p?.member_since ?? '')}</span>
                        </div>

                        {activeTab === 'active' && (
                          <div className="flex gap-3 mt-4 pt-4 border-t border-ink/10">
                            <button
                              onClick={() => handleAccept(selectedJobId, app.id)}
                              disabled={!canAccept || updating}
                              className={`flex-1 rounded-xl px-4 py-2.5 font-semibold transition-colors disabled:opacity-70 disabled:cursor-not-allowed ${
                                canAccept && !updating ? 'bg-primary text-white hover:bg-secondary' : 'bg-ink/10 text-ink/40 cursor-not-allowed'
                              }`}
                            >
                              {isAccepted ? 'Accepted' : jobHasAccepted ? 'Another student accepted' : updating ? 'Updating…' : 'Accept'}
                            </button>
                            {!isAccepted && (
                              <button
                                onClick={() => handleDecline(selectedJobId, app.id)}
                                disabled={updating}
                                className="flex-1 bg-canvas text-ink rounded-xl px-4 py-2.5 font-semibold hover:bg-ink/5 transition-colors disabled:opacity-70"
                              >
                                Decline
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-lg text-ink/70">
                    {activeTab === 'active' ? 'No active applications for this job.' : 'No applications in this category.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
