-- Optional profile detail fields (editable on profile pages; identity fields stay locked).

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS field_of_study TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS interests TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS academic_achievements TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS extracurricular_achievements TEXT;

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS preferred_job_categories TEXT;
