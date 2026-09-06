export const COOKIE_CONSENT_KEY = 'swifto_cookie_consent'
export const COOKIE_CONSENT_EVENT = 'swifto-cookie-consent'

export type CookieConsent = 'accepted' | 'rejected'

export function getCookieConsent(): CookieConsent | null {
  if (typeof window === 'undefined') return null
  try {
    const value = window.localStorage.getItem(COOKIE_CONSENT_KEY)
    if (value === 'accepted' || value === 'rejected') return value
  } catch {
    return null
  }
  return null
}

export function hasAnalyticsConsent(): boolean {
  return getCookieConsent() === 'accepted'
}

export function setCookieConsent(value: CookieConsent) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(COOKIE_CONSENT_KEY, value)
  window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT, { detail: value }))
}
