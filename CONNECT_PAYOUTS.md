# Stripe Connect withdrawals + lister card refunds

## What was built

- **Students:** Connect Express onboarding → withdraw earnings with a Stripe **Transfer** to their connected account.
- **Listers:** **Refund to card** for unused wallet balance (FIFO across deposit PaymentIntents). No Connect for listers.
- Wallet model unchanged: deposits → `balance_cents` → job completion still moves balances in the DB only.

## 1. Run this SQL in Supabase (required)

In **Supabase → SQL Editor**, run the full contents of:

`supabase_connect_refunds_migration.sql`

This adds:

- Connect columns on `profiles`
- `stripe_transfer_id` on `transactions`
- `refund` transaction type
- `debit_profile_balance` / `credit_profile_balance` helpers

Until this runs, withdraw/refund APIs will fail.

## 2. Stripe (already done on your side)

Testing webhook should listen for:

- `checkout.session.completed`
- `account.updated`
- `charge.refunded`
- `transfer.created`
- `transfer.updated`
- `transfer.reversed`

Destination: `https://swifto-testing.vercel.app/api/stripe/webhook`

## 3. Test locally

```bash
# Terminal A
npm run dev

# Terminal B — use the whsec_ it prints as STRIPE_WEBHOOK_SECRET in .env.local
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

### Student withdraw

1. Log in as a student with `balance_cents` ≥ 100 (complete a job in test, or set balance in Supabase).
2. Dashboard → **Withdraw earnings** → **Connect bank account** → finish Stripe test onboarding.
3. Withdraw ≥ $1 → check Stripe Dashboard → **Connect → Transfers** and `transactions` row `type=withdrawal` `status=succeeded`.

### Lister refund

1. Deposit via Checkout (test card `4242…`).
2. Dashboard → **Refund to card** for part/all of unused balance.
3. Confirm Stripe **Payments → Refunds** and a `transactions` row with `type=refund`.

## 4. Deploy notes

After merge/deploy to `swifto-testing`:

1. Confirm Vercel env has the same `STRIPE_WEBHOOK_SECRET` as that webhook destination.
2. Confirm migration was run on the linked Supabase project.
3. Platform Stripe balance must cover student Transfers (deposits fund the platform account).

## Key routes

| Route | Purpose |
|-------|---------|
| `POST /api/stripe/connect/onboard` | Express Account Link |
| `GET /api/stripe/connect/status` | Onboarding / payouts flags |
| `POST /api/stripe/request-withdrawal` | Debit + Transfer |
| `POST /api/stripe/request-refund` | Debit + Refunds API (FIFO) |
| `POST /api/stripe/webhook` | Deposit + Connect + transfer events |
