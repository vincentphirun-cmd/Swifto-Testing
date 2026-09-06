'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { createClient } from './supabase/client'
import { identifyUser, resetAnalytics } from './posthog'
import { isAbortError } from './abort-error'

type AuthContextType = {
  user: User | null
  session: Session | null
  accessToken: string | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  accessToken: null,
  loading: true,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [supabase] = useState(() => createClient())

  // Set up global AbortError handler immediately on mount
  useEffect(() => {
    // Suppress AbortError from unhandled rejections (auth-js locks during redirects/navigation)
    const handleRejection = (e: PromiseRejectionEvent) => {
      if (isAbortError(e?.reason)) {
        e.preventDefault()
        e.stopImmediatePropagation()
        return false
      }
    }
    const handleError = (e: ErrorEvent) => {
      if (isAbortError(e.error)) {
        e.preventDefault()
        e.stopImmediatePropagation()
      }
    }
    window.addEventListener('unhandledrejection', handleRejection, { capture: true })
    window.addEventListener('error', handleError, { capture: true })
    return () => {
      window.removeEventListener('unhandledrejection', handleRejection, { capture: true })
      window.removeEventListener('error', handleError, { capture: true })
    }
  }, [])

  useEffect(() => {
    let mounted = true
    let subscription: { unsubscribe: () => void } | null = null

    // Get initial session - wrap in try-catch to handle abort errors
    const initSession = async () => {
      try {
        const result = await supabase.auth.getSession()
        if (!mounted) return
        if (result.error && !isAbortError(result.error)) {
          console.error('Error getting session:', result.error)
        }
        const s = result.data?.session ?? null
        setSession(s)
        const u = s?.user ?? null
        setUser(u)
        setLoading(false)
        if (u) {
          identifyUser(u.id, {
            email: u.email,
            role: u.user_metadata?.role,
          })
        }
      } catch (err: any) {
        if (!mounted) return
        // Silently ignore abort errors - they happen during email confirmation
        if (!isAbortError(err)) {
          console.error('Session error:', err)
        }
        setLoading(false)
      }
    }

    initSession()

    // Listen for auth changes
    try {
      const {
        data: { subscription: sub },
      } = supabase.auth.onAuthStateChange((event, session) => {
        if (!mounted) return
        
        try {
          setSession(session)
          setUser(session?.user ?? null)
          setLoading(false)
          if (session?.user) {
            identifyUser(session.user.id, {
              email: session.user.email,
              role: session.user.user_metadata?.role,
            })
          }
        } catch (err: any) {
          if (!mounted) return
          // Silently ignore abort errors
          if (!isAbortError(err)) {
            console.error('Auth state change error:', err)
          }
        }
      })
      subscription = sub
    } catch (err) {
      if (!mounted) return
      console.error('Error setting up auth listener:', err)
      setLoading(false)
    }

    return () => {
      mounted = false
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [supabase])

  const signOut = async () => {
    resetAnalytics()
    await supabase.auth.signOut()
    setSession(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, session, accessToken: session?.access_token ?? null, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
