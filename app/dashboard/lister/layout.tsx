'use client'

import { useEffect, useRef, useState } from 'react'
import { DashboardRoleGuard } from '@/components/dashboard-role-guard'
import { createClient } from '@/lib/supabase/client'

export default function ListerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [pauseGuard, setPauseGuard] = useState(false)
  const depositReturnHandled = useRef(false)

  useEffect(() => {
    if (depositReturnHandled.current) return
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    if (params.get('deposit') !== 'success') return

    depositReturnHandled.current = true
    setPauseGuard(true)

    void (async () => {
      const supabase = createClient()
      try {
        await supabase.auth.getSession()
        await supabase.auth.refreshSession()
      } catch {
        // Session may restore via auth listener
      }
      setPauseGuard(false)
    })()
  }, [])

  return (
    <DashboardRoleGuard role="lister" pauseGuard={pauseGuard}>
      {children}
    </DashboardRoleGuard>
  )
}
