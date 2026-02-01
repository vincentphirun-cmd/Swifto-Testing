-- Cancellation & Rebooking Flow
-- Adds start_time, urgent_rebook_until, job_cancellations, application_status 'cancelled'

-- 1. Add start_time to jobs (required for late-cancel policy)
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS start_time TIMESTAMPTZ;

-- 2. Add urgent_rebook_until for boost in feed
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS urgent_rebook_until TIMESTAMPTZ;

-- 3. Add 'cancelled' to application_status (ignore if already exists)
DO $$ BEGIN
  ALTER TYPE application_status ADD VALUE 'cancelled';
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 4. job_cancellations table
CREATE TABLE IF NOT EXISTS job_cancellations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  application_id UUID NOT NULL REFERENCES job_applications(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reason TEXT NOT NULL CHECK (reason IN ('sick_emergency','scheduling_conflict','unsafe_uncomfortable','cant_reach_lister','other')),
  hours_before_start NUMERIC(10,2),
  penalty_applied TEXT CHECK (penalty_applied IN ('none','reliability','late_fee_strike')),
  notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_job_cancellations_job_id ON job_cancellations(job_id);
CREATE INDEX IF NOT EXISTS idx_job_cancellations_student_id ON job_cancellations(student_id);

-- 5. Student cancellation tally for reliability/strikes (IRD reporting + policy)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cancellation_count INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS late_cancel_count INTEGER DEFAULT 0;

-- 6. Income reporting: per-student total earnings (IRD digital platform rules)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_earnings_cents INTEGER DEFAULT 0;

-- 7. RLS for job_cancellations
ALTER TABLE job_cancellations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lister can view cancellations for own jobs" ON job_cancellations
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM jobs j WHERE j.id = job_cancellations.job_id AND j.lister_id = auth.uid())
  );
CREATE POLICY "Student can insert own cancellation" ON job_cancellations
  FOR INSERT WITH CHECK (student_id = auth.uid());
CREATE POLICY "Service role full access job_cancellations" ON job_cancellations
  FOR ALL USING (auth.role() = 'service_role');
