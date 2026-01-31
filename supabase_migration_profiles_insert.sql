-- Run this in Supabase SQL Editor if you need users to create their own profile on signup.
-- Required for: signup flow, post-job (listers), and applications (students).

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
