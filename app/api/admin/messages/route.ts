import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdminUser } from '@/lib/admin-auth'

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdminUser(req)
    if (auth instanceof NextResponse) return auth

    const { searchParams } = new URL(req.url)
    const jobId = searchParams.get('job_id')
    const conversationId = searchParams.get('conversation_id')

    const admin = createAdminClient()

    if (conversationId || jobId) {
      let query = admin
        .from('job_conversations')
        .select('id, job_id, lister_id, student_id, created_at, closed_at, archived_at, last_message_at')

      if (conversationId) query = query.eq('id', conversationId)
      else if (jobId) query = query.eq('job_id', jobId)

      const { data: conv, error: convErr } = await query.maybeSingle()
      if (convErr || !conv) {
        return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
      }

      const [{ data: messages }, { data: job }] = await Promise.all([
        admin
          .from('job_messages')
          .select('id, conversation_id, sender_id, body, created_at')
          .eq('conversation_id', conv.id)
          .order('created_at', { ascending: true }),
        admin.from('jobs').select('job_name').eq('id', conv.job_id).maybeSingle(),
      ])

      return NextResponse.json({
        conversation: conv,
        job_title: job?.job_name ?? '',
        messages: messages ?? [],
      })
    }

    const { data: conversations, error } = await admin
      .from('job_conversations')
      .select('id, job_id, lister_id, student_id, created_at, closed_at, archived_at, last_message_at')
      .order('created_at', { ascending: false })
      .limit(200)

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 })
    }

    const jobIds = Array.from(new Set((conversations ?? []).map((c) => c.job_id)))
    const { data: jobs } = jobIds.length
      ? await admin.from('jobs').select('id, job_name').in('id', jobIds)
      : { data: [] }

    const jobTitleMap: Record<string, string> = {}
    for (const j of jobs ?? []) jobTitleMap[j.id] = j.job_name

    return NextResponse.json({
      conversations: (conversations ?? []).map((c) => ({
        ...c,
        job_title: jobTitleMap[c.job_id] ?? '',
      })),
    })
  } catch (e) {
    console.error('Admin messages error:', e)
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}
