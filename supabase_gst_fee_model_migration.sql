-- GST-aware Swifto fee model
-- Transaction 1: listing fee $0.99 ex GST + $0.15 GST = $1.14 at post
-- Transaction 2: job price GST-inclusive; student payout uses gst_registered on profiles
-- Run in Supabase SQL Editor after prior fee / ledger migrations.

-- Helpers (mirror lib/fees.ts)
CREATE OR REPLACE FUNCTION get_service_ex_gst_nzd(price_nzd NUMERIC)
RETURNS NUMERIC
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  IF price_nzd <= 0 THEN
    RETURN 0;
  END IF;
  RETURN ROUND((price_nzd / 1.15)::numeric, 2);
END;
$$;

CREATE OR REPLACE FUNCTION get_gst_in_job_nzd(price_nzd NUMERIC)
RETURNS NUMERIC
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  IF price_nzd <= 0 THEN
    RETURN 0;
  END IF;
  RETURN ROUND((price_nzd - get_service_ex_gst_nzd(price_nzd))::numeric, 2);
END;
$$;

CREATE OR REPLACE FUNCTION get_swifto_service_fee_nzd(price_nzd NUMERIC)
RETURNS NUMERIC
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  IF price_nzd <= 0 THEN
    RETURN 0;
  END IF;
  RETURN ROUND((price_nzd * 0.075)::numeric, 2);
END;
$$;

CREATE OR REPLACE FUNCTION get_flat_rate_credit_nzd(
  price_nzd NUMERIC,
  gst_registered BOOLEAN
)
RETURNS NUMERIC
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  IF price_nzd <= 0 OR COALESCE(gst_registered, false) THEN
    RETURN 0;
  END IF;
  RETURN ROUND((get_service_ex_gst_nzd(price_nzd) * 0.085)::numeric, 2);
END;
$$;

CREATE OR REPLACE FUNCTION get_student_payout_nzd(
  price_nzd NUMERIC,
  gst_registered BOOLEAN DEFAULT false
)
RETURNS NUMERIC
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  IF price_nzd <= 0 THEN
    RETURN 0;
  END IF;
  RETURN ROUND((
    get_service_ex_gst_nzd(price_nzd)
    + get_flat_rate_credit_nzd(price_nzd, gst_registered)
    - get_swifto_service_fee_nzd(price_nzd)
  )::numeric, 2);
END;
$$;

CREATE OR REPLACE FUNCTION get_platform_fee_nzd(price_nzd NUMERIC)
RETURNS NUMERIC
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  RETURN get_swifto_service_fee_nzd(price_nzd);
END;
$$;

-- Listing fee: $1.14 incl. GST
CREATE OR REPLACE FUNCTION deduct_listing_fee(p_user_id UUID, p_job_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_listing_fee_cents INTEGER := 114;
  v_fee_ex_gst NUMERIC := 0.99;
  v_gst_on_fee NUMERIC := 0.15;
  v_rows INTEGER;
  v_job_title TEXT;
  has_ledger BOOLEAN;
BEGIN
  IF auth.uid() IS NULL OR auth.uid() != p_user_id THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  UPDATE profiles
  SET balance_cents = balance_cents - v_listing_fee_cents
  WHERE id = p_user_id AND balance_cents >= v_listing_fee_cents;

  GET DIAGNOSTICS v_rows = ROW_COUNT;
  IF v_rows = 0 THEN
    RAISE EXCEPTION 'Insufficient balance: need at least $1.14 to list a job';
  END IF;

  INSERT INTO transactions (user_id, amount_cents, type, status, job_id)
  VALUES (p_user_id, -v_listing_fee_cents, 'listing_fee', 'succeeded', p_job_id);

  SELECT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'financial_ledger'
  ) INTO has_ledger;

  IF has_ledger THEN
    SELECT job_name INTO v_job_title FROM jobs WHERE id = p_job_id;
    INSERT INTO financial_ledger (
      idempotency_key, job_id, lister_user_id, job_title, currency, job_price_gross,
      platform_fee, gst_on_platform_fee, net_payout_to_student, payment_status, payout_status, notes
    ) VALUES (
      'listing_fee_' || p_job_id,
      p_job_id,
      p_user_id,
      COALESCE(v_job_title, ''),
      'NZD',
      0,
      v_fee_ex_gst,
      v_gst_on_fee,
      0,
      'paid',
      'released',
      'Listing fee'
    )
    ON CONFLICT (idempotency_key) DO NOTHING;
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION deduct_listing_fee(UUID, UUID) TO authenticated;

-- Job payout release (GST-aware student payout)
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
  swifto_fee_nzd NUMERIC;
  gst_in_job_nzd NUMERIC;
  flat_rate_credit_nzd NUMERIC;
  student_payout_nzd NUMERIC;
  student_payout_cents INTEGER;
  lister_balance INTEGER;
  stripe_fee_est NUMERIC;
  student_gst_registered BOOLEAN;
  has_ledger BOOLEAN;
  has_total_earnings BOOLEAN;
BEGIN
  IF NEW.lister_verified_at IS NOT NULL AND NEW.student_verified_at IS NOT NULL THEN
    SELECT j.price, j.job_name, j.lister_id INTO job_rec FROM jobs j WHERE j.id = NEW.job_id;
    job_price_nzd := job_rec.price;
    job_price_cents := (job_price_nzd * 100)::INTEGER;

    SELECT COALESCE(gst_registered, false) INTO student_gst_registered
    FROM profiles WHERE id = NEW.student_id;

    swifto_fee_nzd := get_swifto_service_fee_nzd(job_price_nzd);
    gst_in_job_nzd := get_gst_in_job_nzd(job_price_nzd);
    flat_rate_credit_nzd := get_flat_rate_credit_nzd(job_price_nzd, student_gst_registered);
    student_payout_nzd := get_student_payout_nzd(job_price_nzd, student_gst_registered);
    student_payout_cents := (student_payout_nzd * 100)::INTEGER;
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
        jsonb_build_object(
          'swifto_fee_cents', (swifto_fee_nzd * 100)::INTEGER,
          'flat_rate_credit_cents', (flat_rate_credit_nzd * 100)::INTEGER,
          'gst_in_job_cents', (gst_in_job_nzd * 100)::INTEGER,
          'gst_registered', student_gst_registered
        )
      );

      NEW.payment_released_at := NOW();

      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'financial_ledger'
      ) INTO has_ledger;

      IF has_ledger THEN
        INSERT INTO financial_ledger (
          idempotency_key, job_id, booking_id, lister_user_id, student_user_id, job_title,
          currency, job_price_gross, platform_fee, stripe_processing_fee,
          gst_on_platform_fee, gst_on_job, net_payout_to_student,
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
          swifto_fee_nzd,
          stripe_fee_est,
          0,
          gst_in_job_nzd,
          student_payout_nzd,
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

DROP TRIGGER IF EXISTS trigger_release_job_payment ON job_completions;
CREATE TRIGGER trigger_release_job_payment
  BEFORE UPDATE ON job_completions
  FOR EACH ROW
  WHEN (OLD.student_verified_at IS NULL AND NEW.student_verified_at IS NOT NULL)
  EXECUTE FUNCTION release_job_payment_on_both_verified();
