import posthog from 'posthog-js'
import { hasAnalyticsConsent } from './cookie-consent'

export function captureEvent(event: string, properties?: Record<string, unknown>) {
  try {
    if (typeof window === 'undefined') return
    if (!hasAnalyticsConsent()) return
    posthog.capture(event, properties)
  } catch {
    // PostHog not configured or init failed
  }
}

export function identifyUser(userId: string, traits?: Record<string, unknown>) {
  try {
    if (typeof window === 'undefined') return
    if (!hasAnalyticsConsent()) return
    posthog.identify(userId, traits)
  } catch {
    // PostHog not configured or init failed
  }
}

export function resetAnalytics() {
  try {
    if (typeof window === 'undefined') return
    posthog.reset()
  } catch {
    // ignore
  }
}
