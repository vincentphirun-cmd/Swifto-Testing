import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendJobStartingReminder } from '@/lib/email'

export const dynamic = 'force-dynamic'

/**
 * Vercel Cron: call this daily (e.g. 8:00 AM) to send "job starting in 24h" reminders.
 * In vercel.json: "crons": [{ "path": "/api/cron/job-reminders", "schedule": "0 8 * * *" }]
 * Secure with CRON_SECRET: send Authorization: Bearer <CRON_SECRET>
 */
export async function GET(req: NextRequest) {
  try {
    const secret = process.env.CRON_SECRET
    const authHeader = req.headers.get('Authorization')
    const token = authHeader?.replace(/^Bearer\s+/i, '').trim()
    if (secret && token !== secret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const now = new Date()
    const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    const admin = createAdminClient()

    const { data: jobs } = await admin
      .from('jobs')
      .select('id, job_name, start_time, lister_id')
      .not('start_time', 'is', null)
      .gte('start_time', now.toISOString())
      .lte('start_time', in24h.toISOString())
      .eq('status', 'in_progress')

    if (!jobs?.length) return NextResponse.json({ ok: true, sent: 0 })

    let sent = 0
    for (const job of jobs) {
      const j = job as { id: string; job_name: string; start_time: string; lister_id: string }
      const startTimeStr = new Date(j.start_time).toLocaleString('en-NZ', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: 'numeric',
        minute: '2-digit',
      })
      const { data: acceptedApp } = await admin
        .from('job_applications')
        .select('student_id')
        .eq('job_id', j.id)
        .eq('status', 'accepted')
        .single()
      if (!acceptedApp) continue

      const { data: listerAuth } = await admin.auth.admin.getUserById(j.lister_id)
      const { data: studentAuth } = await admin.auth.admin.getUserById(acceptedApp.student_id)
      if (listerAuth?.user?.email) {
        await sendJobStartingReminder(listerAuth.user.email, j.job_name, startTimeStr, 'lister')
        sent++
      }
      if (studentAuth?.user?.email) {
        await sendJobStartingReminder(studentAuth.user.email, j.job_name, startTimeStr, 'student')
        sent++
      }
    }
    return NextResponse.json({ ok: true, sent })
  } catch (e) {
    console.error('Job reminders cron error:', e)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
