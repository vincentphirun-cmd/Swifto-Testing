'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from './supabase/client'

type AuthContextType = {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [supabase] = useState(() => createClient())

  // Set up global AbortError handler immediately on mount
  useEffect(() => {
    // Suppress AbortError from unhandled rejections (auth-js locks during redirects/navigation)
    const handleRejection = (e: PromiseRejectionEvent) => {
      const err = e?.reason
      if (err?.name === 'AbortError' || (typeof err?.message === 'string' && err.message.includes('aborted'))) {
        e.preventDefault()
        e.stopImmediatePropagation()
        return false
      }
    }
    window.addEventListener('unhandledrejection', handleRejection, { capture: true })
    return () => {
      window.removeEventListener('unhandledrejection', handleRejection, { capture: true })
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
        if (result.error && !result.error.message?.includes('aborted')) {
          console.error('Error getting session:', result.error)
        }
        setUser(result.data?.session?.user ?? null)
        setLoading(false)
      } catch (err: any) {
        if (!mounted) return
        // Silently ignore abort errors - they happen during email confirmation
        if (err?.name !== 'AbortError' && !err?.message?.includes('aborted')) {
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
          // Handle all auth events
          setUser(session?.user ?? null)
          setLoading(false)
        } catch (err: any) {
          if (!mounted) return
          // Silently ignore abort errors
          if (err?.name !== 'AbortError' && !err?.message?.includes('aborted')) {
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
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
