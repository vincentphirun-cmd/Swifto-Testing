import { DashboardRoleGuard } from '@/components/dashboard-role-guard'

export default function ListerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardRoleGuard role="lister">{children}</DashboardRoleGuard>
}
