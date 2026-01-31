import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * POST /api/stripe/request-withdrawal
 * Creates a withdrawal request (records transaction).
 * Actual payout requires Stripe Connect - this records the intent.
 */
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization')
    const token = authHeader?.replace(/^Bearer\s+/i, '').trim()
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { amount } = await req.json()
    const amountCents = Math.round(Number(amount) * 100)
    if (!amountCents || amountCents < 100) {
      return NextResponse.json({ error: 'Amount must be at least $1' }, { status: 400 })
    }

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser(token)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const admin = createAdminClient()
    const { data: profile } = await admin.from('profiles').select('balance_cents').eq('id', user.id).single()
    const balance = (profile?.balance_cents ?? 0) as number

    if (balance < amountCents) {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 })
    }

    await admin.from('profiles').update({ balance_cents: balance - amountCents }).eq('id', user.id)
    await admin.from('transactions').insert({
      user_id: user.id,
      amount_cents: -amountCents,
      type: 'withdrawal',
      status: 'pending',
      metadata: { note: 'Payout pending - Stripe Connect required for actual transfer' },
    })

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Withdrawal request error:', e)
    return NextResponse.json({ error: 'Failed to process withdrawal' }, { status: 500 })
  }
}
