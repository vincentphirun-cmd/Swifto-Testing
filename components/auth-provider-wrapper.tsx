'use client'

import { useEffect } from 'react'
import { AuthProvider } from '@/lib/auth-context'
import { ErrorBoundary } from './error-boundary'

export function AuthProviderWrapper({ children }: { children: React.ReactNode }) {
  // Global handler for unhandled promise rejections (AbortError from Supabase)
  useEffect(() => {
    const handleRejection = (e: PromiseRejectionEvent) => {
      const err = e?.reason
      if (err?.name === 'AbortError' || (typeof err?.message === 'string' && err.message.includes('aborted'))) {
        e.preventDefault()
        e.stopImmediatePropagation()
      }
    }
    window.addEventListener('unhandledrejection', handleRejection, { capture: true })
    return () => {
      window.removeEventListener('unhandledrejection', handleRejection, { capture: true })
    }
  }, [])

  return (
    <ErrorBoundary>
      <AuthProvider>{children}</AuthProvider>
    </ErrorBoundary>
  )
}
