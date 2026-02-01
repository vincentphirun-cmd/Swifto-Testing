/**
 * Swifto hybrid fee model (NZD)
 * Platform fee withheld from student payout on completion.
 */

export const FEE_CONFIG = {
  /** Flat fee charged to lister when posting a job (NZD) */
  LISTING_FEE: 0.99,
  MIN_JOB_PRICE: 10,
  LOW_BAND_MAX: 60,
  LOW_RATE: 0.08,
  LOW_BASE: 0.4,
  FLAT_BASE: 5,
  TAIL_RATE: 0.04,
  STRIPE_RATE: 0.0265,
  STRIPE_FIXED: 0.3,
} as const

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

/**
 * Platform fee withheld from student payout (NZD).
 * If P <= 60: fee = min(5.00, round(P * 0.08 + 0.40, 2))
 * If P > 60: fee = round(5.00 + 0.04 * (P - 60), 2)
 */
export function getPlatformFee(price: number): number {
  const { LOW_BAND_MAX, LOW_RATE, LOW_BASE, FLAT_BASE, TAIL_RATE } = FEE_CONFIG
  if (price <= 0) return 0
  if (price <= LOW_BAND_MAX) {
    const calc = round2(price * LOW_RATE + LOW_BASE)
    return Math.min(FLAT_BASE, calc)
  }
  return round2(FLAT_BASE + TAIL_RATE * (price - LOW_BAND_MAX))
}

/**
 * Stripe fee estimate for NZ domestic online card (display only).
 */
export function getStripeFeeEstimate(price: number): number {
  const { STRIPE_RATE, STRIPE_FIXED } = FEE_CONFIG
  if (price <= 0) return 0
  return round2(price * STRIPE_RATE + STRIPE_FIXED)
}

export interface StudentPayoutOptions {
  /** Include Stripe fee in breakdown (for display). Default false. */
  includeStripeEstimate?: boolean
}

/**
 * Estimated student payout after Swifto platform fee.
 * payout = price - platformFee
 */
export function getStudentPayoutEstimate(
  price: number,
  options?: StudentPayoutOptions
): number {
  if (price <= 0) return 0
  return round2(price - getPlatformFee(price))
}

/**
 * Validate minimum job price. Returns { ok: true } or { ok: false, message }.
 */
export function validateMinJobPrice(price: number): {
  ok: boolean
  message?: string
} {
  const { MIN_JOB_PRICE } = FEE_CONFIG
  if (isNaN(price) || price < 0) {
    return { ok: false, message: 'Please enter a valid price.' }
  }
  if (price < MIN_JOB_PRICE) {
    return {
      ok: false,
      message: `The minimum job price is $${MIN_JOB_PRICE.toFixed(2)}.`,
    }
  }
  return { ok: true }
}

/**
 * Get platform fee in cents for database/trigger use.
 */
export function getPlatformFeeCents(priceNzd: number): number {
  return Math.round(getPlatformFee(priceNzd) * 100)
}
