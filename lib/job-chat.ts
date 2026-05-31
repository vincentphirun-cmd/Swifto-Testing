import { createClient } from '@/lib/supabase/client'

export type JobConversation = {
  id: string
  job_id: string
  lister_id: string
  student_id: string
  created_at: string
  closed_at: string | null
  archived_at: string | null
  last_message_at: string | null
}

export type JobMessage = {
  id: string
  conversation_id: string
  sender_id: string
  body: string
  created_at: string
}

export type JobMessageWithSender = JobMessage & {
  senderName: string
}

/** Job IDs with an open (non-closed) conversation for the current user. */
export async function fetchOpenChatJobIds(userId: string): Promise<Set<string>> {
  const supabase = createClient()
  const { data } = await supabase
    .from('job_conversations')
    .select('job_id')
    .is('closed_at', null)
    .or(`lister_id.eq.${userId},student_id.eq.${userId}`)

  return new Set((data ?? []).map((r) => r.job_id as string))
}

/** Active conversation for a job (participant only; RLS enforces access). */
export async function fetchActiveConversationForJob(
  jobId: string
): Promise<JobConversation | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('job_conversations')
    .select('*')
    .eq('job_id', jobId)
    .is('closed_at', null)
    .maybeSingle()

  if (error || !data) return null
  return data as JobConversation
}

export async function fetchMessagesForConversation(
  conversationId: string
): Promise<JobMessage[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('job_messages')
    .select('id, conversation_id, sender_id, body, created_at')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  if (error) return []
  return (data ?? []) as JobMessage[]
}

export async function sendJobMessage(
  conversationId: string,
  body: string
): Promise<{ ok: true; message: JobMessage } | { ok: false; error: string }> {
  const trimmed = body.trim()
  if (!trimmed) return { ok: false, error: 'Message cannot be empty.' }
  if (trimmed.length > 4000) return { ok: false, error: 'Message is too long (max 4000 characters).' }

  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not signed in.' }

  const { data, error } = await supabase
    .from('job_messages')
    .insert({
      conversation_id: conversationId,
      sender_id: user.id,
      body: trimmed,
    })
    .select('id, conversation_id, sender_id, body, created_at')
    .single()

  if (error) return { ok: false, error: error.message }
  return { ok: true, message: data as JobMessage }
}

export function formatMessageTime(iso: string): string {
  return new Date(iso).toLocaleString('en-NZ', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  })
}
