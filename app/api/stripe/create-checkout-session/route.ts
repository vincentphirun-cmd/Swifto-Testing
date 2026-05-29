import { NextRequest, NextResponse } from 'next/server'
import { getAppOrigin } from '@/lib/app-url'
import { getStripeServer } from '@/lib/stripe/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization')
    const token = authHeader?.replace(/^Bearer\s+/i, '').trim()
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const amountCents = typeof body?.amount_cents === 'number' ? Math.round(body.amount_cents) : Math.round(Number(body?.amount ?? 0) * 100)
    if (!Number.isFinite(amountCents) || amountCents < 100) {
      return NextResponse.json({ error: 'Amount must be at least $1' }, { status: 400 })
    }

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser(token)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const stripe = getStripeServer()
    const origin = getAppOrigin(req)
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'nzd',
            product_data: {
              name: 'Add funds to Swifto balance',
              description: 'Deposit for job listings',
            },
            unit_amount: amountCents,
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/dashboard/lister?deposit=success`,
      cancel_url: `${origin}/dashboard/lister?deposit=cancelled`,
      metadata: { user_id: user.id, amount_cents: String(amountCents) },
    })

    return NextResponse.json({ url: session.url })
  } catch (e) {
    console.error('Create checkout session error:', e)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
