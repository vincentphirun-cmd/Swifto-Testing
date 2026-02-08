import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendStudentCancelled } from '@/lib/email'

export type CancelReason =
  | 'sick_emergency'
  | 'scheduling_conflict'
  | 'unsafe_uncomfortable'
  | 'cant_reach_lister'
  | 'other'

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization')
    const token = authHeader?.replace(/^Bearer\s+/i, '').trim()
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser(token)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { application_id, reason } = body as { application_id: string; reason: CancelReason }

    const validReasons: CancelReason[] = ['sick_emergency', 'scheduling_conflict', 'unsafe_uncomfortable', 'cant_reach_lister', 'other']
    if (!application_id || !reason || !validReasons.includes(reason)) {
      return NextResponse.json({ error: 'Invalid application_id or reason' }, { status: 400 })
    }

    const admin = createAdminClient()

    const { data: app, error: appErr } = await admin
      .from('job_applications')
      .select('id, job_id, student_id, status')
      .eq('id', application_id)
      .single()

    if (appErr || !app || app.student_id !== user.id) {
      return NextResponse.json({ error: 'Application not found or not yours' }, { status: 404 })
    }
    if (app.status !== 'accepted') {
      return NextResponse.json({ error: 'Only accepted applications can be cancelled' }, { status: 400 })
    }

    const { data: job } = await admin.from('jobs').select('id, job_name, start_time, lister_id').eq('id', app.job_id).single()
    const startTime = job?.start_time ? new Date(job.start_time) : null
    const hoursBefore = startTime ? (startTime.getTime() - Date.now()) / (1000 * 60 * 60) : null

    const isSafety = ['unsafe_uncomfortable'].includes(reason)
    let penalty: 'none' | 'reliability' | 'late_fee_strike' = 'none'
    if (!isSafety && hoursBefore != null) {
      if (hoursBefore < 2) penalty = 'late_fee_strike'
      else if (hoursBefore < 24) penalty = 'reliability'
    }

    await admin.from('job_cancellations').insert({
      job_id: app.job_id,
      application_id: app.id,
      student_id: user.id,
      reason,
      hours_before_start: hoursBefore,
      penalty_applied: penalty,
    })

    await admin.from('job_applications').update({ status: 'cancelled' }).eq('id', application_id)

    const { data: otherApps } = await admin
      .from('job_applications')
      .select('id')
      .eq('job_id', app.job_id)
      .eq('status', 'not_selected')
    if (otherApps?.length) {
      await admin
        .from('job_applications')
        .update({ status: 'pending' })
        .eq('job_id', app.job_id)
        .eq('status', 'not_selected')
    }

    await admin.from('job_completions').delete().eq('job_id', app.job_id)

    const urgentUntil = new Date()
    urgentUntil.setHours(urgentUntil.getHours() + 2)
    await admin
      .from('jobs')
      .update({
        status: 'active',
        urgent_rebook_until: urgentUntil.toISOString(),
      })
      .eq('id', app.job_id)

    if (penalty === 'reliability') {
      const { data: p } = await admin.from('profiles').select('cancellation_count').eq('id', user.id).single()
      await admin.from('profiles').update({ cancellation_count: ((p?.cancellation_count as number) ?? 0) + 1 }).eq('id', user.id)
    }
    if (penalty === 'late_fee_strike') {
      const { data: p } = await admin.from('profiles').select('late_cancel_count').eq('id', user.id).single()
      await admin.from('profiles').update({ late_cancel_count: ((p?.late_cancel_count as number) ?? 0) + 1 }).eq('id', user.id)
    }

    const jobName = (job as { job_name?: string })?.job_name ?? 'Your job'
    const { data: listerAuth } = await admin.auth.admin.getUserById(job!.lister_id)
    const listerEmail = listerAuth?.user?.email
    const { data: studentProfile } = await admin.from('profiles').select('first_name, last_name').eq('id', user.id).single()
    const studentName = studentProfile ? [studentProfile.first_name, studentProfile.last_name].filter(Boolean).join(' ').trim() : null
    if (listerEmail) {
      sendStudentCancelled(listerEmail, jobName, studentName ?? 'A student').catch((e) => console.error('Cancel email error:', e))
    }
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Cancel application error:', e)
    return NextResponse.json({ error: 'Failed to cancel' }, { status: 500 })
  }
}
