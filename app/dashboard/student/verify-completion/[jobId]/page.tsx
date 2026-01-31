'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth-context'
import { SiteNav } from '@/components/site-nav'

export default function StudentVerifyCompletionPage() {
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
    price: number
  } | null>(null)
  const [listerName, setListerName] = useState<string>('—')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [alreadyVerified, setAlreadyVerified] = useState(false)
  const [canVerify, setCanVerify] = useState(false)

  useEffect(() => {
    async function fetchData() {
      if (!user || !jobId) {
        setLoading(false)
        return
      }
      const supabase = createClient()
      const { data: compData } = await supabase
        .from('job_completions')
        .select('id, job_id, student_id, lister_id, lister_verified_at, student_verified_at')
        .eq('job_id', jobId)
        .eq('student_id', user.id)
        .single()

      if (!compData) {
        setError('Completion record not found. The lister must verify first.')
        setLoading(false)
        return
      }
      if (compData.student_verified_at) {
        setAlreadyVerified(true)
      }
      if (compData.lister_verified_at && !compData.student_verified_at) {
        setCanVerify(true)
      }

      const { data: jobData } = await supabase
        .from('jobs')
        .select('id, job_name, category, size_or_time, address, price')
        .eq('id', jobId)
        .single()

      if (jobData) setJob(jobData)

      if (compData.lister_id) {
        const { data: prof } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', compData.lister_id)
          .single()
        if (prof) setListerName(`${prof.first_name} ${prof.last_name}`.trim())
      }
      setLoading(false)
    }
    fetchData()
  }, [user, jobId])

  const handleVerify = async () => {
    if (!user || !jobId) return
    setSubmitting(true)
    setError(null)
    const supabase = createClient()
    const { error: err } = await supabase
      .from('job_completions')
      .update({ student_verified_at: new Date().toISOString() })
      .eq('job_id', jobId)
      .eq('student_id', user.id)
    setSubmitting(false)
    if (err) {
      setError(err.message)
      return
    }
    router.push('/dashboard/student/jobs-applied')
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
        <main className="min-h-screen bg-primary flex items-center justify-center">
          <p className="text-white">Loading…</p>
        </main>
      </>
    )
  }

  if (error && !canVerify && !alreadyVerified && !job) {
    return (
      <>
        <SiteNav />
        <main className="min-h-screen bg-primary">
          <section className="py-16 md:py-24">
            <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
              <p className="text-white mb-4">{error}</p>
              <Link href="/dashboard/student/jobs-applied" className="text-primary hover:underline">
                Back to Active Jobs
              </Link>
            </div>
          </section>
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
            <Link
              href="/dashboard/student/jobs-applied"
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
                Confirm that you have completed this job as agreed with the lister.
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
                    <p className="text-xs font-semibold text-ink/60 uppercase tracking-wide mb-1">Lister</p>
                    <p className="text-ink">{listerName}</p>
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
                  You have already verified this job. It will appear in Jobs Completed once both parties have confirmed.
                </p>
              ) : canVerify ? (
                <button
                  onClick={handleVerify}
                  disabled={submitting}
                  className="w-full h-12 rounded-xl bg-primary text-white font-semibold hover:bg-secondary transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Verifying…' : 'I confirm the work has been completed'}
                </button>
              ) : (
                <p className="text-ink/70">
                  The lister has not verified this job yet. Please wait for them to confirm before you can verify.
                </p>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
