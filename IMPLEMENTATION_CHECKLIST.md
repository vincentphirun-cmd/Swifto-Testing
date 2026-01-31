# Swifto Web – Implementation Checklist

Use this whenever you ask: **"Where am I at and what do I need to do?"**

---

## Phase 0: Setup ✅ COMPLETE

| # | Task | Status |
|---|------|--------|
| 0.1 | Create Stripe account | ✅ |
| 0.2 | Create PostHog account | ✅ |
| 0.3 | Create Vercel account | ✅ |
| 0.4 | Push code to GitHub | ✅ |

---

## Phase 1: Database (Supabase) ✅ COMPLETE

| # | Task | Status |
|---|------|--------|
| 1.1 | Add balance column to profiles | ✅ |
| 1.2 | Create transactions table | ✅ |
| 1.3 | Run After Completion migration | ✅ |
| 1.4 | Run "Students can view applied jobs" policy | ✅ |

---

## Phase 2: Stripe Integration ✅ COMPLETE

| # | Task | Status |
|---|------|--------|
| 2.1 | Get Stripe API keys | ✅ |
| 2.2 | Add Stripe env vars to .env.local | ✅ |
| 2.3 | Install stripe + @stripe/stripe-js | ✅ |
| 2.4 | Build deposit flow (API + UI) | ✅ |
| 2.5 | Build webhook handler | ✅ |
| 2.6 | Set up Stripe webhook (local testing) | ⬜ |
| 2.7 | Wire Deposit Funds button | ✅ |
| 2.8 | Display real balances (replace $250/$455) | ✅ |
| 2.9 | Job payment logic on completion | ✅ |
| 2.10 | Build withdrawal flow | ✅ |
| 2.11 | Test full payment flow | ⬜ |

---

## Phase 3: PostHog Analytics ✅ COMPLETE

| # | Task | Status |
|---|------|--------|
| 3.1 | Install posthog-js | ✅ |
| 3.2 | Add PostHog provider | ✅ |
| 3.3 | Add PostHog env vars | ✅ |
| 3.4 | Wrap app in provider (layout.tsx) | ✅ |
| 3.5 | Add event tracking (signup, job_posted, etc.) | ✅ |

---

## Phase 4: Web Polish ✅ COMPLETE

| # | Task | Status |
|---|------|--------|
| 4.1 | Profile editing | ✅ |
| 4.2 | Search/filters on Browse Jobs | ✅ |
| 4.3 | Loading states & error handling | ✅ |
| 4.4 | Responsive QA | ✅ |

---

## Phase 5: Vercel Deployment ← YOU ARE HERE

| # | Task | Status |
|---|------|--------|
| 5.1 | Connect repo to Vercel | ⬜ |
| 5.2 | Add env vars in Vercel | ⬜ |
| 5.3 | Deploy | ⬜ |
| 5.4 | Configure Supabase auth redirect URLs | ⬜ |
| 5.5 | Configure Stripe production webhook | ⬜ |
| 5.6 | Custom domain (optional) | ⬜ |

**Code ready:** Stripe checkout uses `VERCEL_URL` for production success/cancel URLs. See `DEPLOYMENT.md` for step-by-step deployment instructions.

---

## Phase 6: Optional / Later

| # | Task | Status |
|---|------|--------|
| 6.1 | Klaviyo (email marketing) | ⬜ |
| 6.2 | Platform fee on job payments | ⬜ |
| 6.3 | Image uploads for jobs/profiles | ⬜ |
