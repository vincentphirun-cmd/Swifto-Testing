import { NextRequest, NextResponse } from 'next/server'
import { getStripeServer } from '@/lib/stripe/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendDepositSuccess } from '@/lib/email'
import { syncConnectAccountByStripeId } from '@/lib/stripe/connect'
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

  const admin = createAdminClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.user_id
        const metaCents =
          session.metadata?.amount_cents != null
            ? parseInt(String(session.metadata.amount_cents), 10)
            : NaN
        const amountCents =
          Number.isFinite(metaCents) && metaCents > 0 ? metaCents : (session.amount_total ?? 0)
        console.log(
          '[webhook] checkout.session.completed session_id:',
          session.id,
          '→ amountCents:',
          amountCents,
          'userId:',
          userId
        )

        if (!userId || !amountCents) {
          console.error('Webhook missing user_id or amount')
          return NextResponse.json({ error: 'Bad metadata' }, { status: 400 })
        }

        const { data: existing } = await admin
          .from('transactions')
          .select('id')
          .eq('type', 'deposit')
          .contains('metadata', { session_id: session.id })
          .maybeSingle()
        if (existing) {
          console.log('[webhook] deposit already processed for session_id:', session.id)
          break
        }

        const { data: profile } = await admin
          .from('profiles')
          .select('balance_cents')
          .eq('id', userId)
          .single()
        const currentBalance = (profile?.balance_cents ?? 0) as number
        await admin
          .from('profiles')
          .update({ balance_cents: currentBalance + amountCents })
          .eq('id', userId)

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
          sendDepositSuccess(authUser.user.email, `$${amountNzd}`).catch((e) =>
            console.error('Deposit email error:', e)
          )
        }
        break
      }

      case 'account.updated': {
        const account = event.data.object as Stripe.Account
        const synced = await syncConnectAccountByStripeId(admin, account.id)
        console.log(
          '[webhook] account.updated',
          account.id,
          synced ? `user ${synced.userId}` : 'no matching profile'
        )
        break
      }

      case 'transfer.created':
      case 'transfer.updated': {
        const transfer = event.data.object as Stripe.Transfer
        const txId = transfer.metadata?.transaction_id
        if (txId) {
          await admin
            .from('transactions')
            .update({
              status: 'succeeded',
              stripe_transfer_id: transfer.id,
              stripe_payout_id: transfer.id,
            })
            .eq('id', txId)
            .eq('type', 'withdrawal')
        }
        break
      }

      case 'transfer.reversed': {
        const transfer = event.data.object as Stripe.Transfer
        const txId = transfer.metadata?.transaction_id
        const userId = transfer.metadata?.user_id
        const amount = transfer.amount ?? 0

        if (txId) {
          const { data: tx } = await admin
            .from('transactions')
            .select('id, status, amount_cents, user_id')
            .eq('id', txId)
            .eq('type', 'withdrawal')
            .maybeSingle()

          if (tx && tx.status !== 'failed') {
            await admin
              .from('transactions')
              .update({
                status: 'failed',
                metadata: { transfer_id: transfer.id, reversed: true },
              })
              .eq('id', tx.id)

            const creditUser = (userId || tx.user_id) as string
            const creditCents = Math.abs(Number(tx.amount_cents) || amount)
            if (creditUser && creditCents > 0) {
              await admin.rpc('credit_profile_balance', {
                p_user_id: creditUser,
                p_amount_cents: creditCents,
              })
            }
          }
        }
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        const paymentIntentId =
          typeof charge.payment_intent === 'string'
            ? charge.payment_intent
            : charge.payment_intent?.id
        console.log(
          '[webhook] charge.refunded',
          charge.id,
          'pi:',
          paymentIntentId,
          'amount_refunded:',
          charge.amount_refunded
        )
        // Refunds are recorded in request-refund; this is an audit log hook.
        break
      }

      default:
        console.log('[webhook] unhandled event:', event.type)
    }
  } catch (e) {
    console.error('Webhook processing error:', e)
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
