-- GST fields for student profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS gst_registered BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS gst_number TEXT;
