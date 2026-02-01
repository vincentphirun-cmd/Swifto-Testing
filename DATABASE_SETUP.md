# Database Setup Instructions

The MCP connection is read-only for safety. To set up your database schema, you need to run the SQL directly in Supabase.

## Steps to Set Up Database

### Option 1: Using Supabase Dashboard (Recommended)

1. **Go to Supabase Dashboard**
   - Navigate to: https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Run the Schema**
   - Open the file `supabase_schema.sql` in this repository
   - Copy the entire contents
   - Paste it into the SQL Editor
   - Click "Run" (or press Cmd/Ctrl + Enter)

### Option 2: Using Supabase CLI

If you have Supabase CLI installed:

```bash
# Make sure you're in the project directory
cd "/Users/vincentphirun/New Swifto"

# Link to your Supabase project (if not already linked)
supabase link --project-ref hrotvriykmthhttkpbhf

# Run the migration
supabase db push
```

Or directly:

```bash
psql "postgresql://postgres.hrotvriykmthhttkpbhf:[YOUR-PASSWORD]@aws-1-ap-south-1.pooler.supabase.com:5432/postgres" -f supabase_schema.sql
```

## What the Schema Creates

The `supabase_schema.sql` file creates:

1. **Enum Types**
   - `user_role`: 'lister' or 'student'
   - `job_status`: 'active', 'in_progress', 'completed', 'cancelled'
   - `application_status`: 'pending', 'accepted', 'not_selected'

2. **Tables**
   - `profiles`: User profiles extending auth.users
   - `jobs`: Job listings posted by listers
   - `job_applications`: Student applications for jobs
   - `job_completions`: Completed jobs with ratings

3. **Indexes**
   - Optimized indexes for common queries

4. **Functions & Triggers**
   - Auto-update `updated_at` timestamps
   - Auto-update job status when application is accepted
   - Auto-calculate student ratings and total jobs

5. **Row Level Security (RLS)**
   - Policies to ensure users can only access their own data
   - Listers can manage their jobs and applications
   - Students can view and create applications

## Job payment trigger (for Stripe flow)

Run `supabase_job_payment_trigger.sql` in the SQL Editor. This releases payment (deducts lister, adds to student) when both parties verify job completion.

## Platform fee (withhold from student payout)

Run `supabase_platform_fee_migration.sql` in the SQL Editor. This updates the job payment trigger to withhold the Swifto platform fee from the student payout (student receives job price minus fee).

## GST fields (student profiles)

Run `supabase_gst_migration.sql` in the SQL Editor. This adds `gst_registered` (boolean) and `gst_number` (text) to profiles for student tax settings.

## Listing fee ($0.99 per job)

Run `supabase_listing_fee_migration.sql` in the SQL Editor. This adds the `listing_fee` transaction type and the `deduct_listing_fee` function used when listers post a job.

## Financial ledger (accounting export)

Run `supabase_financial_ledger_migration.sql` first, then `supabase_financial_ledger_write_migration.sql`, then `supabase_ledger_receipt_migration.sql`. The first creates the `financial_ledger` table. The second updates the job payout trigger and `deduct_listing_fee` to insert ledger rows. The third adds receipt_number/receipt_type for tax receipts. Add `ADMIN_EMAILS` to `.env.local` (comma-separated admin emails) to access `/admin/finance`.

## Cancellation & rebooking

Run `supabase_cancellation_rebooking_migration.sql` for student cancellation flow: `start_time`, `urgent_rebook_until` on jobs, `job_cancellations` table, `cancellation_count`/`late_cancel_count`/`total_earnings_cents` on profiles.

## After Completion flow (optional)

To enable the "Verify work done" flow where both lister and student confirm completion, run `supabase_after_completion_migration.sql` in the SQL Editor. This adds verification columns and triggers.

## Additional policy (students viewing applied jobs)

If you ran the schema before and students cannot see job details for jobs they applied to (e.g. when the job is `in_progress`), run this in the SQL Editor:

```sql
CREATE POLICY "Students can view applied jobs" ON jobs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM job_applications WHERE job_id = jobs.id AND student_id = auth.uid())
  );
```

## Profile creation (required for auth)

So users can create their profile when they sign up, run this in the SQL Editor as well:

```sql
-- From supabase_migration_profiles_insert.sql
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

## Service role key (required for profile creation)

The app creates profiles **server-side** (on email-confirm callback and when signup returns a session) using the **service role** key, which bypasses RLS. Add this to `.env.local`:

```
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

- **Where to find it:** Supabase Dashboard → Settings → API → `service_role` (secret). Do **not** expose it to the client or commit it.
- Without it, profile creation will fail and users will not get a row in `profiles` after signup.

## Verification

After running the schema, verify it worked:

```sql
-- Check tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Should return:
-- job_applications
-- job_completions
-- jobs
-- profiles
```

## Next Steps

After the schema is set up:

1. **Set up Supabase Client in your Next.js app**
   - Install: `npm install @supabase/supabase-js`
   - Create a Supabase client utility

2. **Update your pages to use real data**
   - Replace static data with Supabase queries
   - Implement authentication
   - Connect forms to database

3. **Test the application**
   - Create test users (listers and students)
   - Post test jobs
   - Submit test applications

## Important Notes

- The schema includes Row Level Security (RLS) policies
- All tables reference `auth.users` for authentication
- Make sure Supabase Auth is enabled in your project
- The `profiles` table extends `auth.users`, so users must be created through Supabase Auth first
