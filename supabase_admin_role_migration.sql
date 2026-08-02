-- Add first-class admin role (separate from lister / student)
-- Run in Supabase SQL Editor.

-- 1. Extend enum (Postgres)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_enum e
    JOIN pg_type t ON e.enumtypid = t.oid
    WHERE t.typname = 'user_role' AND e.enumlabel = 'admin'
  ) THEN
    ALTER TYPE user_role ADD VALUE 'admin';
  END IF;
END $$;

-- 2. Optional: after this migration, promote your account with:
-- UPDATE profiles SET role = 'admin' WHERE id = (
--   SELECT id FROM auth.users WHERE email = 'your-admin@email.com'
-- );
--
-- Or rely on ADMIN_EMAILS + /api/admin/ensure-role (auto-promotes on login).
