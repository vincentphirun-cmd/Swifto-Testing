# Quick Fix: No Email Sent on Signup

## Option 1: Disable Email Confirmation (Fastest - for testing only)

1. Go to **Supabase Dashboard** → Your Project
2. Click **Authentication** → **Settings**
3. Scroll to **"Email Auth"** section
4. Toggle **"Enable email confirmations"** to **OFF**
5. Click **Save**
6. Now try signing up again - you'll be logged in immediately

⚠️ **Remember to re-enable this for production!**

---

## Option 2: Manually Confirm Your User

1. Go to **Supabase Dashboard** → **Authentication** → **Users**
2. Find your user by email address
3. Click the three dots (⋯) next to your user
4. Click **"Confirm user"**
5. Now try logging in with your email and password

---

## Option 3: Check Email Settings

1. Go to **Supabase Dashboard** → **Settings** → **Auth**
2. Check **"SMTP Settings"** - if it says "Not configured", Supabase's default email service should still work
3. Check **"Email Auth"** settings - make sure email confirmations are enabled
4. Check your **spam folder** - Supabase emails sometimes go there

---

## Option 4: Use a Different Email Provider

If Supabase's email service isn't working, you can configure SMTP:
1. Go to **Supabase Dashboard** → **Settings** → **Auth** → **SMTP Settings**
2. Configure SMTP with your email provider (Gmail, SendGrid, etc.)
3. Save and test

---

**Recommended for testing:** Use Option 1 (disable email confirmation) to test quickly, then re-enable it later.
