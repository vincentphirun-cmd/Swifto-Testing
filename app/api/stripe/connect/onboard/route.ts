import { NextRequest, NextResponse } from 'next/server'
import { getAppOrigin } from '@/lib/app-url'
import { requireBearerUser } from '@/lib/stripe/auth'
import { syncConnectAccountToProfile } from '@/lib/stripe/connect'
import { getStripeServer } from '@/lib/stripe/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * POST /api/stripe/connect/onboard
 * Creates (or reuses) an Express Connect account and returns an Account Link URL.
 */
export async function POST(req: NextRequest) {
  try {
    const auth = await requireBearerUser(req)
    if (auth instanceof NextResponse) return auth
    const { user } = auth

    const admin = createAdminClient()
    const { data: profile, error: profileError } = await admin
      .from('profiles')
      .select(
        'stripe_connect_account_id, stripe_connect_details_submitted, stripe_connect_payouts_enabled'
      )
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Connect onboard profile error:', profileError)
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const stripe = getStripeServer()
    let accountId = profile?.stripe_connect_account_id as string | null

    if (!accountId) {
      const account = await stripe.accounts.create({
        type: 'express',
        country: 'NZ',
        email: user.email ?? undefined,
        capabilities: {
          transfers: { requested: true },
        },
        business_type: 'individual',
        metadata: { user_id: user.id },
      })
      accountId = account.id
      await syncConnectAccountToProfile(admin, user.id, account)
    } else {
      const account = await stripe.accounts.retrieve(accountId)
      await syncConnectAccountToProfile(admin, user.id, account)
      if (account.payouts_enabled && account.details_submitted) {
        return NextResponse.json({
          url: null,
          already_complete: true,
          payouts_enabled: true,
        })
      }
    }

    const origin = getAppOrigin(req)
    const link = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${origin}/dashboard/student?connect=refresh`,
      return_url: `${origin}/dashboard/student?connect=return`,
      type: 'account_onboarding',
    })

    return NextResponse.json({ url: link.url, already_complete: false })
  } catch (e) {
    console.error('Connect onboard error:', e)
    return NextResponse.json({ error: 'Failed to start bank onboarding' }, { status: 500 })
  }
}
