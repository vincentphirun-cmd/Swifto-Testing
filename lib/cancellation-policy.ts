/**
 * Student cancellation policy logic
 * >24h: no penalty
 * 24h-2h: reliability impact
 * <2h or no-show: late fee + strike
 * Safety-related: no penalty, flagged
 */

export type CancelReason =
  | 'sick_emergency'
  | 'scheduling_conflict'
  | 'unsafe_uncomfortable'
  | 'cant_reach_lister'
  | 'other'

export const CANCEL_REASONS: { value: CancelReason; label: string; isSafety?: boolean }[] = [
  { value: 'sick_emergency', label: 'Sick / emergency' },
  { value: 'scheduling_conflict', label: 'Scheduling conflict' },
  { value: 'unsafe_uncomfortable', label: 'Unsafe / uncomfortable', isSafety: true },
  { value: 'cant_reach_lister', label: "Can't reach lister" },
  { value: 'other', label: 'Other' },
]

export type PenaltyType = 'none' | 'reliability' | 'late_fee_strike'

export interface CancelConsequence {
  penalty: PenaltyType
  message: string
}

const HOURS_24 = 24
const HOURS_2 = 2

export function getCancelConsequence(
  startTime: Date | null,
  reason: CancelReason
): CancelConsequence {
  const isSafety = CANCEL_REASONS.find((r) => r.value === reason)?.isSafety ?? false
  if (isSafety) {
    return { penalty: 'none', message: 'Cancel now: no penalty (flagged for review)' }
  }
  if (!startTime) {
    return { penalty: 'none', message: 'Cancel now: no penalty (no start time set)' }
  }
  const now = new Date()
  const hoursUntil = (startTime.getTime() - now.getTime()) / (1000 * 60 * 60)
  if (hoursUntil > HOURS_24) {
    return { penalty: 'none', message: 'Cancel now: no penalty' }
  }
  if (hoursUntil > HOURS_2) {
    return { penalty: 'reliability', message: 'Cancel now: reliability score will decrease' }
  }
  return {
    penalty: 'late_fee_strike',
    message: 'Cancel now: late fee may apply, strike recorded',
  }
}

export function getHoursBeforeStart(startTime: Date | null): number | null {
  if (!startTime) return null
  const now = new Date()
  return (startTime.getTime() - now.getTime()) / (1000 * 60 * 60)
}
