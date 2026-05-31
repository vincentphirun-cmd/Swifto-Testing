/**
 * Swifto fee model (NZD)
 *
 * Listing/processing fee ($0.99) is charged to the lister when posting a job.
 * Student payout on completion:
 *   remainder = job price − $0.99
 *   Swifto service fee = 5% of remainder
 *   student payout = job price − $0.99 − Swifto service fee
 *
 * Example: $30 job → $27.56 student payout
 */

export const FEE_CONFIG = {
  /** Flat fee charged to lister when posting a job (NZD) */
  LISTING_FEE: 0.99,
  /** Same amount allocated from job price when calculating student payout */
  PROCESSING_FEE: 0.99,
  /** Swifto service fee rate on amount after processing allocation */
  SWIFTO_FEE_RATE: 0.05,
  MIN_JOB_PRICE: 10,
  STRIPE_RATE: 0.0265,
  STRIPE_FIXED: 0.3,
} as const

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

/** Processing fee allocation from job price (lister pays this at post). */
export function getProcessingFeeAllocation(price: number): number {
  if (price <= 0) return 0
  return FEE_CONFIG.PROCESSING_FEE
}

/** Swifto 5% service fee on (job price − processing fee). */
export function getSwiftoServiceFee(price: number): number {
  if (price <= 0) return 0
  const remainder = round2(price - FEE_CONFIG.PROCESSING_FEE)
  if (remainder <= 0) return 0
  return round2(remainder * FEE_CONFIG.SWIFTO_FEE_RATE)
}

/**
 * Total withheld from job price before student payout.
 * = processing allocation + Swifto service fee
 */
export function getPlatformFee(price: number): number {
  if (price <= 0) return 0
  return round2(getProcessingFeeAllocation(price) + getSwiftoServiceFee(price))
}

/** Stripe fee estimate for NZ domestic online card (display only). */
export function getStripeFeeEstimate(price: number): number {
  const { STRIPE_RATE, STRIPE_FIXED } = FEE_CONFIG
  if (price <= 0) return 0
  return round2(price * STRIPE_RATE + STRIPE_FIXED)
}

export interface StudentPayoutOptions {
  /** Include Stripe fee in breakdown (for display). Default false. */
  includeStripeEstimate?: boolean
}

/** Student payout after processing allocation and Swifto service fee. */
export function getStudentPayoutEstimate(
  price: number,
  _options?: StudentPayoutOptions
): number {
  if (price <= 0) return 0
  return round2(price - getPlatformFee(price))
}

/** Validate minimum job price. Returns { ok: true } or { ok: false, message }. */
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

/** Total platform withhold in cents for database/trigger use. */
export function getPlatformFeeCents(priceNzd: number): number {
  return Math.round(getPlatformFee(priceNzd) * 100)
}

export function getStudentPayoutCents(priceNzd: number): number {
  return Math.round(getStudentPayoutEstimate(priceNzd) * 100)
}
