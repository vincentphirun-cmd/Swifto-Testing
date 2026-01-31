-- Stripe / Payments Migration
-- Run this in Supabase SQL Editor for Phase 1 (balance + transactions)

-- 1.1 Add balance column to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS balance_cents INTEGER DEFAULT 0 CHECK (balance_cents >= 0);

-- 1.2 Create transactions table (ledger for deposits, job payments, withdrawals)
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount_cents INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('deposit', 'job_payment_in', 'job_payment_out', 'withdrawal')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'succeeded', 'failed')),
  stripe_payment_intent_id TEXT,
  stripe_payout_id TEXT,
  job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
  job_completion_id UUID REFERENCES job_completions(id) ON DELETE SET NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_stripe_payment_intent ON transactions(stripe_payment_intent_id) WHERE stripe_payment_intent_id IS NOT NULL;

-- RLS for transactions
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id);

-- Service role / API will insert/update; for direct client access you'd add:
-- CREATE POLICY "Users can insert own transactions" ... (or use API routes only)
