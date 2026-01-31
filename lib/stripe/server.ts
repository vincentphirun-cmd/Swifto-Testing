import Stripe from 'stripe'

export function getStripeServer(): Stripe {
  const secret = process.env.STRIPE_SECRET_KEY
  if (!secret) {
    throw new Error('Missing STRIPE_SECRET_KEY in .env.local')
  }
  return new Stripe(secret)
}
