'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

function isRecoveryUrl(): boolean {
  if (typeof window === 'undefined') return false
  const query = new URLSearchParams(window.location.search)
  if (query.get('type') === 'recovery') return true

  const rawHash = window.location.hash.startsWith('#')
    ? window.location.hash.slice(1)
    : window.location.hash
  if (!rawHash) return false
  const hash = new URLSearchParams(rawHash)
  return hash.get('type') === 'recovery'
}

/**
 * If a password-recovery link lands on `/` (or any non-reset page) with
 * hash/query tokens, bounce to `/reset-password` so the user can set a password.
 */
export function PasswordRecoveryRedirect() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    const path = window.location.pathname
    if (path.startsWith('/reset-password') || path.startsWith('/forgot-password')) return

    const goReset = () => {
      const search = window.location.search
      const hash = window.location.hash
      window.location.replace(`/reset-password${search}${hash}`)
    }

    if (isRecoveryUrl()) {
      goReset()
      return
    }

    const supabase = createClient()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        const current = window.location.pathname
        if (!current.startsWith('/reset-password')) {
          goReset()
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  return null
}
