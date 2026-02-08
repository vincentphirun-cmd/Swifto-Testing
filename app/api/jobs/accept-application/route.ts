import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendApplicationAccepted, sendApplicationNotSelected } from '@/lib/email'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization')
    const token = authHeader?.replace(/^Bearer\s+/i, '').trim()
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser(token)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { jobId, applicationId } = await req.json()
    if (!jobId || !applicationId) return NextResponse.json({ error: 'jobId and applicationId required' }, { status: 400 })

    const admin = createAdminClient()
    const { data: job } = await admin.from('jobs').select('id, job_name, lister_id').eq('id', jobId).single()
    if (!job || (job as { lister_id: string }).lister_id !== user.id) {
      return NextResponse.json({ error: 'Job not found or not yours' }, { status: 404 })
    }

    const { data: applications } = await admin
      .from('job_applications')
      .select('id, student_id, status')
      .eq('job_id', jobId)

    const accepted = (applications ?? []).find((a) => a.id === applicationId)
    if (!accepted || accepted.status !== 'pending') {
      return NextResponse.json({ error: 'Application not found or not pending' }, { status: 400 })
    }

    const otherIds = (applications ?? []).filter((a) => a.id !== applicationId).map((a) => a.id)

    await admin.from('job_applications').update({ status: 'accepted' }).eq('id', applicationId)
    if (otherIds.length > 0) {
      await admin.from('job_applications').update({ status: 'not_selected' }).in('id', otherIds)
    }

    const jobName = (job as { job_name: string }).job_name

    const { data: acceptedAuth } = await admin.auth.admin.getUserById(accepted.student_id)
    if (acceptedAuth?.user?.email) {
      sendApplicationAccepted(acceptedAuth.user.email, jobName).catch((e) => console.error('Accepted email error:', e))
    }

    for (const app of (applications ?? []).filter((a) => a.id !== applicationId)) {
      const { data: notSelectedAuth } = await admin.auth.admin.getUserById(app.student_id)
      if (notSelectedAuth?.user?.email) {
        sendApplicationNotSelected(notSelectedAuth.user.email, jobName).catch((e) => console.error('Not selected email error:', e))
      }
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Accept application error:', e)
    return NextResponse.json({ error: 'Failed to accept' }, { status: 500 })
  }
}
