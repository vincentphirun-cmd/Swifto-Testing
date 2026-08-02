'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { SiteNav } from '@/components/site-nav'
import { PageHero } from '@/components/page-hero'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth-context'
import { identityDocTypeLabel } from '@/lib/lister-identity'

type Submission = {
  id: string
  user_id: string
  legal_full_name: string
  date_of_birth: string
  document_type: string
  document_number: string | null
  address_line: string | null
  document_paths: string[]
  status: string
  admin_notes: string | null
  created_at: string
  profile: { first_name: string; last_name: string } | null
}

export default function AdminIdentityPage() {
  const { user } = useAuth()
  const [token, setToken] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'pending' | 'verified' | 'rejected' | 'all'>('pending')
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [error, setError] = useState<string | null>(null)
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [actingId, setActingId] = useState<string | null>(null)

  useEffect(() => {
    async function init() {
      if (!user) {
        setIsAdmin(false)
        setLoading(false)
        return
      }
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session?.access_token) {
        setIsAdmin(false)
        setLoading(false)
        return
      }
      setToken(session.access_token)
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

  const load = async (accessToken: string, status: string) => {
    setError(null)
    try {
      const res = await fetch(`/api/admin/identity?status=${status}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to load')
        return
      }
      setSubmissions(data.submissions ?? [])
    } catch {
      setError('Failed to load submissions')
    }
  }

  useEffect(() => {
    if (!token || !isAdmin) return
    load(token, filter)
  }, [token, isAdmin, filter])

  const openDoc = async (path: string) => {
    if (!token) return
    const res = await fetch(`/api/admin/identity/document?path=${encodeURIComponent(path)}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    if (res.ok && data.url) {
      window.open(data.url, '_blank', 'noopener,noreferrer')
    } else {
      alert(data.error || 'Could not open document')
    }
  }

  const review = async (submissionId: string, action: 'approve' | 'reject') => {
    if (!token) return
    setActingId(submissionId)
    setError(null)
    try {
      const res = await fetch('/api/admin/identity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          submission_id: submissionId,
          action,
          admin_notes: notes[submissionId] || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Action failed')
      } else {
        await load(token, filter)
      }
    } catch {
      setError('Action failed')
    }
    setActingId(null)
  }

  if (loading) {
    return (
      <>
        <SiteNav />
        <main className="min-h-screen bg-canvas flex items-center justify-center">
          <p className="text-ink/60">Loading…</p>
        </main>
      </>
    )
  }

  if (!isAdmin) {
    return (
      <>
        <SiteNav />
        <main className="min-h-screen bg-canvas flex items-center justify-center">
          <p className="text-ink/70">Admin access required.</p>
        </main>
      </>
    )
  }

  return (
    <>
      <SiteNav />
      <main className="bg-canvas min-h-screen">
        <PageHero title="Lister identity review" subtitle="Approve or reject ID submissions" centered />
        <section className="py-10 md:py-14">
          <div className="mx-auto max-w-4xl px-4 space-y-6">
            <div className="flex flex-wrap gap-3 items-center justify-between">
              <div className="flex gap-2">
                {(['pending', 'verified', 'rejected', 'all'] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize ${
                      filter === f ? 'bg-primary text-white' : 'bg-white border border-ink/15 text-ink'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <div className="flex gap-3 text-sm">
                <Link href="/admin" className="text-primary hover:underline">
                  Admin home
                </Link>
                <Link href="/admin/finance" className="text-primary hover:underline">
                  Finance
                </Link>
                <Link href="/admin/messages" className="text-primary hover:underline">
                  Messages
                </Link>
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            {!submissions.length ? (
              <p className="text-ink/60">No submissions in this filter.</p>
            ) : (
              <ul className="space-y-4">
                {submissions.map((s) => (
                  <li key={s.id} className="swifto-card p-5 md:p-6 space-y-3">
                    <div className="flex flex-wrap justify-between gap-2">
                      <div>
                        <p className="font-semibold text-ink text-lg">{s.legal_full_name}</p>
                        <p className="text-sm text-ink/60">
                          Account:{' '}
                          {s.profile
                            ? `${s.profile.first_name} ${s.profile.last_name}`
                            : s.user_id.slice(0, 8)}
                        </p>
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-wide text-ink/50">
                        {s.status}
                      </span>
                    </div>
                    <dl className="grid sm:grid-cols-2 gap-2 text-sm text-ink/80">
                      <div>
                        <dt className="text-ink/50">DOB</dt>
                        <dd>{s.date_of_birth}</dd>
                      </div>
                      <div>
                        <dt className="text-ink/50">Document</dt>
                        <dd>{identityDocTypeLabel(s.document_type)}</dd>
                      </div>
                      {s.document_number && (
                        <div>
                          <dt className="text-ink/50">Number</dt>
                          <dd>{s.document_number}</dd>
                        </div>
                      )}
                      {s.address_line && (
                        <div>
                          <dt className="text-ink/50">Address</dt>
                          <dd>{s.address_line}</dd>
                        </div>
                      )}
                      <div>
                        <dt className="text-ink/50">Submitted</dt>
                        <dd>{new Date(s.created_at).toLocaleString('en-NZ')}</dd>
                      </div>
                    </dl>
                    <div className="flex flex-wrap gap-2">
                      {(s.document_paths ?? []).map((path) => (
                        <button
                          key={path}
                          type="button"
                          onClick={() => openDoc(path)}
                          className="text-sm px-3 py-1.5 rounded-lg border border-ink/15 hover:bg-canvas"
                        >
                          View file
                        </button>
                      ))}
                    </div>
                    {s.status === 'pending' && (
                      <div className="pt-2 space-y-3 border-t border-ink/10">
                        <textarea
                          value={notes[s.id] ?? ''}
                          onChange={(e) => setNotes((n) => ({ ...n, [s.id]: e.target.value }))}
                          placeholder="Notes (shown to lister if rejected)"
                          className="w-full px-3 py-2 rounded-xl border border-ink/20 text-sm min-h-[72px]"
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            disabled={actingId === s.id}
                            onClick={() => review(s.id, 'approve')}
                            className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold disabled:opacity-60"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            disabled={actingId === s.id}
                            onClick={() => review(s.id, 'reject')}
                            className="px-4 py-2 rounded-xl border border-red-300 text-red-700 text-sm font-semibold disabled:opacity-60"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    )}
                    {s.admin_notes && s.status !== 'pending' && (
                      <p className="text-sm text-ink/60">Notes: {s.admin_notes}</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
    </>
  )
}
