-- Financial Ledger Write Path
-- Inserts ledger rows when job payout is released and when listing fee is charged.
-- Run after supabase_financial_ledger_migration.sql

-- 1. Update release_job_payment trigger to also insert into financial_ledger
CREATE OR REPLACE FUNCTION release_job_payment_on_both_verified()
RETURNS TRIGGER AS $$
DECLARE
  job_rec RECORD;
  job_price_nzd NUMERIC;
  job_price_cents INTEGER;
  platform_fee_cents INTEGER;
  student_payout_cents INTEGER;
  lister_balance INTEGER;
  stripe_fee_est NUMERIC;
BEGIN
  IF NEW.lister_verified_at IS NOT NULL AND NEW.student_verified_at IS NOT NULL THEN
    SELECT j.price, j.job_name, j.lister_id INTO job_rec FROM jobs j WHERE j.id = NEW.job_id;
    job_price_nzd := job_rec.price;
    job_price_cents := (job_price_nzd * 100)::INTEGER;
    platform_fee_cents := (get_platform_fee_nzd(job_price_nzd) * 100)::INTEGER;
    student_payout_cents := job_price_cents - platform_fee_cents;
    stripe_fee_est := ROUND((job_price_nzd * 0.0265 + 0.30)::numeric, 2);

    SELECT balance_cents INTO lister_balance FROM profiles WHERE id = NEW.lister_id;

    IF job_price_cents IS NOT NULL AND job_price_cents > 0 THEN
      IF COALESCE(lister_balance, 0) < job_price_cents THEN
        RAISE EXCEPTION 'Insufficient balance: lister has % cents, job requires % cents', COALESCE(lister_balance, 0), job_price_cents;
      END IF;
      UPDATE profiles SET balance_cents = balance_cents - job_price_cents WHERE id = NEW.lister_id;
      UPDATE profiles SET balance_cents = balance_cents + student_payout_cents WHERE id = NEW.student_id;
      UPDATE profiles SET total_earnings_cents = COALESCE(total_earnings_cents, 0) + student_payout_cents WHERE id = NEW.student_id;
      INSERT INTO transactions (user_id, amount_cents, type, status, job_id, job_completion_id)
      VALUES (NEW.lister_id, -job_price_cents, 'job_payment_out', 'succeeded', NEW.job_id, NEW.id);
      INSERT INTO transactions (user_id, amount_cents, type, status, job_id, job_completion_id, metadata)
      VALUES (NEW.student_id, student_payout_cents, 'job_payment_in', 'succeeded', NEW.job_id, NEW.id, jsonb_build_object('platform_fee_cents', platform_fee_cents));
      NEW.payment_released_at := NOW();

      -- Insert financial_ledger row (idempotent via job_completion id)
      INSERT INTO financial_ledger (
        idempotency_key, job_id, booking_id, lister_user_id, student_user_id, job_title,
        currency, job_price_gross, platform_fee, stripe_processing_fee, net_payout_to_student,
        payment_status, payout_status, notes
      ) VALUES (
        'job_payout_' || NEW.id, NEW.job_id, NEW.id, NEW.lister_id, NEW.student_id, job_rec.job_name,
        'NZD', job_price_nzd, (platform_fee_cents / 100.0)::numeric, stripe_fee_est,
        (student_payout_cents / 100.0)::numeric, 'paid', 'released', 'Job completion payout'
      )
      ON CONFLICT (idempotency_key) DO NOTHING;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add unique constraint on idempotency_key if not exists (for ON CONFLICT)
-- The table already has UNIQUE on idempotency_key from the migration

-- 2. Update deduct_listing_fee to also insert into financial_ledger
CREATE OR REPLACE FUNCTION deduct_listing_fee(p_user_id UUID, p_job_id UUID)
RETURNS void AS $$
DECLARE
  v_listing_fee_cents INTEGER := 99;
  v_rows INTEGER;
  v_job_title TEXT;
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

  SELECT job_name INTO v_job_title FROM jobs WHERE id = p_job_id;
  INSERT INTO financial_ledger (
    idempotency_key, job_id, lister_user_id, job_title, currency, job_price_gross,
    platform_fee, net_payout_to_student, payment_status, payout_status, notes
  ) VALUES (
    'listing_fee_' || p_job_id, p_job_id, p_user_id, COALESCE(v_job_title, ''), 'NZD', 0,
    0.99, 0, 'paid', 'released', 'Listing fee'
  )
  ON CONFLICT (idempotency_key) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION deduct_listing_fee(UUID, UUID) TO authenticated;
