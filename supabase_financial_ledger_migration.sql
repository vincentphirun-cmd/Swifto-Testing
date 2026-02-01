-- Financial Ledger - single source of truth for accounting export
-- Run after supabase_stripe_migration, supabase_platform_fee_migration, supabase_listing_fee_migration

CREATE TABLE IF NOT EXISTS financial_ledger (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  idempotency_key TEXT UNIQUE,
  job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
  booking_id UUID,
  lister_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  student_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  job_title TEXT,
  currency TEXT DEFAULT 'NZD',
  job_price_gross NUMERIC(12,2) NOT NULL DEFAULT 0,
  platform_fee NUMERIC(12,2) DEFAULT 0,
  stripe_processing_fee NUMERIC(12,2) DEFAULT 0,
  gst_on_platform_fee NUMERIC(12,2) DEFAULT 0,
  gst_on_job NUMERIC(12,2) DEFAULT 0,
  net_payout_to_student NUMERIC(12,2) DEFAULT 0,
  refund_amount NUMERIC(12,2) DEFAULT 0,
  payment_status TEXT CHECK (payment_status IN ('paid','refunded','partial')),
  payout_status TEXT CHECK (payout_status IN ('pending','released','failed')),
  stripe_payment_intent_id TEXT,
  stripe_charge_id TEXT,
  stripe_transfer_id TEXT,
  notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_financial_ledger_created_at ON financial_ledger(created_at);
CREATE INDEX IF NOT EXISTS idx_financial_ledger_job_id ON financial_ledger(job_id);
CREATE INDEX IF NOT EXISTS idx_financial_ledger_idempotency ON financial_ledger(idempotency_key) WHERE idempotency_key IS NOT NULL;

-- RLS: only service role can read/write (API uses admin client)
ALTER TABLE financial_ledger ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access to financial_ledger" ON financial_ledger
  FOR ALL USING (auth.role() = 'service_role');
