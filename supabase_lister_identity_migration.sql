-- Lister identity verification (manual admin review)
-- Run in Supabase SQL Editor. No Stripe Identity.

-- 1. Profile status for fast gating
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS identity_status TEXT NOT NULL DEFAULT 'unverified'
    CHECK (identity_status IN ('unverified', 'pending', 'verified', 'rejected'));

CREATE INDEX IF NOT EXISTS idx_profiles_identity_status
  ON profiles(identity_status)
  WHERE role = 'lister';

-- Existing listers stay unverified until they submit + you approve.
-- (Optional later: UPDATE profiles SET identity_status = 'verified' WHERE role = 'lister' AND ...)

-- 2. Submission records
CREATE TABLE IF NOT EXISTS lister_identity_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  legal_full_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  document_type TEXT NOT NULL
    CHECK (document_type IN ('driver_licence', 'passport', 'birth_certificate')),
  document_number TEXT,
  address_line TEXT,
  document_paths TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'verified', 'rejected')),
  admin_notes TEXT,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lister_identity_user
  ON lister_identity_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_lister_identity_status
  ON lister_identity_submissions(status);
CREATE INDEX IF NOT EXISTS idx_lister_identity_created
  ON lister_identity_submissions(created_at DESC);

ALTER TABLE lister_identity_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Listers can view own identity submissions" ON lister_identity_submissions;
CREATE POLICY "Listers can view own identity submissions"
  ON lister_identity_submissions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Listers can insert own identity submissions" ON lister_identity_submissions;
CREATE POLICY "Listers can insert own identity submissions"
  ON lister_identity_submissions FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'lister'
    )
  );

-- Updates (approve/reject) go through service-role API only.

-- 3. Private storage bucket for ID documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'lister-id-docs',
  'lister-id-docs',
  false,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

-- Path convention: {user_id}/{filename}
DROP POLICY IF EXISTS "Listers upload own id docs" ON storage.objects;
CREATE POLICY "Listers upload own id docs"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'lister-id-docs'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Listers update own id docs" ON storage.objects;
CREATE POLICY "Listers update own id docs"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'lister-id-docs'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Listers read own id docs" ON storage.objects;
CREATE POLICY "Listers read own id docs"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'lister-id-docs'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Listers delete own id docs" ON storage.objects;
CREATE POLICY "Listers delete own id docs"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'lister-id-docs'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Admins view docs via service-role signed URLs in the API (bypasses RLS).
