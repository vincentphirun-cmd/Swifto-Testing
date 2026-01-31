import { NextRequest, NextResponse } from 'next/server'
import { getStripeServer } from '@/lib/stripe/server'
import { createAdminClient } from '@/lib/supabase/admin'
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
    const amountCents = session.amount_total ?? parseInt(session.metadata?.amount_cents ?? '0', 10)

    if (!userId || !amountCents) {
      console.error('Webhook missing user_id or amount')
      return NextResponse.json({ error: 'Bad metadata' }, { status: 400 })
    }

    try {
      const admin = createAdminClient()
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
    } catch (e) {
      console.error('Webhook deposit processing error:', e)
      return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
