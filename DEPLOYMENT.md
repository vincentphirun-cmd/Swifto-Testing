# Swifto – Vercel Deployment Guide

This guide walks you through deploying Swifto to Vercel and configuring production services.

---

## Step 1: Connect repo to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (or create an account).
2. Click **Add New** → **Project**.
3. Import your GitHub repository (e.g. `vincentphirun/swifto`).
4. Vercel will detect Next.js automatically.
5. Click **Deploy** (you can add env vars first, or after the first deploy).

---

## Step 2: Add environment variables in Vercel

In your Vercel project → **Settings** → **Environment Variables**, add:

| Variable | Value | Notes |
|----------|-------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://YOUR_PROJECT.supabase.co` | From Supabase Dashboard |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | From Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` | Same place (keep secret) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` or `pk_test_...` | From Stripe Dashboard |
| `STRIPE_SECRET_KEY` | `sk_live_...` or `sk_test_...` | Keep secret |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | From Stripe webhook (Step 5) |
| `NEXT_PUBLIC_POSTHOG_KEY` | `phc_...` | From PostHog (optional) |
| `NEXT_PUBLIC_POSTHOG_HOST` | `https://us.i.posthog.com` | Or EU host |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | site key | Cloudflare Turnstile (optional locally) |
| `TURNSTILE_SECRET_KEY` | secret key | Keep secret; required if site key is set |

Use **Production** environment for live; add **Preview** if you want preview deployments.

After deploy:

1. Run `supabase_security_hardening_migration.sql` in the Supabase SQL Editor.
2. Confirm **Storage → lister-id-docs** is **private** (not public).
3. Enable Supabase Auth rate limits (Dashboard → Authentication → Rate Limits / Attack protection).
4. Enable leaked password protection if offered in Auth settings.
5. Set `NEXT_PUBLIC_APP_URL=https://swifto.co.nz` so emails and Stripe always use HTTPS.
6. Scan Git history for leaked keys (`gitleaks`) and rotate any secret that was ever committed.
7. Have a lawyer review `/privacy` and `/terms` before public launch.

Vercel already redirects HTTP → HTTPS on custom domains. The app also sends HSTS and other security headers.

---

## Step 3: Deploy

1. After adding env vars, go to **Deployments**.
2. Redeploy (or push to `main` to trigger a new deploy).
3. Wait for the build to finish.
4. Your app will be live at `https://your-project.vercel.app`.

---

## Step 4: Configure Supabase auth redirect URLs

1. Go to [Supabase Dashboard](https://supabase.com/dashboard) → your project.
2. Open **Authentication** → **URL Configuration**.
3. Add these to **Redirect URLs**:
   - `https://your-project.vercel.app/auth/callback`
   - `https://your-project.vercel.app/**` (wildcard for subpaths)
4. Set **Site URL** to `https://your-project.vercel.app`.
5. Save.

If you use a custom domain later, add its callback URL too.

---

## Step 5: Configure Stripe production webhook

1. Go to [Stripe Dashboard](https://dashboard.stripe.com) → **Developers** → **Webhooks**.
2. Switch to **Live mode** (toggle top-right) for production.
3. Click **Add endpoint**.
4. **Endpoint URL**: `https://your-project.vercel.app/api/stripe/webhook`
5. **Events**: Select `checkout.session.completed`.
6. Create the endpoint.
7. Reveal the **Signing secret** (starts with `whsec_`).
8. Add it to Vercel env vars as `STRIPE_WEBHOOK_SECRET`.
9. Redeploy so the new secret is used.

---

## Step 6: Custom domain (optional)

1. In Vercel → **Settings** → **Domains**.
2. Add your domain (e.g. `swifto.app`).
3. Update DNS as instructed by Vercel.
4. Update Supabase redirect URLs and Stripe webhook URL to use the new domain.

---

## Troubleshooting

### Build fails

- Confirm all required env vars are set in Vercel.
- Check the build logs for missing dependencies or TypeScript errors.

### Auth redirect fails

- Ensure the production URL is in Supabase **Redirect URLs**.
- Ensure **Site URL** in Supabase matches your production URL.

### Stripe webhook fails

- Use the **Signing secret** from the correct endpoint (production vs test).
- Confirm the webhook URL matches your deployed app.
- Check Vercel function logs for webhook errors.

### "Failed to fetch" or network errors

- Supabase and Stripe env vars must be set correctly.
- Ensure you use the **anon** key, not the service role, for `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
