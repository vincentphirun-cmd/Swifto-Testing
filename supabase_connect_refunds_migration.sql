-- Stripe Connect (student withdrawals) + lister card refunds
-- Run in Supabase SQL Editor after existing Stripe migrations.

-- 1. Connect fields on profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS stripe_connect_account_id TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS stripe_connect_details_submitted BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS stripe_connect_payouts_enabled BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS stripe_connect_charges_enabled BOOLEAN DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_profiles_stripe_connect_account
  ON profiles(stripe_connect_account_id)
  WHERE stripe_connect_account_id IS NOT NULL;

-- 2. Transfer id on transactions (withdrawals)
ALTER TABLE transactions
  ADD COLUMN IF NOT EXISTS stripe_transfer_id TEXT;

CREATE INDEX IF NOT EXISTS idx_transactions_stripe_transfer
  ON transactions(stripe_transfer_id)
  WHERE stripe_transfer_id IS NOT NULL;

-- 3. Allow refund transaction type
ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_type_check;
ALTER TABLE transactions ADD CONSTRAINT transactions_type_check
  CHECK (type IN (
    'deposit',
    'job_payment_in',
    'job_payment_out',
    'withdrawal',
    'listing_fee',
    'refund'
  ));

-- 4. Atomic debit helper (service role / SECURITY DEFINER)
CREATE OR REPLACE FUNCTION debit_profile_balance(p_user_id UUID, p_amount_cents INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_new_balance INTEGER;
BEGIN
  IF p_amount_cents IS NULL OR p_amount_cents < 1 THEN
    RAISE EXCEPTION 'Invalid amount';
  END IF;

  UPDATE profiles
  SET balance_cents = balance_cents - p_amount_cents
  WHERE id = p_user_id
    AND balance_cents >= p_amount_cents
  RETURNING balance_cents INTO v_new_balance;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient balance';
  END IF;

  RETURN v_new_balance;
END;
$$;

-- 5. Credit helper for rollbacks
CREATE OR REPLACE FUNCTION credit_profile_balance(p_user_id UUID, p_amount_cents INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_new_balance INTEGER;
BEGIN
  IF p_amount_cents IS NULL OR p_amount_cents < 1 THEN
    RAISE EXCEPTION 'Invalid amount';
  END IF;

  UPDATE profiles
  SET balance_cents = balance_cents + p_amount_cents
  WHERE id = p_user_id
  RETURNING balance_cents INTO v_new_balance;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Profile not found';
  END IF;

  RETURN v_new_balance;
END;
$$;

REVOKE ALL ON FUNCTION debit_profile_balance(UUID, INTEGER) FROM PUBLIC;
REVOKE ALL ON FUNCTION credit_profile_balance(UUID, INTEGER) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION debit_profile_balance(UUID, INTEGER) TO service_role;
GRANT EXECUTE ON FUNCTION credit_profile_balance(UUID, INTEGER) TO service_role;
