/**
 * Swifto fee model (NZD) — GST-aware two-transaction structure
 *
 * Transaction 1 (listing): $0.99 ex GST + 15% GST → lister pays $1.14 at post.
 * Transaction 2 (job payout): job price is GST-inclusive; student payout depends on gst_registered.
 *
 * $25 example (not GST-registered): service $21.74, GST $3.26, credit +$1.85, Swifto −$1.88 → $21.71
 * $25 example (GST-registered): service $21.74, GST $3.26, credit $0, Swifto −$1.88 → $19.86
 */

export const FEE_CONFIG = {
  GST_RATE: 0.15,
  /** Listing fee ex GST (Transaction 1) */
  LISTING_FEE_EX_GST: 0.99,
  /** GST on listing fee */
  LISTING_FEE_GST: 0.15,
  /** Total listing fee charged to lister (ex GST + GST) */
  LISTING_FEE_TOTAL: 1.14,
  /** Swifto service fee: 7.5% of gross job price */
  SWIFTO_FEE_RATE: 0.075,
  /** Flat-rate credit: 8.5% of service ex GST, non–GST-registered students only */
  FLAT_RATE_CREDIT_RATE: 0.085,
  MIN_JOB_PRICE: 10,
  STRIPE_RATE: 0.0265,
  STRIPE_FIXED: 0.3,
} as const

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

export interface StudentPayoutOptions {
  gstRegistered?: boolean
}

export interface JobPayoutBreakdown {
  jobPrice: number
  gstInJob: number
  serviceExGst: number
  flatRateCredit: number
  swiftoFee: number
  studentPayout: number
}

/** Service value excluding GST from a GST-inclusive job price. */
export function getServiceExGst(price: number): number {
  if (price <= 0) return 0
  return round2(price / (1 + FEE_CONFIG.GST_RATE))
}

/** GST component inside a GST-inclusive job price. */
export function getGstInJob(price: number): number {
  if (price <= 0) return 0
  return round2(price - getServiceExGst(price))
}

/** Swifto service fee: 7.5% of gross job price. */
export function getSwiftoServiceFee(price: number): number {
  if (price <= 0) return 0
  return round2(price * FEE_CONFIG.SWIFTO_FEE_RATE)
}

/** Flat-rate credit for non–GST-registered students. */
export function getFlatRateCredit(price: number): number {
  if (price <= 0) return 0
  return round2(getServiceExGst(price) * FEE_CONFIG.FLAT_RATE_CREDIT_RATE)
}

/** Swifto fee withheld from job (alias for ledger / exports). */
export function getPlatformFee(price: number): number {
  return getSwiftoServiceFee(price)
}

/** GST on listing fee (Transaction 1). */
export function getListingFeeGst(): number {
  return FEE_CONFIG.LISTING_FEE_GST
}

/** Total listing fee incl. GST charged at post. */
export function getListingFeeTotal(): number {
  return FEE_CONFIG.LISTING_FEE_TOTAL
}

export function getJobPayoutBreakdown(
  price: number,
  options?: StudentPayoutOptions
): JobPayoutBreakdown {
  const gstRegistered = options?.gstRegistered ?? false
  if (price <= 0) {
    return {
      jobPrice: 0,
      gstInJob: 0,
      serviceExGst: 0,
      flatRateCredit: 0,
      swiftoFee: 0,
      studentPayout: 0,
    }
  }
  const serviceExGst = getServiceExGst(price)
  const gstInJob = getGstInJob(price)
  const swiftoFee = getSwiftoServiceFee(price)
  const flatRateCredit = gstRegistered ? 0 : getFlatRateCredit(price)
  const studentPayout = round2(serviceExGst + flatRateCredit - swiftoFee)
  return { jobPrice: price, gstInJob, serviceExGst, flatRateCredit, swiftoFee, studentPayout }
}

/** Stripe fee estimate for NZ domestic online card (display only). */
export function getStripeFeeEstimate(price: number): number {
  const { STRIPE_RATE, STRIPE_FIXED } = FEE_CONFIG
  if (price <= 0) return 0
  return round2(price * STRIPE_RATE + STRIPE_FIXED)
}

/** Student payout after GST split, flat-rate credit, and Swifto fee. */
export function getStudentPayoutEstimate(
  price: number,
  options?: StudentPayoutOptions
): number {
  return getJobPayoutBreakdown(price, options).studentPayout
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

export function getPlatformFeeCents(priceNzd: number): number {
  return Math.round(getPlatformFee(priceNzd) * 100)
}

export function getStudentPayoutCents(
  priceNzd: number,
  gstRegistered = false
): number {
  return Math.round(getStudentPayoutEstimate(priceNzd, { gstRegistered }) * 100)
}

export function getListingFeeTotalCents(): number {
  return Math.round(FEE_CONFIG.LISTING_FEE_TOTAL * 100)
}
