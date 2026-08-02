import { NextRequest, NextResponse } from 'next/server'
import { sendRefundCompleted } from '@/lib/email'
import { requireBearerUser } from '@/lib/stripe/auth'
import { getStripeServer } from '@/lib/stripe/server'
import { createAdminClient } from '@/lib/supabase/admin'

type DepositRow = {
  id: string
  amount_cents: number
  stripe_payment_intent_id: string | null
  created_at: string
}

/**
 * POST /api/stripe/request-refund
 * Refunds unused lister wallet balance to the original card(s), FIFO by deposit.
 */
export async function POST(req: NextRequest) {
  let debitedCents = 0
  let userId: string | null = null
  const admin = createAdminClient()
  const refundTxIds: string[] = []

  try {
    const auth = await requireBearerUser(req)
    if (auth instanceof NextResponse) return auth
    const { user } = auth
    userId = user.id

    const body = await req.json().catch(() => ({}))
    const amountCents =
      typeof body?.amount_cents === 'number'
        ? Math.round(body.amount_cents)
        : Math.round(Number(body?.amount ?? 0) * 100)

    if (!Number.isFinite(amountCents) || amountCents < 100) {
      return NextResponse.json({ error: 'Amount must be at least $1' }, { status: 400 })
    }

    const { data: profile } = await admin
      .from('profiles')
      .select('balance_cents')
      .eq('id', user.id)
      .single()

    const balance = (profile?.balance_cents ?? 0) as number
    if (balance < amountCents) {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 })
    }

    const { data: deposits } = await admin
      .from('transactions')
      .select('id, amount_cents, stripe_payment_intent_id, created_at')
      .eq('user_id', user.id)
      .eq('type', 'deposit')
      .eq('status', 'succeeded')
      .not('stripe_payment_intent_id', 'is', null)
      .order('created_at', { ascending: true })

    const depositRows = (deposits ?? []) as DepositRow[]
    if (!depositRows.length) {
      return NextResponse.json(
        { error: 'No refundable card deposits found for this balance' },
        { status: 400 }
      )
    }

    const piIds = depositRows
      .map((d) => d.stripe_payment_intent_id)
      .filter((id): id is string => !!id)

    const { data: priorRefunds } = await admin
      .from('transactions')
      .select('amount_cents, stripe_payment_intent_id, status')
      .eq('user_id', user.id)
      .eq('type', 'refund')
      .in('status', ['succeeded', 'pending'])
      .in('stripe_payment_intent_id', piIds)

    const refundedByPi: Record<string, number> = {}
    for (const r of priorRefunds ?? []) {
      const pi = r.stripe_payment_intent_id as string
      // refund rows store negative amount_cents
      refundedByPi[pi] = (refundedByPi[pi] ?? 0) + Math.abs(Number(r.amount_cents ?? 0))
    }

    type Chunk = { paymentIntentId: string; amountCents: number; depositId: string }
    const chunks: Chunk[] = []
    let remaining = amountCents

    for (const deposit of depositRows) {
      if (remaining <= 0) break
      const pi = deposit.stripe_payment_intent_id
      if (!pi) continue
      const already = refundedByPi[pi] ?? 0
      const available = Math.max(0, Number(deposit.amount_cents) - already)
      if (available <= 0) continue
      const take = Math.min(available, remaining)
      chunks.push({ paymentIntentId: pi, amountCents: take, depositId: deposit.id })
      remaining -= take
    }

    if (remaining > 0) {
      return NextResponse.json(
        {
          error:
            'Not enough refundable card deposits left. Balance may include non-refundable adjustments.',
        },
        { status: 400 }
      )
    }

    const { error: debitError } = await admin.rpc('debit_profile_balance', {
      p_user_id: user.id,
      p_amount_cents: amountCents,
    })
    if (debitError) {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 })
    }
    debitedCents = amountCents

    const stripe = getStripeServer()
    const stripeRefundIds: string[] = []

    for (const chunk of chunks) {
      const { data: pendingTx, error: insertErr } = await admin
        .from('transactions')
        .insert({
          user_id: user.id,
          amount_cents: -chunk.amountCents,
          type: 'refund',
          status: 'pending',
          stripe_payment_intent_id: chunk.paymentIntentId,
          metadata: { deposit_transaction_id: chunk.depositId },
        })
        .select('id')
        .single()

      if (insertErr || !pendingTx?.id) {
        throw new Error(insertErr?.message || 'Failed to record refund')
      }
      refundTxIds.push(pendingTx.id)

      const refund = await stripe.refunds.create(
        {
          payment_intent: chunk.paymentIntentId,
          amount: chunk.amountCents,
          reason: 'requested_by_customer',
          metadata: {
            user_id: user.id,
            transaction_id: pendingTx.id,
            deposit_transaction_id: chunk.depositId,
          },
        },
        { idempotencyKey: `refund_${pendingTx.id}` }
      )

      stripeRefundIds.push(refund.id)
      await admin
        .from('transactions')
        .update({
          status: 'succeeded',
          metadata: {
            deposit_transaction_id: chunk.depositId,
            stripe_refund_id: refund.id,
          },
        })
        .eq('id', pendingTx.id)
    }

    const amountNzd = (amountCents / 100).toFixed(2)
    if (user.email) {
      sendRefundCompleted(user.email, `$${amountNzd}`).catch((e) =>
        console.error('Refund email error:', e)
      )
    }

    return NextResponse.json({
      ok: true,
      refunded_cents: amountCents,
      stripe_refund_ids: stripeRefundIds,
    })
  } catch (e) {
    console.error('Refund request error:', e)
    if (userId && debitedCents > 0) {
      try {
        await admin.rpc('credit_profile_balance', {
          p_user_id: userId,
          p_amount_cents: debitedCents,
        })
      } catch (rollbackErr) {
        console.error('Refund balance rollback error:', rollbackErr)
      }
    }
    if (refundTxIds.length) {
      await admin
        .from('transactions')
        .update({
          status: 'failed',
          metadata: { error: e instanceof Error ? e.message : 'refund_failed' },
        })
        .in('id', refundTxIds)
        .eq('status', 'pending')
    }
    return NextResponse.json({ error: 'Failed to process refund' }, { status: 500 })
  }
}
