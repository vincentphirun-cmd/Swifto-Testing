'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase/client'
import { SiteNav } from '@/components/site-nav'

/**
 * Ensures ADMIN_EMAILS users are promoted to role=admin, then gates admin pages.
 */
export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (authLoading) return

    if (!user?.id) {
      setReady(false)
      const returnPath =
        typeof window !== 'undefined'
          ? `${window.location.pathname}${window.location.search}`
          : '/admin'
      router.replace(`/login?redirect=${encodeURIComponent(returnPath)}`)
      return
    }

    let cancelled = false
    void (async () => {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session?.access_token) {
        router.replace('/login?redirect=/admin')
        return
      }

      // Promote ADMIN_EMAILS → role=admin when needed
      await fetch('/api/admin/check', {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.access_token}` },
      }).catch(() => null)

      const res = await fetch('/api/admin/check', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      const data = await res.json().catch(() => ({ admin: false }))
      if (cancelled) return

      if (!data.admin) {
        router.replace('/login')
        return
      }
      setReady(true)
    })()

    return () => {
      cancelled = true
    }
  }, [user, authLoading, router])

  if (authLoading || !ready) {
    return (
      <>
        <SiteNav />
        <main className="min-h-screen bg-canvas flex items-center justify-center">
          <p className="text-ink-muted text-lg">Loading admin…</p>
        </main>
      </>
    )
  }

  return <>{children}</>
}
