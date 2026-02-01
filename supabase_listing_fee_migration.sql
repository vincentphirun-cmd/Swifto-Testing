-- Listing fee: $0.99 charged to lister when posting a job
-- 1. Add 'listing_fee' to transactions type constraint
-- 2. Function to deduct listing fee and record transaction

-- Drop existing type constraint and re-add with listing_fee
ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_type_check;

-- Re-add with listing_fee
ALTER TABLE transactions ADD CONSTRAINT transactions_type_check
  CHECK (type IN ('deposit', 'job_payment_in', 'job_payment_out', 'withdrawal', 'listing_fee'));

-- Function: deduct listing fee from lister balance, record transaction
CREATE OR REPLACE FUNCTION deduct_listing_fee(p_user_id UUID, p_job_id UUID)
RETURNS void AS $$
DECLARE
  v_listing_fee_cents INTEGER := 99;
  v_rows INTEGER;
BEGIN
  IF auth.uid() IS NULL OR auth.uid() != p_user_id THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  UPDATE profiles
  SET balance_cents = balance_cents - v_listing_fee_cents
  WHERE id = p_user_id AND balance_cents >= v_listing_fee_cents;

  GET DIAGNOSTICS v_rows = ROW_COUNT;
  IF v_rows = 0 THEN
    RAISE EXCEPTION 'Insufficient balance: need at least $0.99 to list a job';
  END IF;

  INSERT INTO transactions (user_id, amount_cents, type, status, job_id)
  VALUES (p_user_id, -v_listing_fee_cents, 'listing_fee', 'succeeded', p_job_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION deduct_listing_fee(UUID, UUID) TO authenticated;
