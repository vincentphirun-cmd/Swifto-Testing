# Quick Fix: Profile Insert Policy

You're getting this error because the INSERT policy for profiles is missing. Run this SQL in your Supabase SQL Editor:

```sql
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

## Steps:
1. Go to **Supabase Dashboard** → Your Project
2. Click **SQL Editor** in the left sidebar
3. Click **New query**
4. Paste the SQL above
5. Click **Run**

After running this, try signing up again - it should work!
