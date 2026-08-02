import { NextRequest, NextResponse } from 'next/server'
import { requireAdminUser } from '@/lib/admin-auth'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * GET /api/admin/metrics
 * Core platform KPIs for the admin hub.
 */
export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdminUser(req)
    if (auth instanceof NextResponse) return auth

    const admin = createAdminClient()

    const [
      students,
      listers,
      admins,
      jobsActive,
      jobsInProgress,
      jobsCompleted,
      appsPending,
      identityPending,
      deposits,
      withdrawals,
      refunds,
    ] = await Promise.all([
      admin.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student'),
      admin.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'lister'),
      admin.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'admin'),
      admin.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      admin.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'in_progress'),
      admin.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
      admin.from('job_applications').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      admin
        .from('lister_identity_submissions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending'),
      admin
        .from('transactions')
        .select('amount_cents')
        .eq('type', 'deposit')
        .eq('status', 'succeeded'),
      admin
        .from('transactions')
        .select('amount_cents')
        .eq('type', 'withdrawal')
        .eq('status', 'succeeded'),
      admin
        .from('transactions')
        .select('amount_cents')
        .eq('type', 'refund')
        .eq('status', 'succeeded'),
    ])

    const sumCents = (rows: { amount_cents: number }[] | null) =>
      (rows ?? []).reduce((acc, r) => acc + Math.abs(Number(r.amount_cents ?? 0)), 0)

    return NextResponse.json({
      users: {
        students: students.count ?? 0,
        listers: listers.count ?? 0,
        admins: admins.count ?? 0,
        total:
          (students.count ?? 0) + (listers.count ?? 0) + (admins.count ?? 0),
      },
      jobs: {
        active: jobsActive.count ?? 0,
        in_progress: jobsInProgress.count ?? 0,
        completed: jobsCompleted.count ?? 0,
      },
      applications_pending: appsPending.count ?? 0,
      identity_pending: identityPending.count ?? 0,
      money: {
        deposits_cents: sumCents(deposits.data as { amount_cents: number }[] | null),
        withdrawals_cents: sumCents(withdrawals.data as { amount_cents: number }[] | null),
        refunds_cents: sumCents(refunds.data as { amount_cents: number }[] | null),
      },
    })
  } catch (e) {
    console.error('Admin metrics error:', e)
    return NextResponse.json({ error: 'Failed to load metrics' }, { status: 500 })
  }
}
