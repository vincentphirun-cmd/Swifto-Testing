'use client'

import { DashboardRoleGuard } from '@/components/dashboard-role-guard'

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardRoleGuard role="student">{children}</DashboardRoleGuard>
}
