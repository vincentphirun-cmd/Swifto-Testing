import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendPayoutToStudent } from '@/lib/email'

export const dynamic = 'force-dynamic'

/**
 * Supabase Database Webhook: when a row is inserted into transactions with type=job_payment_in,
 * call this URL (e.g. https://yourapp.vercel.app/api/webhooks/supabase/transaction)
 * with secret header: Authorization: Bearer <SUPABASE_WEBHOOK_SECRET>
 * Body from Supabase: { type: 'INSERT', table: 'transactions', record: { ... } }
 */
export async function POST(req: NextRequest) {
  try {
    const secret = process.env.SUPABASE_WEBHOOK_SECRET
    const authHeader = req.headers.get('Authorization')
    const token = authHeader?.replace(/^Bearer\s+/i, '').trim()
    if (secret && token !== secret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const record = body?.record ?? body
    const type = record?.type
    if (type !== 'job_payment_in') return NextResponse.json({ ok: true })

    const userId = record?.user_id
    const amountCents = record?.amount_cents
    const jobId = record?.job_id
    if (!userId || amountCents == null) return NextResponse.json({ ok: true })

    const admin = createAdminClient()
    const { data: authUser } = await admin.auth.admin.getUserById(userId)
    const toEmail = authUser?.user?.email
    if (!toEmail) return NextResponse.json({ ok: true })

    let jobName = 'Your job'
    if (jobId) {
      const { data: job } = await admin.from('jobs').select('job_name').eq('id', jobId).single()
      jobName = (job as { job_name?: string })?.job_name ?? jobName
    }
    const amountNzd = (Number(amountCents) / 100).toFixed(2)
    await sendPayoutToStudent(toEmail, `$${amountNzd}`, jobName)
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Payout webhook error:', e)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
