import { NextRequest, NextResponse } from 'next/server'
import ExcelJS from 'exceljs'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean)

function isAdmin(email: string | undefined): boolean {
  if (!email) return false
  return ADMIN_EMAILS.includes(email.toLowerCase())
}

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization')
    const token = authHeader?.replace(/^Bearer\s+/i, '').trim()
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser(token)
    if (!user || !isAdmin(user.email)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const format = searchParams.get('format') || 'xlsx'
    const end = searchParams.get('end_date') || new Date().toISOString().split('T')[0]
    const start = searchParams.get('start_date') || (() => {
      const d = new Date(end)
      d.setDate(d.getDate() - 30)
      return d.toISOString().split('T')[0]
    })()

    const admin = createAdminClient()
    const { data: rows, error } = await admin
      .from('financial_ledger')
      .select('*')
      .gte('created_at', `${start}T00:00:00Z`)
      .lte('created_at', `${end}T23:59:59.999Z`)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Ledger fetch error:', error)
      return NextResponse.json({ error: 'Failed to fetch ledger' }, { status: 500 })
    }

    const ledger = rows ?? []

    const workbook = new ExcelJS.Workbook()
    workbook.creator = 'Swifto'
    workbook.created = new Date()

    // Sheet 1: Transactions (raw ledger)
    const ws1 = workbook.addWorksheet('Transactions', { headerFooter: { firstHeader: 'Transactions (raw ledger)' } })
    ws1.columns = [
      { header: 'transaction_id', key: 'id', width: 38 },
      { header: 'created_at', key: 'created_at', width: 22 },
      { header: 'job_id', key: 'job_id', width: 38 },
      { header: 'booking_id', key: 'booking_id', width: 38 },
      { header: 'lister_user_id', key: 'lister_user_id', width: 38 },
      { header: 'student_user_id', key: 'student_user_id', width: 38 },
      { header: 'job_title', key: 'job_title', width: 30 },
      { header: 'job_price_gross', key: 'job_price_gross', width: 14 },
      { header: 'platform_fee', key: 'platform_fee', width: 12 },
      { header: 'stripe_processing_fee', key: 'stripe_processing_fee', width: 18 },
      { header: 'gst_on_platform_fee', key: 'gst_on_platform_fee', width: 16 },
      { header: 'gst_on_job', key: 'gst_on_job', width: 10 },
      { header: 'net_payout_to_student', key: 'net_payout_to_student', width: 20 },
      { header: 'refund_amount', key: 'refund_amount', width: 14 },
      { header: 'payment_status', key: 'payment_status', width: 14 },
      { header: 'payout_status', key: 'payout_status', width: 14 },
      { header: 'stripe_payment_intent_id', key: 'stripe_payment_intent_id', width: 30 },
      { header: 'stripe_charge_id', key: 'stripe_charge_id', width: 30 },
      { header: 'stripe_transfer_id', key: 'stripe_transfer_id', width: 30 },
      { header: 'currency', key: 'currency', width: 8 },
      { header: 'receipt_number', key: 'receipt_number', width: 16 },
      { header: 'receipt_type', key: 'receipt_type', width: 16 },
      { header: 'notes', key: 'notes', width: 24 },
    ]
    ws1.getRow(1).font = { bold: true }
    for (const r of ledger) {
      ws1.addRow({
        id: r.id,
        created_at: r.created_at,
        job_id: r.job_id ?? '',
        booking_id: r.booking_id ?? '',
        lister_user_id: r.lister_user_id ?? '',
        student_user_id: r.student_user_id ?? '',
        job_title: r.job_title ?? '',
        job_price_gross: Number(r.job_price_gross ?? 0),
        platform_fee: Number(r.platform_fee ?? 0),
        stripe_processing_fee: Number(r.stripe_processing_fee ?? 0),
        gst_on_platform_fee: Number(r.gst_on_platform_fee ?? 0),
        gst_on_job: Number(r.gst_on_job ?? 0),
        net_payout_to_student: Number(r.net_payout_to_student ?? 0),
        refund_amount: Number(r.refund_amount ?? 0),
        payment_status: r.payment_status ?? '',
        payout_status: r.payout_status ?? '',
        stripe_payment_intent_id: r.stripe_payment_intent_id ?? '',
        stripe_charge_id: r.stripe_charge_id ?? '',
        stripe_transfer_id: r.stripe_transfer_id ?? '',
        currency: r.currency ?? 'NZD',
        receipt_number: r.receipt_number ?? '',
        receipt_type: r.receipt_type ?? '',
        notes: r.notes ?? '',
      })
    }

    // Sheet 2: Receipts_Lister
    const ws2 = workbook.addWorksheet('Receipts_Lister')
    ws2.columns = [
      { header: 'receipt_id', key: 'receipt_id', width: 38 },
      { header: 'date', key: 'date', width: 12 },
      { header: 'lister_user_id', key: 'lister_user_id', width: 38 },
      { header: 'job_id', key: 'job_id', width: 38 },
      { header: 'job_title', key: 'job_title', width: 30 },
      { header: 'amount_paid', key: 'amount_paid', width: 12 },
      { header: 'swifto_fee_charged_to_lister', key: 'swifto_fee', width: 24 },
      { header: 'gst_on_swifto_fee', key: 'gst_on_swifto_fee', width: 16 },
      { header: 'currency', key: 'currency', width: 8 },
    ]
    ws2.getRow(1).font = { bold: true }
    for (const r of ledger) {
      const isListingFee = r.notes === 'Listing fee'
      const amountPaid = isListingFee ? Number(r.platform_fee ?? 0.99) : Number(r.job_price_gross ?? 0)
      const swiftoFee = isListingFee ? Number(r.platform_fee ?? 0.99) : 0
      ws2.addRow({
        receipt_id: r.id,
        date: (r.created_at || '').toString().slice(0, 10),
        lister_user_id: r.lister_user_id ?? '',
        job_id: r.job_id ?? '',
        job_title: r.job_title ?? '',
        amount_paid: amountPaid,
        swifto_fee: swiftoFee,
        gst_on_swifto_fee: Number(r.gst_on_platform_fee ?? 0),
        currency: r.currency ?? 'NZD',
      })
    }

    // Sheet 3: Payouts_Students
    const ws3 = workbook.addWorksheet('Payouts_Students')
    ws3.columns = [
      { header: 'payout_id', key: 'payout_id', width: 38 },
      { header: 'date', key: 'date', width: 12 },
      { header: 'student_user_id', key: 'student_user_id', width: 38 },
      { header: 'job_id', key: 'job_id', width: 38 },
      { header: 'gross_job_price', key: 'gross_job_price', width: 14 },
      { header: 'swifto_fee_withheld', key: 'swifto_fee_withheld', width: 18 },
      { header: 'stripe_fee', key: 'stripe_fee', width: 12 },
      { header: 'net_paid', key: 'net_paid', width: 10 },
      { header: 'payout_status', key: 'payout_status', width: 14 },
      { header: 'currency', key: 'currency', width: 8 },
    ]
    ws3.getRow(1).font = { bold: true }
    for (const r of ledger) {
      if (r.notes === 'Listing fee') continue
      ws3.addRow({
        payout_id: r.id,
        date: (r.created_at || '').toString().slice(0, 10),
        student_user_id: r.student_user_id ?? '',
        job_id: r.job_id ?? '',
        gross_job_price: Number(r.job_price_gross ?? 0),
        swifto_fee_withheld: Number(r.platform_fee ?? 0),
        stripe_fee: Number(r.stripe_processing_fee ?? 0),
        net_paid: Number(r.net_payout_to_student ?? 0),
        payout_status: r.payout_status ?? '',
        currency: r.currency ?? 'NZD',
      })
    }

    // Sheet 4: Daily_Summary
    const byDate: Record<string, { gross: number; platform: number; stripe: number; refund: number; payouts: number }> = {}
    for (const r of ledger) {
      const d = (r.created_at || '').toString().slice(0, 10)
      if (!d) continue
      if (!byDate[d]) byDate[d] = { gross: 0, platform: 0, stripe: 0, refund: 0, payouts: 0 }
      byDate[d].gross += Number(r.job_price_gross ?? 0)
      byDate[d].platform += Number(r.platform_fee ?? 0)
      byDate[d].stripe += Number(r.stripe_processing_fee ?? 0)
      byDate[d].refund += Number(r.refund_amount ?? 0)
      if (r.payout_status === 'released') {
        byDate[d].payouts += Number(r.net_payout_to_student ?? 0)
      }
    }
    const ws4 = workbook.addWorksheet('Daily_Summary')
    ws4.columns = [
      { header: 'date', key: 'date', width: 12 },
      { header: 'gross_volume', key: 'gross_volume', width: 14 },
      { header: 'platform_revenue', key: 'platform_revenue', width: 16 },
      { header: 'stripe_fees', key: 'stripe_fees', width: 12 },
      { header: 'refunds', key: 'refunds', width: 10 },
      { header: 'net_revenue', key: 'net_revenue', width: 12 },
      { header: 'payouts_sent', key: 'payouts_sent', width: 14 },
    ]
    ws4.getRow(1).font = { bold: true }
    for (const d of Object.keys(byDate).sort()) {
      const v = byDate[d]
      ws4.addRow({
        date: d,
        gross_volume: v.gross,
        platform_revenue: v.platform,
        stripe_fees: v.stripe,
        refunds: v.refund,
        net_revenue: v.platform - v.stripe - v.refund,
        payouts_sent: v.payouts,
      })
    }

    // Sheet 5: Student_Earnings_IRD (aggregate by student for IRD reporting)
    const byStudent: Record<string, number> = {}
    for (const r of ledger) {
      if (r.student_user_id && r.net_payout_to_student) {
        const id = r.student_user_id
        byStudent[id] = (byStudent[id] ?? 0) + Number(r.net_payout_to_student ?? 0)
      }
    }
    const ws5 = workbook.addWorksheet('Student_Earnings_IRD')
    ws5.columns = [
      { header: 'student_user_id', key: 'student_user_id', width: 38 },
      { header: 'total_earnings_nzd', key: 'total_earnings_nzd', width: 18 },
    ]
    ws5.getRow(1).font = { bold: true }
    for (const [sid, total] of Object.entries(byStudent)) {
      ws5.addRow({ student_user_id: sid, total_earnings_nzd: total })
    }

    if (format === 'csv') {
      const ws1 = workbook.getWorksheet('Transactions')
      const csvRows: string[] = []
      ws1?.eachRow((row, i) => {
        const vals = row.values as (string | number | null | undefined)[]
        if (vals && vals.length > 1) {
          const rowVals = vals.slice(1).map((v) => (v == null ? '' : `"${String(v).replace(/"/g, '""')}"`))
          csvRows.push(rowVals.join(','))
        }
      })
      const csv = csvRows.join('\n')
      const csvFilename = `swifto_ledger_${start}_to_${end}.csv`
      return new NextResponse(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${csvFilename}"`,
        },
      })
    }

    const buffer = await workbook.xlsx.writeBuffer()
    const filename = `swifto_ledger_${start}_to_${end}.xlsx`

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (e) {
    console.error('Export error:', e)
    return NextResponse.json({ error: 'Export failed' }, { status: 500 })
  }
}
