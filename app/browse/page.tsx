'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { mapJobRowToBrowseJob, type BrowseJob } from '@/lib/types'
import { SiteNav } from '@/components/site-nav'
import { useAuth } from '@/lib/auth-context'

export default function BrowseJobsPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [currentPage, setCurrentPage] = useState(1)
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set())
  const [selectedJob, setSelectedJob] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    experience: '',
    availability: ''
  })
  const [allJobs, setAllJobs] = useState<BrowseJob[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [applying, setApplying] = useState(false)
  const jobsPerPage = 25

  // Fetch jobs and (if logged-in student) their applications
  useEffect(() => {
    async function fetchJobs() {
      setLoading(true)
      setError(null)
      try {
        const supabase = createClient()
        const { data, error: err } = await supabase
          .from('jobs')
          .select('id, job_name, category, size_or_time, address, area, price, completion_date, is_flexible, status, created_at')
          .eq('status', 'active')
          .order('created_at', { ascending: false })

        if (err) {
          setError(err.message)
          setAllJobs([])
          return
        }
        setAllJobs((data ?? []).map(mapJobRowToBrowseJob))
      } catch (e: unknown) {
        const isAbort = e && (
          (e instanceof Error && e.name === 'AbortError') ||
          (typeof e === 'object' && 'name' in e && (e as { name?: string }).name === 'AbortError') ||
          (typeof (e as { message?: unknown })?.message === 'string' && String((e as { message: string }).message).toLowerCase().includes('aborted'))
        )
        if (isAbort) {
          setLoading(false)
          return
        }
        setError(e instanceof Error ? e.message : 'Failed to load jobs')
        setAllJobs([])
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [])

  // Fetch student's applications when logged in
  useEffect(() => {
    async function fetchApplications() {
      if (!user) {
        setAppliedJobs(new Set())
        return
      }
      const supabase = createClient()
      const { data } = await supabase
        .from('job_applications')
        .select('job_id')
        .eq('student_id', user.id)
      const ids = new Set((data ?? []).map((r: { job_id: string }) => r.job_id))
      setAppliedJobs(ids)
    }
    fetchApplications()
  }, [user])

  const handleQuickApply = async (jobId: string) => {
    if (!user) {
      router.push('/login?redirect=/browse')
      return
    }
    const supabase = createClient()
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, first_name, last_name')
      .eq('id', user.id)
      .single()
    if (profile?.role !== 'student') {
      setError('Only students can apply for jobs.')
      return
    }
    if (appliedJobs.has(jobId)) return
    setApplying(true)
    const { error: err } = await supabase.from('job_applications').insert({
      job_id: jobId,
      student_id: user.id,
      status: 'pending',
      application_name: profile ? [profile.first_name, profile.last_name].filter(Boolean).join(' ') : null,
    })
    setApplying(false)
    if (err) {
      if (err.code === '23505') setAppliedJobs(prev => new Set(prev).add(jobId))
      else setError(err.message)
      return
    }
    setAppliedJobs(prev => new Set(prev).add(jobId))
  }

  const handleApplyClick = (jobId: string) => {
    if (!user) {
      router.push('/login?redirect=/browse')
      return
    }
    setSelectedJob(jobId)
    setFormData({ name: '', experience: '', availability: '' })
  }

  const handleCloseModal = () => {
    setSelectedJob(null)
    setFormData({ name: '', experience: '', availability: '' })
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmitApplication = async () => {
    if (!selectedJob || !formData.name.trim() || !formData.experience.trim() || !formData.availability.trim()) return
    if (!user) {
      router.push('/login?redirect=/browse')
      return
    }
    const supabase = createClient()
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    if (profile?.role !== 'student') {
      setError('Only students can apply for jobs.')
      return
    }
    setApplying(true)
    const { error: err } = await supabase.from('job_applications').insert({
      job_id: selectedJob,
      student_id: user.id,
      status: 'pending',
      application_name: formData.name.trim(),
      experience: formData.experience.trim(),
      availability: formData.availability.trim(),
    })
    setApplying(false)
    if (err) {
      if (err.code === '23505') {
        setAppliedJobs(prev => new Set(prev).add(selectedJob))
        handleCloseModal()
      } else {
        setError(err.message)
      }
      return
    }
    setAppliedJobs(prev => new Set(prev).add(selectedJob))
    handleCloseModal()
  }

  const isFormValid = formData.name.trim() !== '' && formData.experience.trim() !== '' && formData.availability.trim() !== ''

  const totalPages = Math.max(1, Math.ceil(allJobs.length / jobsPerPage))
  const indexOfLastJob = currentPage * jobsPerPage
  const indexOfFirstJob = indexOfLastJob - jobsPerPage
  const jobs = allJobs.slice(indexOfFirstJob, indexOfLastJob)

  const selectedJobData = useMemo(() => {
    if (!selectedJob) return null
    return allJobs.find(job => job.id === selectedJob) || null
  }, [selectedJob, allJobs])

  return (
    <>
      <SiteNav />
      <main>
        {/* Hero Section */}
        <section className="py-12 md:py-16 bg-primary">
          <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
            <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-white text-center">
              Browse Jobs
            </h1>
          </div>
        </section>

        {/* Jobs List Section */}
        <section className="py-8 md:py-12 bg-canvas">
          <div className="mx-auto w-full max-w-4xl px-4 md:px-8">
            {loading && (
              <div className="text-center py-16 text-ink/70">
                <p className="text-lg font-medium">Loading jobs…</p>
              </div>
            )}
            {error && !loading && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
                <p className="text-red-800 font-medium">{error}</p>
                {error.toLowerCase().includes('fetch') || error.toLowerCase().includes('network') || error.toLowerCase().includes('env') ? (
                  <p className="text-sm text-red-700 mt-2">Check .env.local for NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.</p>
                ) : null}
              </div>
            )}
            {!loading && !error && allJobs.length === 0 && (
              <div className="text-center py-16 text-ink/70">
                <p className="text-lg font-medium">No jobs yet.</p>
                <p className="text-sm mt-2">Post a job from the lister dashboard to get started.</p>
              </div>
            )}
            {!loading && !error && allJobs.length > 0 && (
            <>
            <div className="space-y-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-xl p-5 md:p-6 border border-ink/10 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      {/* Left side - Job name, area, date and time */}
                      <div className="flex-1 space-y-2">
                        <h3 className="text-lg md:text-xl font-semibold text-ink">
                          {job.name}
                        </h3>
                        <p className="text-sm md:text-base text-ink/70">
                          {job.area}
                        </p>
                        <div className="flex flex-wrap gap-3 text-sm text-ink/60">
                          <span>{job.date}</span>
                          <span>•</span>
                          <span>{job.timeOfDay}</span>
                        </div>
                      </div>
                      
                      {/* Right side - Time and pay */}
                      <div className="flex flex-row md:flex-col md:items-end gap-4 md:gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-ink/60">Time:</span>
                          <span className="text-sm md:text-base font-medium text-ink">
                            {job.timeNeeded}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-ink/60">Pay:</span>
                          <span className="text-base md:text-lg font-semibold text-primary">
                            {job.pay}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action buttons */}
                    <div className="flex gap-3 pt-2 border-t border-ink/10 justify-end">
                      {appliedJobs.has(job.id) ? (
                        <button 
                          disabled
                          className="h-10 px-6 rounded-xl font-medium bg-green-100 text-green-700 border-2 border-green-300 cursor-default flex items-center justify-center"
                        >
                          Applied
                        </button>
                      ) : (
                        <>
                          <button 
                            onClick={() => handleQuickApply(job.id)}
                            disabled={applying}
                            className="h-10 px-6 rounded-xl bg-primary text-white font-medium hover:bg-secondary transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                          >
                            {applying ? 'Applying…' : 'Quick Apply'}
                          </button>
                          <button 
                            onClick={() => handleApplyClick(job.id)}
                            className="h-10 px-6 rounded-xl border border-ink/20 text-ink font-medium hover:border-primary hover:text-primary transition-colors flex items-center justify-center"
                          >
                            Apply
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination buttons */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border border-ink/20 text-ink disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary transition-colors"
                >
                  Previous
                </button>
                
                <span className="text-sm text-ink/70">
                  Page {currentPage} of {totalPages}
                </span>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg border border-ink/20 text-ink disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary transition-colors"
                >
                  Next
                </button>
              </div>
            )}
            </>
            )}
          </div>
        </section>
      </main>

      {/* Application Modal */}
      {selectedJob && selectedJobData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleCloseModal}
          ></div>
          
          {/* Modal Card */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 md:p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-ink mb-2">
                    Apply for Job
                  </h2>
                  <p className="text-lg text-ink/70">{selectedJobData.name}</p>
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

              {/* Job Details */}
              <div className="bg-canvas/50 rounded-xl p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-ink/60 mb-1">Location</p>
                    <p className="font-medium text-ink">{selectedJobData.area}</p>
                  </div>
                  <div>
                    <p className="text-ink/60 mb-1">Date</p>
                    <p className="font-medium text-ink">{selectedJobData.date}</p>
                  </div>
                  <div>
                    <p className="text-ink/60 mb-1">Time</p>
                    <p className="font-medium text-ink">{selectedJobData.timeOfDay}</p>
                  </div>
                  <div>
                    <p className="text-ink/60 mb-1">Duration</p>
                    <p className="font-medium text-ink">{selectedJobData.timeNeeded}</p>
                  </div>
                  <div>
                    <p className="text-ink/60 mb-1">Pay</p>
                    <p className="font-semibold text-primary text-lg">{selectedJobData.pay}</p>
                  </div>
                </div>
              </div>

              {/* Application Form */}
              <div className="space-y-6">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-ink mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-ink/20 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-ink"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Experience Field */}
                <div>
                  <label htmlFor="experience" className="block text-sm font-semibold text-ink mb-2">
                    Experience *
                  </label>
                  <textarea
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleFormChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-ink/20 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-ink resize-none"
                    placeholder="Tell us about your relevant experience for this job..."
                  />
                </div>

                {/* Availability Field */}
                <div>
                  <label htmlFor="availability" className="block text-sm font-semibold text-ink mb-2">
                    Availability *
                  </label>
                  <p className="text-xs text-ink/60 mb-2">
                    Job requires: {selectedJobData.timeOfDay} on {selectedJobData.date}
                  </p>
                  <textarea
                    id="availability"
                    name="availability"
                    value={formData.availability}
                    onChange={handleFormChange}
                    required
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-ink/20 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-ink resize-none"
                    placeholder="Confirm your availability for this time slot..."
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8 pt-6 border-t border-ink/10">
                <button
                  onClick={handleSubmitApplication}
                  disabled={!isFormValid || applying}
                  className={`w-full h-12 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed ${
                    isFormValid && !applying
                      ? 'bg-primary text-white hover:bg-secondary shadow-lg hover:shadow-xl'
                      : 'bg-ink/10 text-ink/40 cursor-not-allowed'
                  }`}
                >
                  {applying ? 'Submitting…' : isFormValid ? 'Submit Application' : 'Fill all fields to apply'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
