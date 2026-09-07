-- Job completion evidence photos (private).
-- Run in Supabase SQL Editor after existing migrations.

-- Path convention: {job_id}/{user_id}/{filename}

CREATE TABLE IF NOT EXISTS job_completion_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('lister', 'student')),
  storage_path TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_job_completion_photos_job_id ON job_completion_photos(job_id);
CREATE INDEX IF NOT EXISTS idx_job_completion_photos_uploaded_by ON job_completion_photos(uploaded_by);

ALTER TABLE job_completion_photos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Parties can view completion photos" ON job_completion_photos;
CREATE POLICY "Parties can view completion photos"
  ON job_completion_photos FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM jobs j WHERE j.id = job_id AND j.lister_id = auth.uid())
    OR EXISTS (
      SELECT 1 FROM job_applications a
      WHERE a.job_id = job_completion_photos.job_id
        AND a.student_id = auth.uid()
        AND a.status = 'accepted'
    )
    OR EXISTS (
      SELECT 1 FROM job_completions c
      WHERE c.job_id = job_completion_photos.job_id
        AND (c.lister_id = auth.uid() OR c.student_id = auth.uid())
    )
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

DROP POLICY IF EXISTS "Parties can insert own completion photos" ON job_completion_photos;
CREATE POLICY "Parties can insert own completion photos"
  ON job_completion_photos FOR INSERT TO authenticated
  WITH CHECK (
    uploaded_by = auth.uid()
    AND (
      (
        role = 'lister'
        AND EXISTS (
          SELECT 1 FROM jobs j
          WHERE j.id = job_id AND j.lister_id = auth.uid() AND j.status = 'in_progress'
        )
      )
      OR (
        role = 'student'
        AND EXISTS (
          SELECT 1 FROM job_applications a
          WHERE a.job_id = job_completion_photos.job_id
            AND a.student_id = auth.uid()
            AND a.status = 'accepted'
        )
      )
    )
  );

GRANT SELECT, INSERT ON job_completion_photos TO authenticated;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'job-completion-evidence',
  'job-completion-evidence',
  false,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

DROP POLICY IF EXISTS "Parties upload completion evidence" ON storage.objects;
CREATE POLICY "Parties upload completion evidence"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'job-completion-evidence'
    AND (storage.foldername(name))[2] = auth.uid()::text
    AND (
      EXISTS (
        SELECT 1 FROM jobs j
        WHERE j.id::text = (storage.foldername(name))[1]
          AND j.lister_id = auth.uid()
          AND j.status = 'in_progress'
      )
      OR EXISTS (
        SELECT 1 FROM job_applications a
        WHERE a.job_id::text = (storage.foldername(name))[1]
          AND a.student_id = auth.uid()
          AND a.status = 'accepted'
      )
    )
  );

DROP POLICY IF EXISTS "Parties read completion evidence" ON storage.objects;
CREATE POLICY "Parties read completion evidence"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'job-completion-evidence'
    AND (
      EXISTS (
        SELECT 1 FROM jobs j
        WHERE j.id::text = (storage.foldername(name))[1]
          AND j.lister_id = auth.uid()
      )
      OR EXISTS (
        SELECT 1 FROM job_applications a
        WHERE a.job_id::text = (storage.foldername(name))[1]
          AND a.student_id = auth.uid()
          AND a.status = 'accepted'
      )
      OR EXISTS (
        SELECT 1 FROM job_completions c
        WHERE c.job_id::text = (storage.foldername(name))[1]
          AND (c.lister_id = auth.uid() OR c.student_id = auth.uid())
      )
      OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
    )
  );

DROP POLICY IF EXISTS "Uploaders delete own completion evidence" ON storage.objects;
CREATE POLICY "Uploaders delete own completion evidence"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'job-completion-evidence'
    AND (storage.foldername(name))[2] = auth.uid()::text
  );
