'use client'

import { SiteNav } from '@/components/site-nav'
import { useRequireRole } from '@/lib/use-require-role'
import type { UserRole } from '@/lib/user-role'

type Props = {
  role: UserRole
  pauseGuard?: boolean
  children: React.ReactNode
}

export function DashboardRoleGuard({ role, pauseGuard, children }: Props) {
  const { authLoading, roleReady } = useRequireRole(role, { pauseGuard })

  if (authLoading || !roleReady) {
    return (
      <>
        <SiteNav />
        <main className="min-h-screen bg-primary flex items-center justify-center">
          <p className="text-white text-lg">Loading…</p>
        </main>
      </>
    )
  }

  return <>{children}</>
}
