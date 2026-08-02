'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { SiteNav } from '@/components/site-nav'
import { PageHero } from '@/components/page-hero'
import { ListerIdentityForm } from '@/components/lister-identity-form'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth-context'
import { identityDocTypeLabel } from '@/lib/lister-identity'

type StatusPayload = {
  identity_status: string
  latest_submission: {
    id: string
    status: string
    legal_full_name: string
    document_type: string
    admin_notes: string | null
    created_at: string
    reviewed_at: string | null
  } | null
}

export default function ListerVerifyIdentityPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [payload, setPayload] = useState<StatusPayload | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session?.access_token) {
        setError('Please log in')
        setLoading(false)
        return
      }
      const res = await fetch('/api/lister/identity', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Could not load status')
        setLoading(false)
        return
      }
      setPayload(data)
    } catch {
      setError('Could not load status')
    }
    setLoading(false)
  }

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      router.replace('/login?redirect=/dashboard/lister/verify-identity')
      return
    }
    load()
  }, [user, authLoading, router])

  const status = payload?.identity_status ?? 'unverified'
  const showForm = status === 'unverified' || status === 'rejected'

  return (
    <>
      <SiteNav />
      <main className="bg-canvas min-h-screen">
        <PageHero
          title="Verify your identity"
          subtitle="Upload an ID so we can approve your lister account"
          centered
        />
        <section className="py-10 md:py-14">
          <div className="mx-auto max-w-lg px-4">
            <div className="swifto-card p-6 md:p-8">
              {loading || authLoading ? (
                <p className="text-ink/60">Loading…</p>
              ) : error ? (
                <p className="text-red-600">{error}</p>
              ) : status === 'verified' ? (
                <div className="space-y-4">
                  <p className="text-success font-semibold">Your identity is verified.</p>
                  <p className="text-ink/70 text-sm">
                    You can deposit funds and post jobs from your dashboard.
                  </p>
                  <Link href="/dashboard/lister" className="swifto-btn-primary inline-flex">
                    Back to dashboard
                  </Link>
                </div>
              ) : status === 'pending' ? (
                <div className="space-y-3">
                  <p className="font-semibold text-ink">Submission pending review</p>
                  <p className="text-sm text-ink/70">
                    We’ve received your {payload?.latest_submission?.document_type
                      ? identityDocTypeLabel(payload.latest_submission.document_type)
                      : 'document'}
                    . You’ll be able to deposit and post jobs once an admin approves it.
                  </p>
                  <Link href="/dashboard/lister" className="text-primary font-medium text-sm">
                    Back to dashboard
                  </Link>
                </div>
              ) : (
                <>
                  {status === 'rejected' && (
                    <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                      <p className="font-semibold">Previous submission rejected</p>
                      {payload?.latest_submission?.admin_notes && (
                        <p className="mt-1">{payload.latest_submission.admin_notes}</p>
                      )}
                      <p className="mt-2">Please correct the issue and submit again.</p>
                    </div>
                  )}
                  <p className="text-sm text-ink/70 mb-5">
                    Use a driver licence, passport, or birth certificate. Details and files are
                    stored securely and reviewed by Swifto.
                  </p>
                  {showForm && <ListerIdentityForm onSubmitted={load} />}
                </>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
