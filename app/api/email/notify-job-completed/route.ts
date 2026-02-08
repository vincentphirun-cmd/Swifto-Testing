import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendJobCompleted } from '@/lib/email'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization')
    const token = authHeader?.replace(/^Bearer\s+/i, '').trim()
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser(token)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { jobId } = await req.json()
    if (!jobId) return NextResponse.json({ error: 'jobId required' }, { status: 400 })

    const admin = createAdminClient()
    const { data: completion } = await admin
      .from('job_completions')
      .select('id, job_id, lister_id, student_id, lister_verified_at, student_verified_at, completion_emails_sent_at')
      .eq('job_id', jobId)
      .single()

    if (!completion) return NextResponse.json({ ok: true })

    const c = completion as {
      lister_verified_at: string | null
      student_verified_at: string | null
      completion_emails_sent_at: string | null
      lister_id: string
      student_id: string
      job_id: string
    }
    if (!c.lister_verified_at || !c.student_verified_at || c.completion_emails_sent_at) {
      return NextResponse.json({ ok: true })
    }

    const { data: job } = await admin.from('jobs').select('job_name').eq('id', c.job_id).single()
    const jobName = (job as { job_name: string } | null)?.job_name ?? 'Job'

    const { data: listerAuth } = await admin.auth.admin.getUserById(c.lister_id)
    const { data: studentAuth } = await admin.auth.admin.getUserById(c.student_id)
    if (listerAuth?.user?.email) {
      sendJobCompleted(listerAuth.user.email, jobName, 'lister').catch((e) => console.error('Job completed email error:', e))
    }
    if (studentAuth?.user?.email) {
      sendJobCompleted(studentAuth.user.email, jobName, 'student').catch((e) => console.error('Job completed email error:', e))
    }

    await admin
      .from('job_completions')
      .update({ completion_emails_sent_at: new Date().toISOString() })
      .eq('id', (completion as { id: string }).id)

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Notify job completed error:', e)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}
