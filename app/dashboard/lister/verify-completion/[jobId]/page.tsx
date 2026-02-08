'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth-context'
import { SiteNav } from '@/components/site-nav'
import { LoadingSpinner } from '@/components/loading-spinner'
import { captureEvent } from '@/lib/posthog'

export default function ListerVerifyCompletionPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const jobId = params.jobId as string
  const [job, setJob] = useState<{
    id: string
    job_name: string
    category: string
    size_or_time: string
    address: string
    area: string
    price: number
  } | null>(null)
  const [acceptedStudent, setAcceptedStudent] = useState<{ id: string; first_name: string; last_name: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [alreadyVerified, setAlreadyVerified] = useState(false)

  useEffect(() => {
    async function fetchData() {
      if (!user || !jobId) {
        setLoading(false)
        return
      }
      const supabase = createClient()
      const { data: jobData, error: jobErr } = await supabase
        .from('jobs')
        .select('id, job_name, category, size_or_time, address, area, price, lister_id, status')
        .eq('id', jobId)
        .eq('lister_id', user.id)
        .single()

      if (jobErr || !jobData) {
        setError('Job not found')
        setLoading(false)
        return
      }
      if (jobData.status !== 'in_progress') {
        setError('This job is not in progress. Only in-progress jobs can be verified.')
        setLoading(false)
        return
      }

      const { data: existingComp } = await supabase
        .from('job_completions')
        .select('id, lister_verified_at')
        .eq('job_id', jobId)
        .single()

      if (existingComp?.lister_verified_at) {
        setAlreadyVerified(true)
        setJob(jobData)
        setLoading(false)
        return
      }

      const { data: acceptedApp } = await supabase
        .from('job_applications')
        .select('student_id')
        .eq('job_id', jobId)
        .eq('status', 'accepted')
        .single()

      if (!acceptedApp) {
        setError('No accepted student found for this job.')
        setJob(jobData)
        setLoading(false)
        return
      }

      const { data: prof } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .eq('id', acceptedApp.student_id)
        .single()

      setJob(jobData)
      setAcceptedStudent(prof ?? { id: acceptedApp.student_id, first_name: 'Unknown', last_name: '' })
      setLoading(false)
    }
    fetchData()
  }, [user, jobId])

  const handleVerify = async () => {
    if (!user || !jobId || !acceptedStudent) return
    setSubmitting(true)
    setError(null)
    const supabase = createClient()
    const { error: err } = await supabase.from('job_completions').insert({
      job_id: jobId,
      student_id: acceptedStudent.id,
      lister_id: user.id,
      lister_verified_at: new Date().toISOString(),
    })
    setSubmitting(false)
    if (err) {
      setError(err.message)
      return
    }
    captureEvent('completion_verified', { job_id: jobId, role: 'lister' })
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.access_token) {
      fetch('/api/email/notify-job-completed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ jobId }),
      }).catch(() => {})
    }
    router.push('/dashboard/lister/jobs-listed')
  }

  if (!user) {
    return (
      <>
        <SiteNav />
        <main className="min-h-screen bg-primary flex items-center justify-center">
          <p className="text-white">Please log in.</p>
        </main>
      </>
    )
  }

  if (loading) {
    return (
      <>
        <SiteNav />
        <main className="min-h-screen bg-primary flex flex-col items-center justify-center gap-4">
          <LoadingSpinner size="lg" variant="light" />
          <p className="text-white/80">Loading…</p>
        </main>
      </>
    )
  }

  if (error && !job) {
    return (
      <>
        <SiteNav />
        <main className="min-h-screen bg-primary">
          <section className="py-16 md:py-24">
            <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
              <p className="text-white mb-4">{error}</p>
              <Link href="/dashboard/lister/jobs-listed" className="text-primary hover:underline">
                Back to Active Jobs
              </Link>
            </div>
          </section>
        </main>
      </>
    )
  }

  const studentName = acceptedStudent
    ? `${acceptedStudent.first_name} ${acceptedStudent.last_name}`.trim()
    : '—'

  return (
    <>
      <SiteNav />
      <main className="min-h-screen bg-primary">
        <section className="py-16 md:py-24">
          <div className="mx-auto w-full max-w-2xl px-4 md:px-8">
            <Link
              href="/dashboard/lister/jobs-listed"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Active Jobs
            </Link>

            <div className="bg-white rounded-2xl border border-ink/15 shadow-sm p-8">
              <h1 className="text-2xl font-bold text-ink mb-2">Verify work complete</h1>
              <p className="text-ink/70 mb-6">
                Confirm that the work for this job has been completed as agreed.
              </p>

              {job && (
                <div className="space-y-4 mb-8">
                  <div>
                    <p className="text-xs font-semibold text-ink/60 uppercase tracking-wide mb-1">Job</p>
                    <p className="font-semibold text-ink">{job.job_name}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-ink/60 uppercase tracking-wide mb-1">Category</p>
                    <p className="text-ink">{job.category}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-ink/60 uppercase tracking-wide mb-1">Completed by</p>
                    <p className="text-ink">{studentName}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-ink/60 uppercase tracking-wide mb-1">Location</p>
                    <p className="text-ink">{job.address}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-ink/60 uppercase tracking-wide mb-1">Amount</p>
                    <p className="font-semibold text-primary">${Number(job.price).toFixed(2)}</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm">
                  {error}
                </div>
              )}

              {alreadyVerified ? (
                <p className="text-ink/70">
                  You have already verified this job. Awaiting student confirmation.
                </p>
              ) : acceptedStudent ? (
                <button
                  onClick={handleVerify}
                  disabled={submitting}
                  className="w-full h-12 rounded-xl bg-primary text-white font-semibold hover:bg-secondary transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Verifying…' : 'I confirm the work has been completed'}
                </button>
              ) : (
                <p className="text-ink/70">No accepted student for this job. Cannot verify.</p>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
