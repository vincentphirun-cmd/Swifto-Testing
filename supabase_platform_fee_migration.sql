-- Platform Fee Migration
-- Withhold Swifto platform fee from student payout on job completion.
-- Fee model: $0.99 processing allocation + 5% of (price - $0.99)

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

-- Update job payment release to withhold platform fee from student
CREATE OR REPLACE FUNCTION release_job_payment_on_both_verified()
RETURNS TRIGGER AS $$
DECLARE
  job_price_nzd NUMERIC;
  job_price_cents INTEGER;
  platform_fee_cents INTEGER;
  student_payout_cents INTEGER;
  lister_balance INTEGER;
BEGIN
  IF NEW.lister_verified_at IS NOT NULL AND NEW.student_verified_at IS NOT NULL THEN
    SELECT price INTO job_price_nzd FROM jobs WHERE id = NEW.job_id;
    job_price_cents := (job_price_nzd * 100)::INTEGER;
    platform_fee_cents := (get_platform_fee_nzd(job_price_nzd) * 100)::INTEGER;
    student_payout_cents := job_price_cents - platform_fee_cents;

    SELECT balance_cents INTO lister_balance FROM profiles WHERE id = NEW.lister_id;

    IF job_price_cents IS NOT NULL AND job_price_cents > 0 THEN
      IF COALESCE(lister_balance, 0) < job_price_cents THEN
        RAISE EXCEPTION 'Insufficient balance: lister has % cents, job requires % cents', COALESCE(lister_balance, 0), job_price_cents;
      END IF;
      -- Deduct full job price from lister
      UPDATE profiles SET balance_cents = balance_cents - job_price_cents WHERE id = NEW.lister_id;
      -- Add (price - platform fee) to student (fee withheld)
      UPDATE profiles SET balance_cents = balance_cents + student_payout_cents WHERE id = NEW.student_id;
      -- Record transactions
      INSERT INTO transactions (user_id, amount_cents, type, status, job_id, job_completion_id)
      VALUES (NEW.lister_id, -job_price_cents, 'job_payment_out', 'succeeded', NEW.job_id, NEW.id);
      INSERT INTO transactions (user_id, amount_cents, type, status, job_id, job_completion_id, metadata)
      VALUES (NEW.student_id, student_payout_cents, 'job_payment_in', 'succeeded', NEW.job_id, NEW.id, jsonb_build_object('platform_fee_cents', platform_fee_cents));
      -- Mark payment released
      NEW.payment_released_at := NOW();
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trigger_release_job_payment ON job_completions;

CREATE TRIGGER trigger_release_job_payment
  BEFORE UPDATE ON job_completions
  FOR EACH ROW
  WHEN (OLD.student_verified_at IS NULL AND NEW.student_verified_at IS NOT NULL)
  EXECUTE FUNCTION release_job_payment_on_both_verified();
