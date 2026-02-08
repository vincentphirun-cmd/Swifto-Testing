import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendNewJobToStudents } from '@/lib/email'

export const dynamic = 'force-dynamic'

const MAX_STUDENTS = 200

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
    const { data: job, error: jobErr } = await admin
      .from('jobs')
      .select('id, job_name, category, area, price, lister_id')
      .eq('id', jobId)
      .single()

    if (jobErr || !job || (job as { lister_id: string }).lister_id !== user.id) {
      return NextResponse.json({ error: 'Job not found or not yours' }, { status: 404 })
    }

    const { data: studentProfiles } = await admin
      .from('profiles')
      .select('id')
      .eq('role', 'student')
      .limit(MAX_STUDENTS)

    const ids = (studentProfiles ?? []).map((p) => p.id)
    const emails: string[] = []
    for (const id of ids) {
      const { data: authUser } = await admin.auth.admin.getUserById(id)
      if (authUser?.user?.email) emails.push(authUser.user.email)
    }

    const jobName = (job as { job_name: string }).job_name
    const category = (job as { category: string }).category ?? ''
    const area = (job as { area: string }).area ?? ''
    const price = `$${Number((job as { price: number }).price).toFixed(2)}`
    await sendNewJobToStudents(emails, jobName, category, area, price)
    return NextResponse.json({ ok: true, sent: emails.length })
  } catch (e) {
    console.error('Notify new job error:', e)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}
