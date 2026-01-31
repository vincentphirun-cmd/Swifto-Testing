-- Swifto Database Schema
-- This file contains all the tables needed for the Swifto application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('lister', 'student');
CREATE TYPE job_status AS ENUM ('active', 'in_progress', 'completed', 'cancelled');
CREATE TYPE application_status AS ENUM ('pending', 'accepted', 'not_selected');

-- ============================================================================
-- PROFILES TABLE
-- Extends auth.users with additional profile information
-- ============================================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  university TEXT, -- Only for students
  rating NUMERIC(3, 2) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
  total_jobs INTEGER DEFAULT 0,
  member_since TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for profiles
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_university ON profiles(university) WHERE university IS NOT NULL;

-- ============================================================================
-- JOBS TABLE
-- Stores all job listings posted by listers
-- ============================================================================
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lister_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  job_name TEXT NOT NULL,
  category TEXT NOT NULL,
  size_or_time TEXT NOT NULL,
  address TEXT NOT NULL,
  area TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  completion_date DATE,
  is_flexible BOOLEAN DEFAULT FALSE,
  status job_status DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for jobs
CREATE INDEX idx_jobs_lister_id ON jobs(lister_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_category ON jobs(category);
CREATE INDEX idx_jobs_area ON jobs(area);
CREATE INDEX idx_jobs_created_at ON jobs(created_at DESC);

-- ============================================================================
-- JOB_APPLICATIONS TABLE
-- Stores student applications for jobs
-- ============================================================================
CREATE TABLE job_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status application_status DEFAULT 'pending',
  application_name TEXT, -- Name from application form (if different from profile)
  experience TEXT, -- Experience details from application
  availability TEXT, -- Availability details from application
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Ensure one application per student per job
  UNIQUE(job_id, student_id)
);

-- Indexes for job_applications
CREATE INDEX idx_job_applications_job_id ON job_applications(job_id);
CREATE INDEX idx_job_applications_student_id ON job_applications(student_id);
CREATE INDEX idx_job_applications_status ON job_applications(status);
CREATE INDEX idx_job_applications_applied_at ON job_applications(applied_at DESC);

-- ============================================================================
-- JOB_COMPLETIONS TABLE
-- Tracks completed jobs and ratings
-- ============================================================================
CREATE TABLE job_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lister_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  rating_from_lister NUMERIC(3, 2) CHECK (rating_from_lister >= 0 AND rating_from_lister <= 5),
  rating_from_student NUMERIC(3, 2) CHECK (rating_from_student >= 0 AND rating_from_student <= 5),
  payment_released_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Ensure one completion record per job
  UNIQUE(job_id)
);

-- Indexes for job_completions
CREATE INDEX idx_job_completions_job_id ON job_completions(job_id);
CREATE INDEX idx_job_completions_student_id ON job_completions(student_id);
CREATE INDEX idx_job_completions_lister_id ON job_completions(lister_id);
CREATE INDEX idx_job_completions_completed_at ON job_completions(completed_at DESC);

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to auto-update updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_applications_updated_at BEFORE UPDATE ON job_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically update job status when application is accepted
CREATE OR REPLACE FUNCTION update_job_status_on_accept()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'accepted' AND OLD.status != 'accepted' THEN
    UPDATE jobs SET status = 'in_progress' WHERE id = NEW.job_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_job_status_on_accept
  AFTER UPDATE OF status ON job_applications
  FOR EACH ROW
  WHEN (NEW.status = 'accepted' AND OLD.status != 'accepted')
  EXECUTE FUNCTION update_job_status_on_accept();

-- Function to update student total_jobs count
CREATE OR REPLACE FUNCTION update_student_total_jobs()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE profiles 
    SET total_jobs = total_jobs + 1 
    WHERE id = NEW.student_id AND role = 'student';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_student_total_jobs
  AFTER INSERT ON job_completions
  FOR EACH ROW
  EXECUTE FUNCTION update_student_total_jobs();

-- Function to calculate average rating for students
CREATE OR REPLACE FUNCTION update_student_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles 
  SET rating = (
    SELECT COALESCE(AVG(rating_from_lister), 0)
    FROM job_completions
    WHERE student_id = NEW.student_id AND rating_from_lister IS NOT NULL
  )
  WHERE id = NEW.student_id AND role = 'student';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_student_rating
  AFTER INSERT OR UPDATE OF rating_from_lister ON job_completions
  FOR EACH ROW
  EXECUTE FUNCTION update_student_rating();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_completions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
-- Users can read their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile (required for signup)
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Anyone can view profiles (for browsing)
CREATE POLICY "Anyone can view profiles" ON profiles
  FOR SELECT USING (true);

-- Jobs policies
-- Anyone can view active jobs
CREATE POLICY "Anyone can view active jobs" ON jobs
  FOR SELECT USING (status = 'active' OR lister_id = auth.uid());

-- Students can view jobs they have applied to
CREATE POLICY "Students can view applied jobs" ON jobs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM job_applications WHERE job_id = jobs.id AND student_id = auth.uid())
  );

-- Listers can create jobs
CREATE POLICY "Listers can create jobs" ON jobs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'lister'
    )
  );

-- Listers can update their own jobs
CREATE POLICY "Listers can update own jobs" ON jobs
  FOR UPDATE USING (lister_id = auth.uid());

-- Job applications policies
-- Students can view their own applications
CREATE POLICY "Students can view own applications" ON job_applications
  FOR SELECT USING (student_id = auth.uid());

-- Listers can view applications for their jobs
CREATE POLICY "Listers can view applications for their jobs" ON job_applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM jobs 
      WHERE jobs.id = job_applications.job_id AND jobs.lister_id = auth.uid()
    )
  );

-- Students can create applications
CREATE POLICY "Students can create applications" ON job_applications
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'student'
    )
  );

-- Listers can update applications for their jobs
CREATE POLICY "Listers can update applications for their jobs" ON job_applications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM jobs 
      WHERE jobs.id = job_applications.job_id AND jobs.lister_id = auth.uid()
    )
  );

-- Job completions policies
-- Users can view completions for their jobs (as lister or student)
CREATE POLICY "Users can view own job completions" ON job_completions
  FOR SELECT USING (lister_id = auth.uid() OR student_id = auth.uid());

-- Listers can create completions for their jobs
CREATE POLICY "Listers can create completions" ON job_completions
  FOR INSERT WITH CHECK (
    lister_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'lister'
    )
  );

-- Listers can update completions for their jobs
CREATE POLICY "Listers can update own completions" ON job_completions
  FOR UPDATE USING (lister_id = auth.uid());

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================
COMMENT ON TABLE profiles IS 'User profiles extending auth.users with role and additional information';
COMMENT ON TABLE jobs IS 'Job listings posted by listers';
COMMENT ON TABLE job_applications IS 'Student applications for jobs';
COMMENT ON TABLE job_completions IS 'Completed jobs with ratings and payment tracking';

COMMENT ON COLUMN profiles.role IS 'User role: lister or student';
COMMENT ON COLUMN jobs.status IS 'Job status: active, in_progress, completed, cancelled';
COMMENT ON COLUMN job_applications.status IS 'Application status: pending, accepted, not_selected';
COMMENT ON COLUMN job_completions.rating_from_lister IS 'Rating given by lister to student (0-5)';
COMMENT ON COLUMN job_completions.rating_from_student IS 'Rating given by student to lister (0-5)';
