/**
 * App configuration (constants, feature flags)
 */

export const APP_CONFIG = {
  /** Swifto GST number (if Swifto is GST-registered) - for receipts */
  GST_NUMBER: process.env.NEXT_PUBLIC_SWIFTO_GST_NUMBER || '',
} as const
