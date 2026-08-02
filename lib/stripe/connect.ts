import type { SupabaseClient } from '@supabase/supabase-js'
import type Stripe from 'stripe'
import { getStripeServer } from '@/lib/stripe/server'

export type ConnectProfileFields = {
  stripe_connect_account_id: string | null
  stripe_connect_details_submitted: boolean | null
  stripe_connect_payouts_enabled: boolean | null
  stripe_connect_charges_enabled: boolean | null
}

export function connectFlagsFromAccount(account: Stripe.Account) {
  return {
    stripe_connect_details_submitted: !!account.details_submitted,
    stripe_connect_payouts_enabled: !!account.payouts_enabled,
    stripe_connect_charges_enabled: !!account.charges_enabled,
  }
}

/** Persist latest Connect flags from a Stripe Account object. */
export async function syncConnectAccountToProfile(
  admin: SupabaseClient,
  userId: string,
  account: Stripe.Account
) {
  const flags = connectFlagsFromAccount(account)
  await admin
    .from('profiles')
    .update({
      stripe_connect_account_id: account.id,
      ...flags,
    })
    .eq('id', userId)
  return flags
}

export async function syncConnectAccountByStripeId(
  admin: SupabaseClient,
  accountId: string
) {
  const stripe = getStripeServer()
  const account = await stripe.accounts.retrieve(accountId)
  const { data: profile } = await admin
    .from('profiles')
    .select('id')
    .eq('stripe_connect_account_id', accountId)
    .maybeSingle()
  if (!profile?.id) return null
  const flags = await syncConnectAccountToProfile(admin, profile.id, account)
  return { userId: profile.id as string, flags, account }
}
