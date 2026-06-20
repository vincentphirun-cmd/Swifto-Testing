'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { SiteNav } from '@/components/site-nav'
import { HeroBand } from '@/components/hero-band'
import { PageHero } from '@/components/page-hero'
import { LoadingSpinner } from '@/components/loading-spinner'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase/client'
import {
  fetchActiveConversationForJob,
  fetchMessagesForConversation,
  formatMessageTime,
  sendJobMessage,
  type JobConversation,
  type JobMessage,
} from '@/lib/job-chat'

export default function JobChatPage() {
  const params = useParams()
  const jobId = typeof params.jobId === 'string' ? params.jobId : ''
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [conversation, setConversation] = useState<JobConversation | null>(null)
  const [messages, setMessages] = useState<JobMessage[]>([])
  const [jobTitle, setJobTitle] = useState('')
  const [counterpartyName, setCounterpartyName] = useState('')
  const [loading, setLoading] = useState(true)
  const [unavailable, setUnavailable] = useState(false)
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const loadChat = useCallback(async () => {
    if (!user || !jobId) return
    setLoading(true)
    setError(null)
    setUnavailable(false)

    const conv = await fetchActiveConversationForJob(jobId)
    if (!conv) {
      setUnavailable(true)
      setLoading(false)
      return
    }

    const isParticipant = conv.lister_id === user.id || conv.student_id === user.id
    if (!isParticipant) {
      setUnavailable(true)
      setLoading(false)
      return
    }

    setConversation(conv)

    const supabase = createClient()
    const counterpartyId = conv.lister_id === user.id ? conv.student_id : conv.lister_id

    const [{ data: job }, { data: profile }, msgs] = await Promise.all([
      supabase.from('jobs').select('job_name').eq('id', jobId).maybeSingle(),
      supabase.from('profiles').select('first_name, last_name').eq('id', counterpartyId).maybeSingle(),
      fetchMessagesForConversation(conv.id),
    ])

    setJobTitle(job?.job_name ?? 'Job')
    const name = profile
      ? [profile.first_name, profile.last_name].filter(Boolean).join(' ').trim()
      : 'Chat partner'
    setCounterpartyName(name || 'Chat partner')
    setMessages(msgs)
    setLoading(false)
  }, [user, jobId])

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      router.replace(`/login?redirect=/messages/${jobId}`)
      return
    }
    loadChat()
  }, [authLoading, user, jobId, router, loadChat])

  useEffect(() => {
    if (!conversation?.id) return

    const supabase = createClient()
    const channel = supabase
      .channel(`job_messages:${conversation.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'job_messages',
          filter: `conversation_id=eq.${conversation.id}`,
        },
        (payload) => {
          const row = payload.new as JobMessage
          setMessages((prev) => {
            if (prev.some((m) => m.id === row.id)) return prev
            return [...prev, row]
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversation?.id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!conversation || sending) return
    setSending(true)
    setError(null)
    const result = await sendJobMessage(conversation.id, draft)
    setSending(false)
    if (!result.ok) {
      setError(result.error)
      return
    }
    setDraft('')
    setMessages((prev) => {
      if (prev.some((m) => m.id === result.message.id)) return prev
      return [...prev, result.message]
    })
  }

  if (authLoading || loading) {
    return (
      <>
        <SiteNav />
        <main className="min-h-screen bg-canvas flex flex-col items-center justify-center gap-4">
          <LoadingSpinner size="lg" variant="default" />
          <p className="text-ink-muted">Loading chat…</p>
        </main>
      </>
    )
  }

  if (unavailable || !conversation) {
    return (
      <>
        <SiteNav />
        <main className="min-h-screen bg-canvas">
          <PageHero title="Chat unavailable" subtitle="Messaging is only available while a job is in progress, before payment is released." centered />
          <div className="py-10 text-center">
            <Link href="/dashboard/student" className="swifto-btn-primary h-12 px-6">
              Back to dashboard
            </Link>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <SiteNav />
      <main className="min-h-screen bg-canvas flex flex-col">
        <HeroBand compact>
          <div className="mx-auto w-full max-w-3xl px-4 md:px-8">
            <Link
              href={conversation.lister_id === user?.id ? '/dashboard/lister/jobs-listed' : '/dashboard/student/jobs-applied'}
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-3 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold">{jobTitle}</h1>
            <p className="text-white/85 mt-1">Chat with {counterpartyName}</p>
          </div>
        </HeroBand>

        <div className="flex-1 mx-auto w-full max-w-3xl px-4 md:px-8 py-6 flex flex-col min-h-0">
          <div className="flex-1 bg-white rounded-2xl border border-ink/15 shadow-lg flex flex-col min-h-[420px] max-h-[calc(100vh-280px)]">
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
              {messages.length === 0 ? (
                <p className="text-sm text-ink/60 text-center py-8">
                  No messages yet. Say hello and coordinate the job details.
                </p>
              ) : (
                messages.map((msg) => {
                  const isMine = msg.sender_id === user?.id
                  return (
                    <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                          isMine
                            ? 'bg-primary text-white rounded-br-md'
                            : 'bg-canvas text-ink rounded-bl-md border border-ink/10'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">{msg.body}</p>
                        <p className={`text-[10px] mt-1 ${isMine ? 'text-white/70' : 'text-ink/50'}`}>
                          {formatMessageTime(msg.created_at)}
                        </p>
                      </div>
                    </div>
                  )
                })
              )}
              <div ref={bottomRef} />
            </div>

            <form onSubmit={handleSend} className="border-t border-ink/10 p-4 flex gap-2">
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Type a message…"
                maxLength={4000}
                className="flex-1 h-11 px-4 rounded-xl border border-ink/20 text-ink placeholder-ink/50 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                disabled={sending || !draft.trim()}
                className="h-11 px-5 rounded-xl bg-primary text-white font-medium hover:bg-secondary transition-colors disabled:opacity-60"
              >
                {sending ? '…' : 'Send'}
              </button>
            </form>
            {error ? <p className="px-4 pb-3 text-sm text-red-600">{error}</p> : null}
          </div>
          <p className="text-xs text-ink-muted mt-3 text-center">
            Messages are saved while the job is active. Chat closes when payment is released.
          </p>
        </div>
      </main>
    </>
  )
}
