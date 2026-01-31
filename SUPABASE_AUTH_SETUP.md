# Supabase Auth Configuration

## Email Confirmation Redirect URL

After setting up the database schema, you need to configure the email confirmation redirect URL in Supabase:

1. Go to **Supabase Dashboard** → Your Project
2. Navigate to **Authentication** → **URL Configuration**
3. Add to **Redirect URLs**:
   - `http://localhost:3000/auth/callback` (for local development)
   - `https://yourdomain.com/auth/callback` (for production)

This ensures that when users click the email confirmation link, they're redirected back to your app at `/auth/callback`, which exchanges the confirmation code for a session.

## Troubleshooting

### "AbortError: signal is aborted without reason"
This error can occur if:
- The redirect URL is not configured in Supabase
- Multiple auth operations are running simultaneously
- The auth context is trying to get the session while email confirmation is processing

**Solution**: Make sure the redirect URL is configured in Supabase Dashboard, and restart your dev server after making changes.

### Email confirmation not working / No email sent

**Quick Fix Options:**

1. **Check if email confirmation is enabled:**
   - Go to **Supabase Dashboard** → **Authentication** → **Settings**
   - Scroll to **"Email Auth"** section
   - Check **"Enable email confirmations"** - if it's OFF, emails won't be sent
   - If you want to test without email confirmation, you can disable it temporarily

2. **Check email service configuration:**
   - Go to **Supabase Dashboard** → **Settings** → **Auth**
   - Under **"SMTP Settings"**, check if SMTP is configured
   - By default, Supabase uses their email service, but it might be rate-limited or disabled
   - If SMTP shows as "Not configured", Supabase's default email service should still work

3. **Manually confirm a user (for testing):**
   - Go to **Supabase Dashboard** → **Authentication** → **Users**
   - Find your user by email
   - Click the three dots (⋯) → **"Confirm user"**
   - Then try logging in

4. **Temporarily disable email confirmation (for testing):**
   - Go to **Supabase Dashboard** → **Authentication** → **Settings**
   - Under **"Email Auth"**, toggle **"Enable email confirmations"** to OFF
   - Save changes
   - Now signups will work immediately without email confirmation
   - **⚠️ Re-enable this for production!**

5. **Check spam folder:**
   - Supabase emails sometimes go to spam
   - Check your spam/junk folder

6. **Verify redirect URL:**
   - Check that the redirect URL in Supabase matches your app URL
   - Verify `.env.local` has the correct `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Check browser console for any errors
   - Try clearing browser cookies/localStorage
