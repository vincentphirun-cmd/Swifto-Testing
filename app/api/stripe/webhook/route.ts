import { NextRequest, NextResponse } from 'next/server'
import { getStripeServer } from '@/lib/stripe/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendDepositSuccess } from '@/lib/email'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!sig || !webhookSecret) {
    console.error('Webhook missing signature or secret')
    return NextResponse.json({ error: 'Webhook config error' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    const stripe = getStripeServer()
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (e: any) {
    console.error('Webhook signature verification failed:', e?.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const userId = session.metadata?.user_id
    // Prefer our metadata.amount_cents (set at checkout) so we credit exactly what we charged
    const metaCents = session.metadata?.amount_cents != null ? parseInt(String(session.metadata.amount_cents), 10) : NaN
    const amountCents = Number.isFinite(metaCents) && metaCents > 0
      ? metaCents
      : (session.amount_total ?? 0)
    console.log('[webhook] checkout.session.completed session_id:', session.id, 'metadata.amount_cents:', session.metadata?.amount_cents, '→ amountCents:', amountCents, 'userId:', userId)

    if (!userId || !amountCents) {
      console.error('Webhook missing user_id or amount')
      return NextResponse.json({ error: 'Bad metadata' }, { status: 400 })
    }

    try {
      const admin = createAdminClient()
      // Idempotency: don't credit the same checkout session twice
      const { data: existing } = await admin
        .from('transactions')
        .select('id')
        .eq('type', 'deposit')
        .contains('metadata', { session_id: session.id })
        .maybeSingle()
      if (existing) {
        console.log('[webhook] deposit already processed for session_id:', session.id)
        return NextResponse.json({ received: true })
      }

      const { data: profile } = await admin.from('profiles').select('balance_cents').eq('id', userId).single()
      const currentBalance = (profile?.balance_cents ?? 0) as number
      const newBalance = currentBalance + amountCents

      await admin.from('profiles').update({ balance_cents: newBalance }).eq('id', userId)

      await admin.from('transactions').insert({
        user_id: userId,
        amount_cents: amountCents,
        type: 'deposit',
        status: 'succeeded',
        stripe_payment_intent_id: session.payment_intent as string | null,
        metadata: { session_id: session.id },
      })
      const amountNzd = (amountCents / 100).toFixed(2)
      const { data: authUser } = await admin.auth.admin.getUserById(userId)
      if (authUser?.user?.email) {
        sendDepositSuccess(authUser.user.email, `$${amountNzd}`).catch((e) => console.error('Deposit email error:', e))
      }
    } catch (e) {
      console.error('Webhook deposit processing error:', e)
      return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
