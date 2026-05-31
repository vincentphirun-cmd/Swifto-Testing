-- Job chat: opens on accept, closes on payment release or cancellation, archives after 90 days.
-- Run in Supabase SQL Editor after job_applications / payment migrations.

-- ============================================================================
-- TABLES
-- ============================================================================
CREATE TABLE IF NOT EXISTS job_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL UNIQUE REFERENCES jobs(id) ON DELETE CASCADE,
  lister_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  closed_at TIMESTAMPTZ,
  archived_at TIMESTAMPTZ,
  last_message_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_job_conversations_lister_id ON job_conversations(lister_id);
CREATE INDEX IF NOT EXISTS idx_job_conversations_student_id ON job_conversations(student_id);
CREATE INDEX IF NOT EXISTS idx_job_conversations_closed_at ON job_conversations(closed_at);
CREATE INDEX IF NOT EXISTS idx_job_conversations_archived_at ON job_conversations(archived_at);

CREATE TABLE IF NOT EXISTS job_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES job_conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  body TEXT NOT NULL CHECK (char_length(trim(body)) > 0 AND char_length(body) <= 4000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_job_messages_conversation_id ON job_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_job_messages_created_at ON job_messages(created_at);

-- ============================================================================
-- HELPERS
-- ============================================================================
CREATE OR REPLACE FUNCTION close_job_conversation(p_job_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE job_conversations
  SET closed_at = NOW()
  WHERE job_id = p_job_id AND closed_at IS NULL;
END;
$$;

CREATE OR REPLACE FUNCTION archive_job_conversations_past_retention()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count INTEGER;
BEGIN
  UPDATE job_conversations
  SET archived_at = NOW()
  WHERE closed_at IS NOT NULL
    AND archived_at IS NULL
    AND closed_at < NOW() - INTERVAL '90 days';

  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$;

-- ============================================================================
-- TRIGGERS: open on accept, close on cancel
-- ============================================================================
CREATE OR REPLACE FUNCTION create_conversation_on_application_accepted()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_lister_id UUID;
BEGIN
  IF NEW.status = 'accepted' AND (OLD.status IS NULL OR OLD.status IS DISTINCT FROM 'accepted') THEN
    SELECT lister_id INTO v_lister_id FROM jobs WHERE id = NEW.job_id;
    IF v_lister_id IS NOT NULL THEN
      INSERT INTO job_conversations (job_id, lister_id, student_id)
      VALUES (NEW.job_id, v_lister_id, NEW.student_id)
      ON CONFLICT (job_id) DO NOTHING;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_create_conversation_on_accept ON job_applications;
CREATE TRIGGER trigger_create_conversation_on_accept
  AFTER UPDATE OF status ON job_applications
  FOR EACH ROW
  WHEN (NEW.status = 'accepted' AND OLD.status IS DISTINCT FROM 'accepted')
  EXECUTE FUNCTION create_conversation_on_application_accepted();

CREATE OR REPLACE FUNCTION close_conversation_on_application_cancelled()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'cancelled' AND (OLD.status IS NULL OR OLD.status IS DISTINCT FROM 'cancelled') THEN
    PERFORM close_job_conversation(NEW.job_id);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_close_conversation_on_cancel ON job_applications;
CREATE TRIGGER trigger_close_conversation_on_cancel
  AFTER UPDATE OF status ON job_applications
  FOR EACH ROW
  WHEN (NEW.status = 'cancelled' AND OLD.status IS DISTINCT FROM 'cancelled')
  EXECUTE FUNCTION close_conversation_on_application_cancelled();

-- Backfill conversations for already-accepted applications (optional, idempotent)
INSERT INTO job_conversations (job_id, lister_id, student_id)
SELECT ja.job_id, j.lister_id, ja.student_id
FROM job_applications ja
JOIN jobs j ON j.id = ja.job_id
WHERE ja.status = 'accepted'
ON CONFLICT (job_id) DO NOTHING;

-- Close conversations for jobs that already had payment released
UPDATE job_conversations c
SET closed_at = jc.payment_released_at
FROM job_completions jc
WHERE jc.job_id = c.job_id
  AND jc.payment_released_at IS NOT NULL
  AND c.closed_at IS NULL;

-- ============================================================================
-- RLS
-- ============================================================================
ALTER TABLE job_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_messages ENABLE ROW LEVEL SECURITY;

-- Participants can view active (non-closed) conversations only
CREATE POLICY "Participants view active conversations" ON job_conversations
  FOR SELECT
  USING (
    closed_at IS NULL
    AND (lister_id = auth.uid() OR student_id = auth.uid())
  );

-- Participants can read messages in active conversations
CREATE POLICY "Participants read active messages" ON job_messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM job_conversations c
      WHERE c.id = job_messages.conversation_id
        AND c.closed_at IS NULL
        AND (c.lister_id = auth.uid() OR c.student_id = auth.uid())
    )
  );

-- Participants can send messages in active conversations
CREATE POLICY "Participants send messages" ON job_messages
  FOR INSERT
  WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM job_conversations c
      WHERE c.id = job_messages.conversation_id
        AND c.closed_at IS NULL
        AND (c.lister_id = auth.uid() OR c.student_id = auth.uid())
    )
  );

-- Service role full access (admin exports)
CREATE POLICY "Service role full access job_conversations" ON job_conversations
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access job_messages" ON job_messages
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================================================
-- UPDATE payment release: close chat when funds released
-- ============================================================================
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

      PERFORM close_job_conversation(NEW.job_id);

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

-- Update last_message_at when a message is sent
CREATE OR REPLACE FUNCTION update_conversation_last_message_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE job_conversations
  SET last_message_at = NEW.created_at
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_update_conversation_last_message ON job_messages;
CREATE TRIGGER trigger_update_conversation_last_message
  AFTER INSERT ON job_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_last_message_at();

-- Realtime (optional; safe to run if already added)
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE job_messages;
EXCEPTION
  WHEN duplicate_object THEN NULL;
  WHEN undefined_object THEN NULL;
END;
$$;

ALTER TABLE job_messages REPLICA IDENTITY FULL;

GRANT EXECUTE ON FUNCTION archive_job_conversations_past_retention() TO service_role;

COMMENT ON TABLE job_conversations IS 'One chat per job; opens on accept, closes on payment release or cancel';
COMMENT ON TABLE job_messages IS 'Text messages between lister and accepted student';
