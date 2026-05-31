import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendListingFeeCharged } from '@/lib/email'
import { FEE_CONFIG } from '@/lib/fees'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization')
    const token = authHeader?.replace(/^Bearer\s+/i, '').trim()
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser(token)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { jobId, jobName } = await req.json()
    if (!jobId || !jobName) return NextResponse.json({ error: 'jobId and jobName required' }, { status: 400 })

    const admin = createAdminClient()
    const { data: job } = await admin
      .from('jobs')
      .select('id, lister_id')
      .eq('id', jobId)
      .single()
    if (!job || (job as { lister_id: string }).lister_id !== user.id) {
      return NextResponse.json({ error: 'Job not found or not yours' }, { status: 404 })
    }

    const amountNzd = `$${FEE_CONFIG.LISTING_FEE_TOTAL.toFixed(2)} ($${FEE_CONFIG.LISTING_FEE_EX_GST.toFixed(2)} + GST)`
    if (user.email) {
      await sendListingFeeCharged(user.email, String(jobName), amountNzd)
    }
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Notify listing fee error:', e)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}
