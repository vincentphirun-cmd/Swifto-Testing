# Email (Resend) setup

Transactional emails are sent via [Resend](https://resend.com). If `RESEND_API_KEY` is not set, all send functions no-op (no errors).

## Env vars

- **RESEND_API_KEY** – from Resend dashboard (required for sending).
- **RESEND_FROM_EMAIL** – e.g. `Swifto <notifications@yourdomain.com>`. Defaults to `onboarding@resend.dev` for testing.
- **NEXT_PUBLIC_APP_URL** – base URL for links in emails (optional; defaults to Vercel URL in prod).

## Flows implemented

| Event | Recipient | When |
|-------|-----------|------|
| Account created | New user | Auth callback after profile creation (new signup) |
| Lister lists a job | All students (up to 200) | After post-job success (client calls API) |
| Listing fee charged | Lister | After post-job success (client calls API) |
| Student applies | Lister | After application insert (client calls API) |
| Lister accepts student | Accepted student | Accept-application API |
| Lister accepts student | Not-selected students | Accept-application API |
| Deposit success | Lister | Stripe webhook `checkout.session.completed` |
| Withdrawal requested | Student | Request-withdrawal API |
| Withdrawal completed | Student | (Wire when Stripe payout webhook is added) |
| Payout to student | Student | Supabase DB webhook on `transactions` INSERT `job_payment_in` |
| Job completed (both verified) | Lister + student | After verify-completion (client calls API, idempotent) |
| Student cancels | Lister | Cancel-application API |
| Job starting in 24h | Lister + accepted student | Vercel Cron (daily 8:00 UTC) |

## Supabase: payout webhook

To send “payout to student” emails when the DB trigger inserts a `job_payment_in` transaction:

1. Supabase Dashboard → Database → Webhooks.
2. New webhook: table `transactions`, event **Insert**.
3. URL: `https://<your-app>/api/webhooks/supabase/transaction`.
4. Add header: `Authorization: Bearer <SUPABASE_WEBHOOK_SECRET>` (set `SUPABASE_WEBHOOK_SECRET` in env).
5. Payload: include the new row so the route receives `record.type`, `record.user_id`, `record.amount_cents`, `record.job_id`.

## Vercel Cron: job reminders

- Cron runs daily at 8:00 UTC (`vercel.json`).
- Set **CRON_SECRET** in Vercel env; Vercel sends `Authorization: Bearer <CRON_SECRET>` to the cron route.
- Route: `GET /api/cron/job-reminders`.

## Optional migration

Run `supabase_completion_emails_migration.sql` to add `job_completions.completion_emails_sent_at`. This prevents “job completed” emails from being sent more than once when both parties verify.
