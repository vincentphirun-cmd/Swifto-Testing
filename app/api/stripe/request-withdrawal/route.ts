import { NextRequest, NextResponse } from 'next/server'
import { sendWithdrawalCompleted } from '@/lib/email'
import { requireBearerUser } from '@/lib/stripe/auth'
import { getStripeServer } from '@/lib/stripe/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * POST /api/stripe/request-withdrawal
 * Debits student balance and Transfers NZD to their Connect Express account.
 */
export async function POST(req: NextRequest) {
  let debitedCents = 0
  let userId: string | null = null
  let transactionId: string | null = null
  const admin = createAdminClient()

  try {
    const auth = await requireBearerUser(req)
    if (auth instanceof NextResponse) return auth
    const { user } = auth
    userId = user.id

    const { amount } = await req.json()
    const amountCents = Math.round(Number(amount) * 100)
    if (!amountCents || amountCents < 100) {
      return NextResponse.json({ error: 'Amount must be at least $1' }, { status: 400 })
    }

    const { data: profile } = await admin
      .from('profiles')
      .select(
        'balance_cents, stripe_connect_account_id, stripe_connect_payouts_enabled'
      )
      .eq('id', user.id)
      .single()

    if (!profile?.stripe_connect_account_id) {
      return NextResponse.json(
        { error: 'Connect your bank account before withdrawing', code: 'connect_required' },
        { status: 400 }
      )
    }
    if (!profile.stripe_connect_payouts_enabled) {
      return NextResponse.json(
        {
          error: 'Finish bank account setup before withdrawing',
          code: 'connect_incomplete',
        },
        { status: 400 }
      )
    }

    const balance = (profile.balance_cents ?? 0) as number
    if (balance < amountCents) {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 })
    }

    const { error: debitError } = await admin.rpc('debit_profile_balance', {
      p_user_id: user.id,
      p_amount_cents: amountCents,
    })
    if (debitError) {
      console.error('Withdrawal debit error:', debitError)
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 })
    }
    debitedCents = amountCents

    const { data: tx, error: txError } = await admin
      .from('transactions')
      .insert({
        user_id: user.id,
        amount_cents: -amountCents,
        type: 'withdrawal',
        status: 'pending',
        metadata: { destination: profile.stripe_connect_account_id },
      })
      .select('id')
      .single()

    if (txError || !tx?.id) {
      console.error('Withdrawal tx insert error:', txError)
      await admin.rpc('credit_profile_balance', {
        p_user_id: user.id,
        p_amount_cents: amountCents,
      })
      debitedCents = 0
      return NextResponse.json({ error: 'Failed to record withdrawal' }, { status: 500 })
    }
    transactionId = tx.id

    const stripe = getStripeServer()
    const transfer = await stripe.transfers.create(
      {
        amount: amountCents,
        currency: 'nzd',
        destination: profile.stripe_connect_account_id,
        metadata: {
          user_id: user.id,
          transaction_id: tx.id,
        },
      },
      { idempotencyKey: `withdrawal_${tx.id}` }
    )

    await admin
      .from('transactions')
      .update({
        status: 'succeeded',
        stripe_transfer_id: transfer.id,
        stripe_payout_id: transfer.id,
        metadata: {
          destination: profile.stripe_connect_account_id,
          transfer_id: transfer.id,
        },
      })
      .eq('id', tx.id)

    const amountNzd = (amountCents / 100).toFixed(2)
    if (user.email) {
      sendWithdrawalCompleted(user.email, `$${amountNzd}`).catch((e) =>
        console.error('Withdrawal completed email error:', e)
      )
    }

    return NextResponse.json({ ok: true, transfer_id: transfer.id })
  } catch (e) {
    console.error('Withdrawal request error:', e)
    if (userId && debitedCents > 0) {
      try {
        await admin.rpc('credit_profile_balance', {
          p_user_id: userId,
          p_amount_cents: debitedCents,
        })
        if (transactionId) {
          await admin
            .from('transactions')
            .update({
              status: 'failed',
              metadata: { error: e instanceof Error ? e.message : 'transfer_failed' },
            })
            .eq('id', transactionId)
        }
      } catch (rollbackErr) {
        console.error('Withdrawal rollback error:', rollbackErr)
      }
    }
    return NextResponse.json({ error: 'Failed to process withdrawal' }, { status: 500 })
  }
}
