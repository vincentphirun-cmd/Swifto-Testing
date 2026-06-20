'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { mapJobRowToBrowseJob, type BrowseJob } from '@/lib/types'
import { SiteNav } from '@/components/site-nav'
import { DesignBadge } from '@/components/design/design-badge'
import { useAuth } from '@/lib/auth-context'
import { captureEvent } from '@/lib/posthog'
import { LoadingSpinner } from '@/components/loading-spinner'
import { ErrorAlert } from '@/components/error-alert'
import { FeeBreakdown } from '@/components/fee-breakdown'
import { fetchStudentGstRegistered } from '@/lib/profile-completions'

export default function BrowseJobsPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [gstRegistered, setGstRegistered] = useState(false)
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
  const [searchQuery, setSearchQuery] = useState('')

  const fetchJobs = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const supabase = createClient()
      const { data, error: err } = await supabase
        .from('jobs')
        .select('id, job_name, category, size_or_time, address, area, price, completion_date, is_flexible, status, created_at, urgent_rebook_until')
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (err) {
        setError(err.message)
        setAllJobs([])
        return
      }
      const mapped = (data ?? []).map(mapJobRowToBrowseJob)
      mapped.sort((a, b) => (b.urgentRebook ? 1 : 0) - (a.urgentRebook ? 1 : 0))
      setAllJobs(mapped)
    } catch (e: unknown) {
      const isAbort = e && (
        (e instanceof Error && e.name === 'AbortError') ||
        (typeof e === 'object' && 'name' in e && (e as { name?: string }).name === 'AbortError') ||
        (typeof (e as { message?: unknown })?.message === 'string' && String((e as { message: string }).message).toLowerCase().includes('aborted'))
      )
      if (isAbort) {
        setAllJobs([])
        return
      }
      setError(e instanceof Error ? e.message : 'Failed to load jobs')
      setAllJobs([])
    } finally {
      setLoading(false)
    }
  }, [])

  const [categoryFilter, setCategoryFilter] = useState('')
  const [areaFilter, setAreaFilter] = useState('')
  const [minPrice, setMinPrice] = useState<number | ''>('')
  const [maxPrice, setMaxPrice] = useState<number | ''>('')
  const jobsPerPage = 25

  const CATEGORY_OPTIONS = [
    { value: '', label: 'All categories' },
    { value: 'moving', label: 'Moving' },
    { value: 'cleaning', label: 'Cleaning' },
    { value: 'tutoring', label: 'Tutoring' },
    { value: 'delivery', label: 'Delivery' },
    { value: 'assembly', label: 'Assembly' },
    { value: 'yard-work', label: 'Yard Work' },
    { value: 'pet-care', label: 'Pet Care' },
    { value: 'other', label: 'Other' },
  ]

  const filteredJobs = useMemo(() => {
    let list = allJobs
    const q = searchQuery.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (job) =>
          job.name.toLowerCase().includes(q) ||
          job.category.toLowerCase().includes(q) ||
          job.area.toLowerCase().includes(q) ||
          job.timeNeeded.toLowerCase().includes(q)
      )
    }
    if (categoryFilter) {
      list = list.filter((job) => job.category === categoryFilter)
    }
    if (areaFilter) {
      list = list.filter((job) => job.area.toLowerCase() === areaFilter.toLowerCase())
    }
    if (minPrice !== '' && minPrice !== null) {
      const min = Number(minPrice)
      if (!isNaN(min)) list = list.filter((job) => job.priceAmount >= min)
    }
    if (maxPrice !== '' && maxPrice !== null) {
      const max = Number(maxPrice)
      if (!isNaN(max)) list = list.filter((job) => job.priceAmount <= max)
    }
    return list
  }, [allJobs, searchQuery, categoryFilter, areaFilter, minPrice, maxPrice])

  const uniqueAreas = useMemo(() => {
    const areas = new Set(allJobs.map((j) => j.area.trim()).filter(Boolean))
    return Array.from(areas).sort()
  }, [allJobs])

  useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  // Fetch student's applications and GST status when logged in
  useEffect(() => {
    async function fetchApplications() {
      if (!user) {
        setAppliedJobs(new Set())
        setGstRegistered(false)
        return
      }
      const supabase = createClient()
      const [appsResult, gstReg] = await Promise.all([
        supabase.from('job_applications').select('job_id').eq('student_id', user.id),
        fetchStudentGstRegistered(user.id),
      ])
      setGstRegistered(gstReg)
      const ids = new Set((appsResult.data ?? []).map((r: { job_id: string }) => r.job_id))
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
    const { data: app, error: err } = await supabase
      .from('job_applications')
      .insert({
        job_id: jobId,
        student_id: user.id,
        status: 'pending',
        application_name: profile ? [profile.first_name, profile.last_name].filter(Boolean).join(' ') : null,
      })
      .select('id')
      .single()
    setApplying(false)
    if (err) {
      if (err.code === '23505') setAppliedJobs(prev => new Set(prev).add(jobId))
      else setError(err.message)
      return
    }
    captureEvent('job_applied', { job_id: jobId, application_type: 'quick' })
    setAppliedJobs(prev => new Set(prev).add(jobId))
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.access_token && app?.id) {
      fetch('/api/email/notify-application-received', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ jobId, applicationId: app.id }),
      }).catch(() => {})
    }
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
    const { data: app, error: err } = await supabase
      .from('job_applications')
      .insert({
        job_id: selectedJob,
        student_id: user.id,
        status: 'pending',
        application_name: formData.name.trim(),
        experience: formData.experience.trim(),
        availability: formData.availability.trim(),
      })
      .select('id')
      .single()
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
    captureEvent('job_applied', { job_id: selectedJob, application_type: 'full' })
    setAppliedJobs(prev => new Set(prev).add(selectedJob))
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.access_token && app?.id) {
      fetch('/api/email/notify-application-received', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ jobId: selectedJob, applicationId: app.id }),
      }).catch(() => {})
    }
    handleCloseModal()
  }

  const isFormValid = formData.name.trim() !== '' && formData.experience.trim() !== '' && formData.availability.trim() !== ''

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / jobsPerPage))
  const indexOfLastJob = currentPage * jobsPerPage
  const indexOfFirstJob = indexOfLastJob - jobsPerPage
  const jobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob)

  const selectedJobData = useMemo(() => {
    if (!selectedJob) return null
    return allJobs.find(job => job.id === selectedJob) || null
  }, [selectedJob, allJobs])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, categoryFilter, areaFilter, minPrice, maxPrice])

  return (
    <>
      <SiteNav />
      <main className="bg-canvas">
        <section className="swifto-content pt-12 pb-2">
          <DesignBadge tone="accent" className="mb-3">
            {allJobs.length > 0 ? `${allJobs.length} open jobs in Auckland` : 'Open jobs in Auckland'}
          </DesignBadge>
          <h1 className="text-[clamp(2rem,4.4vw,3.125rem)] leading-tight">
            Find work that fits
            <br />
            around your week.
          </h1>
          <div className="mt-6 relative max-w-2xl">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jobs, suburbs, categories…"
              className="w-full h-[52px] pl-11 pr-4 rounded-btn border-[1.5px] border-line bg-white text-[15.5px] text-ink placeholder-ink-3 focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/15"
            />
          </div>
        </section>

        <section className="py-6 md:py-8 bg-canvas">
          <div className="swifto-content max-w-4xl">
            {loading && (
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <LoadingSpinner size="lg" />
                <p className="text-lg font-medium text-ink/70">Loading jobs…</p>
              </div>
            )}
            {error && !loading && (
              <ErrorAlert
                message={
                  error.toLowerCase().includes('fetch') || error.toLowerCase().includes('network') || error.toLowerCase().includes('env')
                    ? `${error} Check .env.local for NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.`
                    : error
                }
                onRetry={fetchJobs}
              />
            )}
            {!loading && !error && allJobs.length === 0 && (
              <div className="text-center py-16 text-ink/70">
                <p className="text-lg font-medium">No jobs yet.</p>
                <p className="text-sm mt-2">Post a job from the lister dashboard to get started.</p>
              </div>
            )}
            {!loading && !error && allJobs.length > 0 && (
            <>
            <div className="mb-8 space-y-4">
              <div className="flex flex-wrap gap-2">
                {CATEGORY_OPTIONS.map((opt) => {
                  const on = categoryFilter === opt.value
                  return (
                    <button
                      key={opt.value || 'all'}
                      type="button"
                      onClick={() => setCategoryFilter(opt.value)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold border-[1.5px] transition-all duration-200 ease-swifto ${
                        on ? 'bg-ink text-white border-transparent' : 'bg-white text-ink-2 border-line hover:border-ink/20'
                      }`}
                    >
                      {opt.label}
                    </button>
                  )
                })}
              </div>
              <div className="flex flex-col sm:flex-row flex-wrap gap-4">
                <select
                  value={areaFilter}
                  onChange={(e) => setAreaFilter(e.target.value)}
                  className="h-11 px-4 rounded-xl border border-ink/20 text-ink focus:outline-none focus:ring-2 focus:ring-primary bg-white min-w-[160px]"
                >
                  <option value="">All areas</option>
                  {uniqueAreas.map((area) => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    step={5}
                    value={minPrice === '' ? '' : minPrice}
                    onChange={(e) => setMinPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="Min $"
                    className="h-11 w-24 px-3 rounded-xl border border-ink/20 text-ink placeholder-ink/50 focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                  />
                  <span className="text-ink/60">–</span>
                  <input
                    type="number"
                    min={0}
                    step={5}
                    value={maxPrice === '' ? '' : maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="Max $"
                    className="h-11 w-24 px-3 rounded-xl border border-ink/20 text-ink placeholder-ink/50 focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                  />
                </div>
                {(searchQuery || categoryFilter || areaFilter || minPrice !== '' || maxPrice !== '') && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('')
                      setCategoryFilter('')
                      setAreaFilter('')
                      setMinPrice('')
                      setMaxPrice('')
                    }}
                    className="h-11 px-4 rounded-xl border border-ink/20 text-ink hover:bg-ink/5 transition-colors text-sm font-medium"
                  >
                    Clear filters
                  </button>
                )}
              </div>
              <p className="text-sm text-ink/60">
                Showing {filteredJobs.length} of {allJobs.length} job{allJobs.length !== 1 ? 's' : ''}
              </p>
            </div>

            {filteredJobs.length === 0 ? (
              <div className="text-center py-16 text-ink/70 rounded-xl border border-ink/10 bg-white">
                <p className="text-lg font-medium">No jobs match your filters.</p>
                <p className="text-sm mt-2">Try adjusting your search or filters.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('')
                    setCategoryFilter('')
                    setAreaFilter('')
                    setMinPrice('')
                    setMaxPrice('')
                  }}
                  className="mt-4 h-10 px-6 rounded-xl bg-primary text-white font-medium hover:bg-secondary transition-colors"
                >
                  Clear filters
                </button>
              </div>
            ) : (
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
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-lg md:text-xl font-semibold text-ink">
                            {job.name}
                          </h3>
                          {job.urgentRebook && (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full">
                              Urgent rebook
                            </span>
                          )}
                        </div>
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
                    <FeeBreakdown price={job.priceAmount} gstRegistered={gstRegistered} showStripeEstimate={false} showPayoutNote className="mt-2" />
                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-3 pt-2 border-t border-ink/10 justify-end">
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
            {totalPages > 1 && filteredJobs.length > 0 ? (
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
            ) : null}
            </>
            )}
            </>
            )}
          </div>
        </section>
      </main>

      {/* Application Modal */}
      {selectedJob && selectedJobData && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleCloseModal}
          ></div>
          
          {/* Modal Card */}
          <div className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
                  className="min-w-[44px] min-h-[44px] w-10 h-10 rounded-full bg-ink/5 hover:bg-ink/10 flex items-center justify-center transition-colors"
                  aria-label="Close"
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
                <div className="mt-4 pt-4 border-t border-ink/10">
                  <FeeBreakdown price={selectedJobData.priceAmount} gstRegistered={gstRegistered} showStripeEstimate showPayoutNote variant="full" />
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
