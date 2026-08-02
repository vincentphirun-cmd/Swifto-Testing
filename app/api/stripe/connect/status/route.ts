import { NextRequest, NextResponse } from 'next/server'
import { requireBearerUser } from '@/lib/stripe/auth'
import { syncConnectAccountToProfile } from '@/lib/stripe/connect'
import { getStripeServer } from '@/lib/stripe/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * GET /api/stripe/connect/status
 * Returns Connect onboarding / payout readiness for the current user.
 */
export async function GET(req: NextRequest) {
  try {
    const auth = await requireBearerUser(req)
    if (auth instanceof NextResponse) return auth
    const { user } = auth

    const admin = createAdminClient()
    const { data: profile } = await admin
      .from('profiles')
      .select(
        'stripe_connect_account_id, stripe_connect_details_submitted, stripe_connect_payouts_enabled, stripe_connect_charges_enabled'
      )
      .eq('id', user.id)
      .single()

    const accountId = profile?.stripe_connect_account_id as string | null
    if (!accountId) {
      return NextResponse.json({
        has_account: false,
        details_submitted: false,
        payouts_enabled: false,
        charges_enabled: false,
      })
    }

    try {
      const stripe = getStripeServer()
      const account = await stripe.accounts.retrieve(accountId)
      const flags = await syncConnectAccountToProfile(admin, user.id, account)
      return NextResponse.json({
        has_account: true,
        account_id: accountId,
        details_submitted: flags.stripe_connect_details_submitted,
        payouts_enabled: flags.stripe_connect_payouts_enabled,
        charges_enabled: flags.stripe_connect_charges_enabled,
      })
    } catch (e) {
      console.error('Connect status retrieve error:', e)
      return NextResponse.json({
        has_account: true,
        account_id: accountId,
        details_submitted: !!profile?.stripe_connect_details_submitted,
        payouts_enabled: !!profile?.stripe_connect_payouts_enabled,
        charges_enabled: !!profile?.stripe_connect_charges_enabled,
      })
    }
  } catch (e) {
    console.error('Connect status error:', e)
    return NextResponse.json({ error: 'Failed to load Connect status' }, { status: 500 })
  }
}
