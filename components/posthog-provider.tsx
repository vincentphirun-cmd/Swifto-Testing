'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useEffect } from 'react'
import { COOKIE_CONSENT_EVENT, hasAnalyticsConsent } from '@/lib/cookie-consent'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'

    const start = () => {
      if (!key || typeof window === 'undefined' || !hasAnalyticsConsent()) return
      posthog.init(key, { api_host: host, persistence: 'localStorage+cookie' })
    }

    start()
    window.addEventListener(COOKIE_CONSENT_EVENT, start)
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, start)
  }, [])

  return <PHProvider client={posthog}>{children}</PHProvider>
}
