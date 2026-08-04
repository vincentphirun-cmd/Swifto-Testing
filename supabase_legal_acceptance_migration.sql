-- Legal acceptance timestamps for Terms/Privacy/Community + Payment/Payout agreements
-- Run in Supabase to allow gating actions until users acknowledge required documents.

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS accepted_terms_of_service_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS accepted_community_guidelines_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS acknowledged_privacy_statement_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS accepted_payment_terms_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS accepted_payout_terms_at TIMESTAMPTZ;

-- Helpful indexes for fast reads in client-side gating
CREATE INDEX IF NOT EXISTS idx_profiles_accepted_payment_terms_at
  ON profiles (accepted_payment_terms_at);
CREATE INDEX IF NOT EXISTS idx_profiles_accepted_payout_terms_at
  ON profiles (accepted_payout_terms_at);

