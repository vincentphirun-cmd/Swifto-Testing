'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  COOKIE_CONSENT_EVENT,
  getCookieConsent,
  setCookieConsent,
  type CookieConsent,
} from '@/lib/cookie-consent'

export function CookieConsentBanner() {
  const [choice, setChoice] = useState<CookieConsent | null | 'unknown'>('unknown')

  useEffect(() => {
    setChoice(getCookieConsent())
    const onChange = () => setChoice(getCookieConsent())
    window.addEventListener(COOKIE_CONSENT_EVENT, onChange)
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, onChange)
  }, [])

  if (choice === 'unknown' || choice) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-[70] p-4 md:p-6">
      <div className="mx-auto max-w-3xl rounded-2xl border border-ink/15 bg-white shadow-pop px-5 py-5 md:px-6 md:py-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink/60">Your cookie settings.</p>
        <h2 className="mt-2 text-xl md:text-2xl font-display font-extrabold tracking-tight text-ink">
          Personalised experiences, under your control.
        </h2>
        <p className="mt-3 text-sm text-ink leading-relaxed">
          We use cookies and similar technologies on Swifto. Essential cookies keep you signed in and
          help the platform work. With your consent, we can use optional analytics (PostHog) to
          understand how people use Swifto and improve the product. We do not use advertising cookies.
          You can change your choice later by clearing site data for this site. We do not use them
          until you accept.{' '}
          <Link href="/privacy#cookies-analytics" className="text-primary font-medium underline hover:no-underline">
            Privacy Statement
          </Link>
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            className="swifto-btn-primary h-11 px-5 text-sm"
            onClick={() => setCookieConsent('accepted')}
          >
            Accept all
          </button>
          <button
            type="button"
            className="swifto-btn-outline-brand h-11 px-5 text-sm"
            onClick={() => setCookieConsent('rejected')}
          >
            Only necessary cookies
          </button>
        </div>
      </div>
    </div>
  )
}
