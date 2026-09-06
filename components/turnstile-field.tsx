'use client'

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: { sitekey: string; callback: (token: string) => void; 'expired-callback'?: () => void }
      ) => string
      reset: (id: string) => void
    }
  }
}

type Props = {
  onToken: (token: string | null) => void
}

export function TurnstileField({ onToken }: Props) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  const hostRef = useRef<HTMLDivElement | null>(null)
  const widgetId = useRef<string | null>(null)

  useEffect(() => {
    if (!siteKey || !hostRef.current) return

    const render = () => {
      if (!hostRef.current || !window.turnstile || widgetId.current) return
      widgetId.current = window.turnstile.render(hostRef.current, {
        sitekey: siteKey,
        callback: (token) => onToken(token),
        'expired-callback': () => onToken(null),
      })
    }

    if (window.turnstile) {
      render()
      return
    }

    const existing = document.querySelector<HTMLScriptElement>('script[data-swifto-turnstile]')
    if (existing) {
      existing.addEventListener('load', render)
      return () => existing.removeEventListener('load', render)
    }

    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    script.async = true
    script.dataset.swiftoTurnstile = 'true'
    script.addEventListener('load', render)
    document.head.appendChild(script)
    return () => script.removeEventListener('load', render)
  }, [siteKey, onToken])

  if (!siteKey) return null

  return <div ref={hostRef} className="flex justify-center" />
}
