-- After Completion Flow - Migration
-- Run this in Supabase SQL Editor after the main schema is set up.

-- 1. Add verification columns to job_completions
ALTER TABLE job_completions
  ADD COLUMN IF NOT EXISTS lister_verified_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS student_verified_at TIMESTAMP WITH TIME ZONE;

-- 2. Students can update their own verification (student_verified_at)
CREATE POLICY "Students can verify own completions" ON job_completions
  FOR UPDATE USING (student_id = auth.uid());

-- 3. When both lister and student have verified, mark job as completed
CREATE OR REPLACE FUNCTION mark_job_completed_on_both_verified()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.lister_verified_at IS NOT NULL AND NEW.student_verified_at IS NOT NULL THEN
    UPDATE jobs SET status = 'completed', updated_at = NOW() WHERE id = NEW.job_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trigger_mark_job_completed ON job_completions;

CREATE TRIGGER trigger_mark_job_completed
  AFTER UPDATE ON job_completions
  FOR EACH ROW
  WHEN (OLD.student_verified_at IS NULL AND NEW.student_verified_at IS NOT NULL)
  EXECUTE FUNCTION mark_job_completed_on_both_verified();
