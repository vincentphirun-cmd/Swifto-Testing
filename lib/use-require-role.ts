'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase/client'
import {
  dashboardPathForRole,
  fetchUserRole,
  type UserRole,
} from '@/lib/user-role'

export function useRequireRole(requiredRole: UserRole, options?: { pauseGuard?: boolean }) {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [roleReady, setRoleReady] = useState(false)
  const pauseGuard = options?.pauseGuard ?? false

  useEffect(() => {
    if (authLoading || pauseGuard) return

    if (!user?.id) {
      setRoleReady(false)
      const returnPath =
        typeof window !== 'undefined'
          ? `${window.location.pathname}${window.location.search}`
          : dashboardPathForRole(requiredRole)
      router.replace(`/login?redirect=${encodeURIComponent(returnPath)}`)
      return
    }

    let cancelled = false
    void (async () => {
      const supabase = createClient()
      const role = await fetchUserRole(supabase, user)
      if (cancelled) return
      if (role !== requiredRole) {
        router.replace(dashboardPathForRole(role))
        return
      }
      setRoleReady(true)
    })()

    return () => {
      cancelled = true
    }
  }, [user, authLoading, requiredRole, router, pauseGuard])

  return {
    user,
    authLoading,
    roleReady: roleReady && !!user,
  }
}
