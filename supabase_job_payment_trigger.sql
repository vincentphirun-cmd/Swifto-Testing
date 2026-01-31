-- Job Payment Release - Run after both lister and student verify
-- This extends the completion flow to release payment (deduct lister, add student)

CREATE OR REPLACE FUNCTION release_job_payment_on_both_verified()
RETURNS TRIGGER AS $$
DECLARE
  job_price_cents INTEGER;
  lister_balance INTEGER;
BEGIN
  IF NEW.lister_verified_at IS NOT NULL AND NEW.student_verified_at IS NOT NULL THEN
    SELECT (price * 100)::INTEGER INTO job_price_cents FROM jobs WHERE id = NEW.job_id;
    SELECT balance_cents INTO lister_balance FROM profiles WHERE id = NEW.lister_id;
    
    IF job_price_cents IS NOT NULL AND job_price_cents > 0 THEN
      IF COALESCE(lister_balance, 0) < job_price_cents THEN
        RAISE EXCEPTION 'Insufficient balance: lister has % cents, job requires % cents', COALESCE(lister_balance, 0), job_price_cents;
      END IF;
      -- Deduct from lister
      UPDATE profiles SET balance_cents = balance_cents - job_price_cents WHERE id = NEW.lister_id;
      -- Add to student
      UPDATE profiles SET balance_cents = balance_cents + job_price_cents WHERE id = NEW.student_id;
      -- Record transactions
      INSERT INTO transactions (user_id, amount_cents, type, status, job_id, job_completion_id)
      VALUES (NEW.lister_id, -job_price_cents, 'job_payment_out', 'succeeded', NEW.job_id, NEW.id);
      INSERT INTO transactions (user_id, amount_cents, type, status, job_id, job_completion_id)
      VALUES (NEW.student_id, job_price_cents, 'job_payment_in', 'succeeded', NEW.job_id, NEW.id);
      -- Mark payment released
      NEW.payment_released_at := NOW();
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_release_job_payment ON job_completions;

CREATE TRIGGER trigger_release_job_payment
  BEFORE UPDATE ON job_completions
  FOR EACH ROW
  WHEN (OLD.student_verified_at IS NULL AND NEW.student_verified_at IS NOT NULL)
  EXECUTE FUNCTION release_job_payment_on_both_verified();
