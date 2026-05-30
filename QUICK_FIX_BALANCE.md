# Balance not updating automatically after deposit?

The app credits your balance when Stripe sends a **webhook** after checkout. The balance will show the correct amount automatically **only if** that webhook is called with the right secret.

## 1. Use one amount from start to finish

- You enter **$20** in the deposit modal.
- The app sends **2000** (cents) to the API and Stripe stores it in the checkout session.
- When you pay, Stripe sends `checkout.session.completed` to our webhook with `metadata.amount_cents: "2000"`.
- The webhook credits **2000** cents to your profile → dashboard shows **$20.00**.

So the same number (2000) is used everywhere; the balance should match what you deposited.

## 2. Why the balance might not update (or show the wrong amount)

Stripe only sends events to webhooks that exist in the **same mode** (Test or Live) as the payment.

- You’re using **test** keys (`sk_test_...`) and paying in **test** mode.
- So you need a webhook that was **created in Test mode** in the Stripe Dashboard.
- The **Signing secret** of that Test webhook must be set as **`STRIPE_WEBHOOK_SECRET`** in Vercel (and in `.env.local` for local dev).

If that’s wrong or missing, the webhook either never runs or fails verification, and the balance doesn’t update.

## 3. Checklist so the balance updates automatically

1. **Stripe Dashboard** → switch to **Test mode** (top-right).
2. **Developers** → **Webhooks** → **Add endpoint** (or **Add destination**).
3. **Endpoint URL:** `https://your-vercel-app.vercel.app/api/stripe/webhook`
4. **Events:** at least **`checkout.session.completed`**.
5. Create it and copy the **Signing secret** (`whsec_...`).
6. **Vercel** → your project → **Settings** → **Environment Variables** → set **`STRIPE_WEBHOOK_SECRET`** to that secret.
7. **Redeploy** the app.

After that, when you deposit (e.g. $20), Stripe will call your webhook, and the dashboard balance will update to the correct amount automatically.

## 4. One-time fix for current balance (optional)

If you already paid but the balance never updated (e.g. webhook wasn’t set up), you can fix the stored value once:

1. [Supabase Dashboard](https://supabase.com/dashboard) → your project → **Table Editor** → **`profiles`**.
2. Find your lister row and set **`balance_cents`** to the amount in cents (e.g. **2000** for $20).
3. Save. Refresh the app; the balance will show that amount.
