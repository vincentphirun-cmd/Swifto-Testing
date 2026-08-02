# Password reset (forgot password)

## App routes

| Path | Purpose |
|------|---------|
| `/forgot-password` | Enter email → Supabase sends reset link |
| `/reset-password` | Set new password (handles `code`, `token_hash`, or `#access_token&type=recovery`) |
| `/auth/callback` | Also supports recovery (`type=recovery`) → redirects to `/reset-password` |

If a recovery link lands on `/` (Site URL) with hash tokens, the app auto-redirects to `/reset-password`.

## Supabase settings (required)

**Authentication → URL Configuration → Redirect URLs** — add:

- `http://localhost:3000/reset-password`
- `http://localhost:3000/auth/callback`
- `https://YOUR-VERCEL-APP.vercel.app/reset-password`
- `https://YOUR-VERCEL-APP.vercel.app/auth/callback`

**Site URL**: for local testing use `http://localhost:3000`, or keep production and rely on Redirect URLs above.

Email template **Reset password** should use `{{ .ConfirmationURL }}`.

## Test

1. `/forgot-password` → send email  
2. Open link → you should see **Set a new password** (not the landing page)  
3. Enter + confirm password → dashboard  

Request a **fresh** email after changing Redirect URLs; old links may still point at Site URL only.
