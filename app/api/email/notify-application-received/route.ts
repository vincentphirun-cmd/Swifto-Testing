import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendApplicationReceived } from '@/lib/email'

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
    if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 })

    const { data: app } = await admin
      .from('job_applications')
      .select('id, application_name, student_id')
      .eq('id', applicationId)
      .eq('job_id', jobId)
      .eq('student_id', user.id)
      .single()

    if (!app) return NextResponse.json({ error: 'Application not found' }, { status: 404 })

    const { data: listerAuth } = await admin.auth.admin.getUserById((job as { lister_id: string }).lister_id)
    const listerEmail = listerAuth?.user?.email
    if (!listerEmail) return NextResponse.json({ ok: true })

    const applicantName = (app as { application_name?: string }).application_name ?? null
    const jobName = (job as { job_name: string }).job_name
    await sendApplicationReceived(listerEmail, jobName, applicantName ?? 'A student')
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Notify application received error:', e)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}
