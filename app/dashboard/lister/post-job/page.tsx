'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth-context'
import { SiteNav } from '@/components/site-nav'
import { captureEvent } from '@/lib/posthog'
import { validateMinJobPrice, FEE_CONFIG } from '@/lib/fees'

const LISTING_FEE_CENTS = 99

export default function PostJobPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [balanceCents, setBalanceCents] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    jobName: '',
    category: '',
    sizeOrTime: '',
    address: '',
    area: '',
    price: '',
    completionDate: '',
    startTime: '09:00',
    isFlexible: false,
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    async function fetchBalance() {
      if (!user) return
      const supabase = createClient()
      const { data } = await supabase.from('profiles').select('balance_cents').eq('id', user.id).single()
      setBalanceCents(data?.balance_cents ?? 0)
    }
    if (user) fetchBalance()
  }, [user])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const supabase = createClient()
      if (!user) {
        setError('Please sign in to post jobs.')
        setSubmitting(false)
        return
      }

      const price = parseFloat(formData.price)
      const priceValidation = validateMinJobPrice(price)
      if (!priceValidation.ok) {
        setError(priceValidation.message || 'Please enter a valid price.')
        setSubmitting(false)
        return
      }

      const balance = balanceCents ?? 0
      if (balance < LISTING_FEE_CENTS) {
        setError(`You need at least $${FEE_CONFIG.LISTING_FEE.toFixed(2)} in your balance to list a job. Add funds from your dashboard.`)
        setSubmitting(false)
        return
      }

      const completionDate = formData.isFlexible ? null : (formData.completionDate || null)
      const startTime = completionDate
        ? new Date(`${completionDate}T${formData.startTime || '09:00'}:00`).toISOString()
        : null

      const { data: newJob, error: insertErr } = await supabase
        .from('jobs')
        .insert({
          lister_id: user.id,
          job_name: formData.jobName.trim(),
          category: formData.category,
          size_or_time: formData.sizeOrTime.trim(),
          address: formData.address.trim(),
          area: formData.area.trim(),
          price,
          completion_date: completionDate,
          start_time: startTime,
          is_flexible: formData.isFlexible,
          status: 'active',
        })
        .select('id')
        .single()

      if (insertErr) {
        setError(insertErr.message)
        setSubmitting(false)
        return
      }

      const { error: feeErr } = await supabase.rpc('deduct_listing_fee', {
        p_user_id: user.id,
        p_job_id: newJob.id,
      })

      if (feeErr) {
        await supabase.from('jobs').delete().eq('id', newJob.id)
        setError(feeErr.message.includes('Insufficient') ? 'Insufficient balance. Add at least $0.99 to your balance to list a job.' : feeErr.message)
        setSubmitting(false)
        setBalanceCents(balance)
        return
      }

      setBalanceCents((prev) => (prev ?? balance) - LISTING_FEE_CENTS)
      captureEvent('job_posted', { category: formData.category, price })
      setFormData({
        jobName: '',
        category: '',
        sizeOrTime: '',
        address: '',
        area: '',
        price: '',
        completionDate: '',
        startTime: '09:00',
        isFlexible: false,
      })
      router.push('/dashboard/lister/jobs-listed')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <SiteNav />
      <main className="min-h-screen bg-primary">
        <section className="py-16 md:py-24">
          <div className="mx-auto w-full max-w-3xl px-4 md:px-8">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                Post a Job
              </h1>
              <p className="text-white/80 text-lg">
                Fill in the details below to create a new job listing
              </p>
            </div>

            {/* Form Card */}
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-ink/15 shadow-lg p-8 md:p-10 space-y-6">
              <div className="p-4 bg-canvas/50 rounded-xl border border-ink/10 text-sm text-ink/80">
                A ${FEE_CONFIG.LISTING_FEE.toFixed(2)} listing fee will be charged when you post this job.
                {balanceCents !== null && balanceCents < LISTING_FEE_CENTS && (
                  <span className="block mt-2 text-amber-700 font-medium">
                    Your balance (${(balanceCents / 100).toFixed(2)}) is too low.{' '}
                    <Link href="/dashboard/lister" className="text-primary hover:underline">Add funds</Link> to continue.
                  </span>
                )}
              </div>
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 text-sm">
                  {error}
                </div>
              )}
              {/* Job Name */}
              <div>
                <label htmlFor="jobName" className="block text-sm font-semibold text-ink mb-2">
                  Name of Job *
                </label>
                <input
                  type="text"
                  id="jobName"
                  name="jobName"
                  value={formData.jobName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-ink/20 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-ink"
                  placeholder="e.g., Help moving furniture"
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-semibold text-ink mb-2">
                  Category of Job *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-ink/20 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-ink bg-white"
                >
                  <option value="">Select a category</option>
                  <option value="moving">Moving</option>
                  <option value="cleaning">Cleaning</option>
                  <option value="tutoring">Tutoring</option>
                  <option value="delivery">Delivery</option>
                  <option value="assembly">Assembly</option>
                  <option value="yard-work">Yard Work</option>
                  <option value="pet-care">Pet Care</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Size or Time */}
              <div>
                <label htmlFor="sizeOrTime" className="block text-sm font-semibold text-ink mb-2">
                  Size or Time of Job *
                </label>
                <input
                  type="text"
                  id="sizeOrTime"
                  name="sizeOrTime"
                  value={formData.sizeOrTime}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-ink/20 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-ink"
                  placeholder="e.g., 2-3 hours, Small apartment, 5 boxes"
                />
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-sm font-semibold text-ink mb-2">
                  Address for Job *
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-ink/20 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-ink"
                  placeholder="e.g., 123 Main Street, City, State"
                />
              </div>

              {/* Area */}
              <div>
                <label htmlFor="area" className="block text-sm font-semibold text-ink mb-2">
                  Area (for public display) *
                </label>
                <input
                  type="text"
                  id="area"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-ink/20 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-ink"
                  placeholder="e.g., Downtown, University District, etc."
                />
                <p className="mt-1 text-xs text-ink/60">This will be shown to students when they browse jobs</p>
              </div>

              {/* Price */}
              <div>
                <label htmlFor="price" className="block text-sm font-semibold text-ink mb-2">
                  Price of Job *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/60 font-medium">$</span>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min={FEE_CONFIG.MIN_JOB_PRICE}
                    step="0.01"
                    className="w-full pl-8 pr-4 py-3 rounded-xl border border-ink/20 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-ink"
                    placeholder="0.00"
                  />
                </div>
                <p className="mt-1 text-xs text-ink/60">Minimum ${FEE_CONFIG.MIN_JOB_PRICE.toFixed(2)}</p>
              </div>

              {/* Completion Date / Flexible */}
              <div>
                <label className="block text-sm font-semibold text-ink mb-3">
                  When Job Needs to be Completed *
                </label>
                
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isFlexible"
                      checked={formData.isFlexible}
                      onChange={handleChange}
                      className="w-5 h-5 rounded border-ink/20 text-primary focus:ring-2 focus:ring-primary cursor-pointer"
                    />
                    <span className="text-ink">Flexible (no specific deadline)</span>
                  </label>

                  {!formData.isFlexible && (
                    <div className="space-y-3">
                      <div>
                        <input
                          type="date"
                          id="completionDate"
                          name="completionDate"
                          value={formData.completionDate}
                          onChange={handleChange}
                          required={!formData.isFlexible}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-4 py-3 rounded-xl border border-ink/20 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-ink"
                        />
                      </div>
                      <div>
                        <label htmlFor="startTime" className="block text-sm text-ink/70 mb-1">Start time (for cancellation policy)</label>
                        <input
                          type="time"
                          id="startTime"
                          name="startTime"
                          value={formData.startTime}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-ink/20 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-ink"
                        />
                        <p className="mt-1 text-xs text-ink/60">Used for late-cancel rules</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting || (balanceCents !== null && balanceCents < LISTING_FEE_CENTS)}
                  className="w-full bg-primary text-white rounded-xl px-6 py-4 font-semibold hover:bg-secondary transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Posting…' : 'Post Job'}
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </>
  )
}
