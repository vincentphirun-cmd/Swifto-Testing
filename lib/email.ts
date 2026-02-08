import { Resend } from 'resend'

const resendApiKey = process.env.RESEND_API_KEY
const fromEmail = process.env.RESEND_FROM_EMAIL || 'Swifto <onboarding@resend.dev>'
const appUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://swifto.co.nz')

function getResend() {
  if (!resendApiKey) return null
  return new Resend(resendApiKey)
}

function htmlWrap(title: string, body: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${escapeHtml(title)}</title></head>
<body style="font-family: system-ui, sans-serif; line-height: 1.5; color: #1a1a1a; max-width: 560px; margin: 0 auto; padding: 24px;">
  <h1 style="color: #0d9488; font-size: 1.5rem;">Swifto</h1>
  ${body}
  <p style="margin-top: 32px; font-size: 0.875rem; color: #666;">You received this email because you use Swifto.</p>
</body>
</html>`
}

function escapeHtml(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function sendWelcome(toEmail: string, firstName?: string): Promise<void> {
  const r = getResend()
  if (!r) return
  const name = firstName?.trim() || 'there'
  const body = `
    <p>Kia ora ${escapeHtml(name)},</p>
    <p>Your Swifto account has been successfully created. You can now log in and get started.</p>
    <p><a href="${appUrl}/login" style="color: #0d9488;">Log in to Swifto</a></p>
  `
  await r.emails.send({ from: fromEmail, to: [toEmail], subject: 'Welcome to Swifto', html: htmlWrap('Welcome', body) })
}

export async function sendNewJobToStudents(emails: string[], jobName: string, category: string, area: string, price: string): Promise<void> {
  const r = getResend()
  if (!r || emails.length === 0) return
  const body = `
    <p>A new job has been listed on Swifto.</p>
    <p><strong>${escapeHtml(jobName)}</strong><br/>${escapeHtml(category)} · ${escapeHtml(area)} · ${escapeHtml(price)}</p>
    <p><a href="${appUrl}/browse" style="color: #0d9488;">Browse jobs</a></p>
  `
  for (const to of emails) {
    await r.emails.send({ from: fromEmail, to: [to], subject: `New job: ${jobName}`, html: htmlWrap('New job', body) })
  }
}

export async function sendApplicationReceived(listerEmail: string, jobName: string, applicantName: string): Promise<void> {
  const r = getResend()
  if (!r) return
  const body = `
    <p>You have a new application for your job <strong>${escapeHtml(jobName)}</strong>.</p>
    <p>Applicant: ${escapeHtml(applicantName || 'A student')}</p>
    <p><a href="${appUrl}/dashboard/lister/jobs-listed" style="color: #0d9488;">View applications</a></p>
  `
  await r.emails.send({ from: fromEmail, to: [listerEmail], subject: `New application for ${jobName}`, html: htmlWrap('New application', body) })
}

export async function sendApplicationAccepted(studentEmail: string, jobName: string): Promise<void> {
  const r = getResend()
  if (!r) return
  const body = `
    <p>Good news — you've been accepted for the job <strong>${escapeHtml(jobName)}</strong>.</p>
    <p><a href="${appUrl}/dashboard/student/jobs-applied" style="color: #0d9488;">View your jobs</a></p>
  `
  await r.emails.send({ from: fromEmail, to: [studentEmail], subject: `You're accepted: ${jobName}`, html: htmlWrap('Accepted', body) })
}

export async function sendApplicationNotSelected(studentEmail: string, jobName: string): Promise<void> {
  const r = getResend()
  if (!r) return
  const body = `
    <p>Another provider was chosen for the job <strong>${escapeHtml(jobName)}</strong>.</p>
    <p><a href="${appUrl}/browse" style="color: #0d9488;">Browse more jobs</a></p>
  `
  await r.emails.send({ from: fromEmail, to: [studentEmail], subject: `Update: ${jobName}`, html: htmlWrap('Application update', body) })
}

export async function sendDepositSuccess(toEmail: string, amountNzd: string): Promise<void> {
  const r = getResend()
  if (!r) return
  const body = `
    <p>Your deposit of <strong>${escapeHtml(amountNzd)}</strong> was successful. Your balance has been updated.</p>
    <p><a href="${appUrl}/dashboard/lister" style="color: #0d9488;">View dashboard</a></p>
  `
  await r.emails.send({ from: fromEmail, to: [toEmail], subject: 'Deposit successful', html: htmlWrap('Deposit successful', body) })
}

export async function sendWithdrawalRequested(toEmail: string, amountNzd: string): Promise<void> {
  const r = getResend()
  if (!r) return
  const body = `
    <p>We've received your withdrawal request for <strong>${escapeHtml(amountNzd)}</strong>. We'll process it as soon as possible.</p>
    <p><a href="${appUrl}/dashboard/student" style="color: #0d9488;">View dashboard</a></p>
  `
  await r.emails.send({ from: fromEmail, to: [toEmail], subject: 'Withdrawal request received', html: htmlWrap('Withdrawal requested', body) })
}

export async function sendWithdrawalCompleted(toEmail: string, amountNzd: string): Promise<void> {
  const r = getResend()
  if (!r) return
  const body = `
    <p>Your withdrawal of <strong>${escapeHtml(amountNzd)}</strong> has been sent to your bank account.</p>
    <p><a href="${appUrl}/dashboard/student" style="color: #0d9488;">View dashboard</a></p>
  `
  await r.emails.send({ from: fromEmail, to: [toEmail], subject: 'Withdrawal completed', html: htmlWrap('Withdrawal completed', body) })
}

export async function sendPayoutToStudent(toEmail: string, amountNzd: string, jobName: string): Promise<void> {
  const r = getResend()
  if (!r) return
  const body = `
    <p>Your payout of <strong>${escapeHtml(amountNzd)}</strong> for the job <strong>${escapeHtml(jobName)}</strong> has been processed and is on its way to you.</p>
    <p><a href="${appUrl}/dashboard/student/jobs-completed" style="color: #0d9488;">View completed jobs</a></p>
  `
  await r.emails.send({ from: fromEmail, to: [toEmail], subject: `Payout processed: ${jobName}`, html: htmlWrap('Payout processed', body) })
}

export async function sendJobCompleted(toEmail: string, jobName: string, role: 'lister' | 'student'): Promise<void> {
  const r = getResend()
  if (!r) return
  const body = role === 'lister'
    ? `<p>The job <strong>${escapeHtml(jobName)}</strong> has been marked complete. Payment has been released to the provider.</p><p><a href="${appUrl}/dashboard/lister/jobs-completed" style="color: #0d9488;">View completed jobs</a></p>`
    : `<p>The job <strong>${escapeHtml(jobName)}</strong> has been marked complete. Your payout has been released.</p><p><a href="${appUrl}/dashboard/student/jobs-completed" style="color: #0d9488;">View completed jobs</a></p>`
  await r.emails.send({ from: fromEmail, to: [toEmail], subject: `Job completed: ${jobName}`, html: htmlWrap('Job completed', body) })
}

export async function sendStudentCancelled(listerEmail: string, jobName: string, studentName: string): Promise<void> {
  const r = getResend()
  if (!r) return
  const body = `
    <p>The provider (${escapeHtml(studentName || 'A student')}) has cancelled for the job <strong>${escapeHtml(jobName)}</strong>. The listing is open again for new applications.</p>
    <p><a href="${appUrl}/dashboard/lister/jobs-listed" style="color: #0d9488;">View your jobs</a></p>
  `
  await r.emails.send({ from: fromEmail, to: [listerEmail], subject: `Cancellation: ${jobName}`, html: htmlWrap('Job cancelled', body) })
}

export async function sendListingFeeCharged(toEmail: string, jobName: string, amountNzd: string): Promise<void> {
  const r = getResend()
  if (!r) return
  const body = `
    <p>A listing fee of <strong>${escapeHtml(amountNzd)}</strong> was charged for your job <strong>${escapeHtml(jobName)}</strong>.</p>
    <p><a href="${appUrl}/dashboard/lister/jobs-listed" style="color: #0d9488;">View your jobs</a></p>
  `
  await r.emails.send({ from: fromEmail, to: [toEmail], subject: `Listing fee charged: ${jobName}`, html: htmlWrap('Listing fee', body) })
}

export async function sendJobStartingReminder(toEmail: string, jobName: string, startTime: string, role: 'lister' | 'student'): Promise<void> {
  const r = getResend()
  if (!r) return
  const body = role === 'lister'
    ? `<p>Reminder: the job <strong>${escapeHtml(jobName)}</strong> is scheduled to start around ${escapeHtml(startTime)}.</p><p><a href="${appUrl}/dashboard/lister/jobs-listed" style="color: #0d9488;">View job</a></p>`
    : `<p>Reminder: the job <strong>${escapeHtml(jobName)}</strong> is scheduled to start around ${escapeHtml(startTime)}.</p><p><a href="${appUrl}/dashboard/student/jobs-applied" style="color: #0d9488;">View job</a></p>`
  await r.emails.send({ from: fromEmail, to: [toEmail], subject: `Reminder: ${jobName} starts soon`, html: htmlWrap('Job reminder', body) })
}
