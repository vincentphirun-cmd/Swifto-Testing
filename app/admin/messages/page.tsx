'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { SiteNav } from '@/components/site-nav'
import { LoadingSpinner } from '@/components/loading-spinner'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase/client'
import { formatMessageTime } from '@/lib/job-chat'

type ConversationRow = {
  id: string
  job_id: string
  job_title: string
  lister_id: string
  student_id: string
  created_at: string
  closed_at: string | null
  archived_at: string | null
  last_message_at: string | null
}

type MessageRow = {
  id: string
  sender_id: string
  body: string
  created_at: string
}

export default function AdminMessagesPage() {
  const { user } = useAuth()
  const [sessionToken, setSessionToken] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const [conversations, setConversations] = useState<ConversationRow[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [messages, setMessages] = useState<MessageRow[]>([])
  const [detailLoading, setDetailLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function init() {
      if (!user) {
        setIsAdmin(false)
        setLoading(false)
        return
      }
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        setIsAdmin(false)
        setLoading(false)
        return
      }
      setSessionToken(session.access_token)
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

  useEffect(() => {
    if (!sessionToken || !isAdmin) return
    async function load() {
      setError(null)
      const res = await fetch('/api/admin/messages', {
        headers: { Authorization: `Bearer ${sessionToken}` },
      })
      if (!res.ok) {
        setError('Failed to load conversations')
        return
      }
      const data = await res.json()
      setConversations(data.conversations ?? [])
    }
    load()
  }, [sessionToken, isAdmin])

  const loadDetail = async (conversationId: string) => {
    if (!sessionToken) return
    setSelectedId(conversationId)
    setDetailLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/messages?conversation_id=${conversationId}`, {
        headers: { Authorization: `Bearer ${sessionToken}` },
      })
      if (!res.ok) throw new Error('Failed to load messages')
      const data = await res.json()
      setMessages(data.messages ?? [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load messages')
      setMessages([])
    } finally {
      setDetailLoading(false)
    }
  }

  if (loading) {
    return (
      <>
        <SiteNav />
        <main className="min-h-screen bg-canvas flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </main>
      </>
    )
  }

  if (!isAdmin) {
    return (
      <>
        <SiteNav />
        <main className="min-h-screen bg-canvas flex items-center justify-center px-4">
          <p className="text-ink/70">Admin access required.</p>
        </main>
      </>
    )
  }

  const selected = conversations.find((c) => c.id === selectedId)

  return (
    <>
      <SiteNav />
      <main className="min-h-screen bg-canvas">
        <section className="py-12 md:py-16">
          <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
            <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-3xl font-bold text-ink">Job messages (admin)</h1>
                <p className="text-ink/70 mt-1">Read-only access to all chats, including closed and archived.</p>
              </div>
              <Link href="/admin/finance" className="text-sm text-primary hover:text-accent">
                Finance export →
              </Link>
            </div>

            {error ? (
              <p className="text-red-700 bg-red-50 border border-red-200 rounded-xl p-4 mb-6">{error}</p>
            ) : null}

            <div className="grid lg:grid-cols-5 gap-6">
              <div className="lg:col-span-2 bg-white rounded-2xl border border-ink/15 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-ink/10 font-semibold text-ink">Conversations</div>
                <div className="max-h-[520px] overflow-y-auto divide-y divide-ink/10">
                  {conversations.length === 0 ? (
                    <p className="p-4 text-sm text-ink/60">No conversations yet.</p>
                  ) : (
                    conversations.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => loadDetail(c.id)}
                        className={`w-full text-left p-4 hover:bg-canvas/50 transition-colors ${
                          selectedId === c.id ? 'bg-primary/5' : ''
                        }`}
                      >
                        <p className="font-medium text-ink truncate">{c.job_title || c.job_id}</p>
                        <p className="text-xs text-ink/60 mt-1">
                          {c.closed_at ? (c.archived_at ? 'Archived' : 'Closed') : 'Active'}
                          {c.closed_at ? ` · closed ${formatMessageTime(c.closed_at)}` : ''}
                        </p>
                      </button>
                    ))
                  )}
                </div>
              </div>

              <div className="lg:col-span-3 bg-white rounded-2xl border border-ink/15 shadow-sm min-h-[520px] flex flex-col">
                {!selectedId ? (
                  <div className="flex-1 flex items-center justify-center p-8 text-ink/60 text-sm">
                    Select a conversation to view messages.
                  </div>
                ) : detailLoading ? (
                  <div className="flex-1 flex items-center justify-center">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <>
                    <div className="p-4 border-b border-ink/10">
                      <h2 className="font-semibold text-ink">{selected?.job_title}</h2>
                      <p className="text-xs text-ink/60 mt-1 font-mono">Job {selected?.job_id}</p>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[440px]">
                      {messages.length === 0 ? (
                        <p className="text-sm text-ink/60">No messages in this conversation.</p>
                      ) : (
                        messages.map((m) => (
                          <div key={m.id} className="p-3 rounded-xl bg-canvas/50 border border-ink/10">
                            <p className="text-xs text-ink/50 mb-1">
                              {formatMessageTime(m.created_at)} · {m.sender_id.slice(0, 8)}…
                            </p>
                            <p className="text-sm text-ink whitespace-pre-wrap">{m.body}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
