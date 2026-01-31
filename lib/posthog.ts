import posthog from 'posthog-js'

export function captureEvent(event: string, properties?: Record<string, unknown>) {
  try {
    if (typeof window !== 'undefined') {
      posthog.capture(event, properties)
    }
  } catch {
    // PostHog not configured or init failed
  }
}

export function identifyUser(userId: string, traits?: Record<string, unknown>) {
  try {
    if (typeof window !== 'undefined') {
      posthog.identify(userId, traits)
    }
  } catch {
    // PostHog not configured or init failed
  }
}
