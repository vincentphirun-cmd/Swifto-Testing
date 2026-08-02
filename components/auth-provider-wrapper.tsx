'use client'

import { useEffect } from 'react'
import { AuthProvider } from '@/lib/auth-context'
import { ErrorBoundary } from './error-boundary'
import { PostHogProvider } from './posthog-provider'
import { PasswordRecoveryRedirect } from './password-recovery-redirect'
import { isAbortError } from '@/lib/abort-error'

export function AuthProviderWrapper({ children }: { children: React.ReactNode }) {
  // Global handler for unhandled promise rejections (AbortError from Supabase)
  useEffect(() => {
    const handleRejection = (e: PromiseRejectionEvent) => {
      if (isAbortError(e?.reason)) {
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
      <PostHogProvider>
        <AuthProvider>
          <PasswordRecoveryRedirect />
          {children}
        </AuthProvider>
      </PostHogProvider>
    </ErrorBoundary>
  )
}
