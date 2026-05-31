-- Fix: student verify completion fails with RLS on transactions
-- Run in Supabase SQL Editor after job payment / platform fee migrations.
--
-- Cause: release_job_payment_on_both_verified ran as the student (no SECURITY DEFINER),
-- so INSERT into transactions and UPDATE on other users' profiles were blocked by RLS.

-- Platform fee helper: $0.99 processing allocation + 5% Swifto fee on remainder
CREATE OR REPLACE FUNCTION get_swifto_service_fee_nzd(price_nzd NUMERIC)
RETURNS NUMERIC
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  remainder NUMERIC;
BEGIN
  IF price_nzd <= 0 THEN
    RETURN 0;
  END IF;
  remainder := price_nzd - 0.99;
  IF remainder <= 0 THEN
    RETURN 0;
  END IF;
  RETURN ROUND((remainder * 0.05)::numeric, 2);
END;
$$;

CREATE OR REPLACE FUNCTION get_platform_fee_nzd(price_nzd NUMERIC)
RETURNS NUMERIC AS $$
BEGIN
  IF price_nzd <= 0 THEN
    RETURN 0;
  END IF;
  RETURN ROUND((0.99 + get_swifto_service_fee_nzd(price_nzd))::numeric, 2);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Payment release: SECURITY DEFINER bypasses RLS for balances + transactions
CREATE OR REPLACE FUNCTION release_job_payment_on_both_verified()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  job_rec RECORD;
  job_price_nzd NUMERIC;
  job_price_cents INTEGER;
  platform_fee_cents INTEGER;
  student_payout_cents INTEGER;
  lister_balance INTEGER;
  stripe_fee_est NUMERIC;
  has_ledger BOOLEAN;
  has_total_earnings BOOLEAN;
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

      SELECT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'total_earnings_cents'
      ) INTO has_total_earnings;

      IF has_total_earnings THEN
        UPDATE profiles
        SET total_earnings_cents = COALESCE(total_earnings_cents, 0) + student_payout_cents
        WHERE id = NEW.student_id;
      END IF;

      INSERT INTO transactions (user_id, amount_cents, type, status, job_id, job_completion_id)
      VALUES (NEW.lister_id, -job_price_cents, 'job_payment_out', 'succeeded', NEW.job_id, NEW.id);

      INSERT INTO transactions (user_id, amount_cents, type, status, job_id, job_completion_id, metadata)
      VALUES (
        NEW.student_id,
        student_payout_cents,
        'job_payment_in',
        'succeeded',
        NEW.job_id,
        NEW.id,
        jsonb_build_object('platform_fee_cents', platform_fee_cents)
      );

      NEW.payment_released_at := NOW();

      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'financial_ledger'
      ) INTO has_ledger;

      IF has_ledger THEN
        INSERT INTO financial_ledger (
          idempotency_key, job_id, booking_id, lister_user_id, student_user_id, job_title,
          currency, job_price_gross, platform_fee, stripe_processing_fee, net_payout_to_student,
          payment_status, payout_status, notes
        ) VALUES (
          'job_payout_' || NEW.id,
          NEW.job_id,
          NEW.id,
          NEW.lister_id,
          NEW.student_id,
          job_rec.job_name,
          'NZD',
          job_price_nzd,
          (platform_fee_cents / 100.0)::numeric,
          stripe_fee_est,
          (student_payout_cents / 100.0)::numeric,
          'paid',
          'released',
          'Job completion payout'
        )
        ON CONFLICT (idempotency_key) DO NOTHING;
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- Mark job completed when both parties verified
CREATE OR REPLACE FUNCTION mark_job_completed_on_both_verified()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.lister_verified_at IS NOT NULL AND NEW.student_verified_at IS NOT NULL THEN
    UPDATE jobs SET status = 'completed', updated_at = NOW() WHERE id = NEW.job_id;
  END IF;
  RETURN NEW;
END;
$$;

-- Re-attach triggers (idempotent)
DROP TRIGGER IF EXISTS trigger_release_job_payment ON job_completions;
CREATE TRIGGER trigger_release_job_payment
  BEFORE UPDATE ON job_completions
  FOR EACH ROW
  WHEN (OLD.student_verified_at IS NULL AND NEW.student_verified_at IS NOT NULL)
  EXECUTE FUNCTION release_job_payment_on_both_verified();

DROP TRIGGER IF EXISTS trigger_mark_job_completed ON job_completions;
CREATE TRIGGER trigger_mark_job_completed
  AFTER UPDATE ON job_completions
  FOR EACH ROW
  WHEN (OLD.student_verified_at IS NULL AND NEW.student_verified_at IS NOT NULL)
  EXECUTE FUNCTION mark_job_completed_on_both_verified();
