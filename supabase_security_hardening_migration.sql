-- Swifto security hardening
-- Run in Supabase SQL Editor after existing migrations.
-- Tightens profile/job RLS, locks sensitive columns, and adds public views
-- that omit street addresses and private profile fields.

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- ============================================================================
-- 1. Public profile projection (no balances, GST, identity, Stripe, or legal timestamps)
-- ============================================================================

CREATE OR REPLACE VIEW public_profiles
WITH (security_invoker = false)
AS
SELECT
  id,
  first_name,
  last_name,
  avatar_url,
  role,
  university,
  rating,
  total_jobs,
  member_since,
  bio,
  location,
  field_of_study,
  interests,
  preferred_job_categories
FROM profiles;

GRANT SELECT ON public_profiles TO anon, authenticated;

-- ============================================================================
-- 2. Public job browse projection (suburb/area only — no street address)
-- ============================================================================

CREATE OR REPLACE VIEW public_jobs
WITH (security_invoker = false)
AS
SELECT
  id,
  lister_id,
  job_name,
  category,
  size_or_time,
  area,
  price,
  completion_date,
  is_flexible,
  start_time,
  status,
  created_at,
  urgent_rebook_until
FROM jobs
WHERE status = 'active';

GRANT SELECT ON public_jobs TO anon, authenticated;

-- ============================================================================
-- 3. Profile RLS: own row only (drop world-readable policy)
-- ============================================================================

DROP POLICY IF EXISTS "Anyone can view profiles" ON profiles;

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT
  USING (auth.uid() = id);

-- ============================================================================
-- 4. Job RLS: street address only for lister, accepted student, or completion parties
-- ============================================================================

DROP POLICY IF EXISTS "Anyone can view active jobs" ON jobs;
DROP POLICY IF EXISTS "Students can view applied jobs" ON jobs;

DROP POLICY IF EXISTS "Listers can view own jobs" ON jobs;
CREATE POLICY "Listers can view own jobs" ON jobs
  FOR SELECT
  USING (lister_id = auth.uid());

DROP POLICY IF EXISTS "Students can view accepted job details" ON jobs;
CREATE POLICY "Students can view accepted job details" ON jobs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM job_applications
      WHERE job_applications.job_id = jobs.id
        AND job_applications.student_id = auth.uid()
        AND job_applications.status = 'accepted'
    )
    OR EXISTS (
      SELECT 1 FROM job_completions
      WHERE job_completions.job_id = jobs.id
        AND (
          job_completions.student_id = auth.uid()
          OR job_completions.lister_id = auth.uid()
        )
    )
  );

-- ============================================================================
-- 5. Block client tampering of privileged profile columns
--    service_role and postgres (triggers) may still update them.
-- ============================================================================

CREATE OR REPLACE FUNCTION protect_profile_sensitive_columns()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  jwt_role text;
BEGIN
  jwt_role := coalesce(auth.role(), '');
  IF jwt_role = 'service_role' THEN
    RETURN NEW;
  END IF;

  IF current_user IN ('postgres', 'supabase_admin') THEN
    RETURN NEW;
  END IF;

  NEW.id := OLD.id;
  NEW.role := OLD.role;
  NEW.created_at := OLD.created_at;
  NEW.member_since := OLD.member_since;

  IF NEW.balance_cents IS DISTINCT FROM OLD.balance_cents THEN
    NEW.balance_cents := OLD.balance_cents;
  END IF;
  IF NEW.identity_status IS DISTINCT FROM OLD.identity_status THEN
    NEW.identity_status := OLD.identity_status;
  END IF;
  IF NEW.rating IS DISTINCT FROM OLD.rating THEN
    NEW.rating := OLD.rating;
  END IF;
  IF NEW.total_jobs IS DISTINCT FROM OLD.total_jobs THEN
    NEW.total_jobs := OLD.total_jobs;
  END IF;
  IF NEW.total_earnings_cents IS DISTINCT FROM OLD.total_earnings_cents THEN
    NEW.total_earnings_cents := OLD.total_earnings_cents;
  END IF;
  IF NEW.cancellation_count IS DISTINCT FROM OLD.cancellation_count THEN
    NEW.cancellation_count := OLD.cancellation_count;
  END IF;
  IF NEW.late_cancel_count IS DISTINCT FROM OLD.late_cancel_count THEN
    NEW.late_cancel_count := OLD.late_cancel_count;
  END IF;
  IF NEW.stripe_connect_account_id IS DISTINCT FROM OLD.stripe_connect_account_id THEN
    NEW.stripe_connect_account_id := OLD.stripe_connect_account_id;
  END IF;
  IF NEW.stripe_connect_details_submitted IS DISTINCT FROM OLD.stripe_connect_details_submitted THEN
    NEW.stripe_connect_details_submitted := OLD.stripe_connect_details_submitted;
  END IF;
  IF NEW.stripe_connect_payouts_enabled IS DISTINCT FROM OLD.stripe_connect_payouts_enabled THEN
    NEW.stripe_connect_payouts_enabled := OLD.stripe_connect_payouts_enabled;
  END IF;
  IF NEW.stripe_connect_charges_enabled IS DISTINCT FROM OLD.stripe_connect_charges_enabled THEN
    NEW.stripe_connect_charges_enabled := OLD.stripe_connect_charges_enabled;
  END IF;

  -- Legal timestamps: allow first set from NULL, never overwrite afterwards
  IF OLD.accepted_terms_of_service_at IS NOT NULL THEN
    NEW.accepted_terms_of_service_at := OLD.accepted_terms_of_service_at;
  END IF;
  IF OLD.accepted_community_guidelines_at IS NOT NULL THEN
    NEW.accepted_community_guidelines_at := OLD.accepted_community_guidelines_at;
  END IF;
  IF OLD.acknowledged_privacy_statement_at IS NOT NULL THEN
    NEW.acknowledged_privacy_statement_at := OLD.acknowledged_privacy_statement_at;
  END IF;
  IF OLD.accepted_payment_terms_at IS NOT NULL THEN
    NEW.accepted_payment_terms_at := OLD.accepted_payment_terms_at;
  END IF;
  IF OLD.accepted_payout_terms_at IS NOT NULL THEN
    NEW.accepted_payout_terms_at := OLD.accepted_payout_terms_at;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_profile_sensitive_columns ON profiles;
CREATE TRIGGER trg_protect_profile_sensitive_columns
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION protect_profile_sensitive_columns();

-- ============================================================================
-- 6. Jobs: cannot reassign lister; cannot change price after applications exist
-- ============================================================================

CREATE OR REPLACE FUNCTION protect_job_sensitive_columns()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  jwt_role text;
BEGIN
  jwt_role := coalesce(auth.role(), '');
  IF jwt_role = 'service_role' THEN
    RETURN NEW;
  END IF;
  IF current_user IN ('postgres', 'supabase_admin') THEN
    RETURN NEW;
  END IF;

  NEW.lister_id := OLD.lister_id;

  IF NEW.price IS DISTINCT FROM OLD.price THEN
    IF EXISTS (SELECT 1 FROM job_applications WHERE job_id = NEW.id) THEN
      RAISE EXCEPTION 'Cannot change job price after applications exist';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_job_sensitive_columns ON jobs;
CREATE TRIGGER trg_protect_job_sensitive_columns
  BEFORE UPDATE ON jobs
  FOR EACH ROW
  EXECUTE FUNCTION protect_job_sensitive_columns();

-- ============================================================================
-- 7. Avatar bucket: public photos only, type/size/path restricted
-- ============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  2097152,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 2097152,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

DROP POLICY IF EXISTS "Users upload own avatar" ON storage.objects;
CREATE POLICY "Users upload own avatar"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Users update own avatar" ON storage.objects;
CREATE POLICY "Users update own avatar"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Users delete own avatar" ON storage.objects;
CREATE POLICY "Users delete own avatar"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Public read avatars" ON storage.objects;
CREATE POLICY "Public read avatars"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'avatars');

-- Keep identity docs private (re-assert in case dashboard was toggled)
UPDATE storage.buckets
SET public = false,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
WHERE id = 'lister-id-docs';
