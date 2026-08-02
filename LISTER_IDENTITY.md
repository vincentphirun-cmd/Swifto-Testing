# Lister identity verification (Supabase, manual admin review)

No Stripe Identity. Listers upload ID docs; admins approve in-app.

## 1. Run SQL (required)

In **Supabase → SQL Editor**, run:

`supabase_lister_identity_migration.sql`

This creates:

- `profiles.identity_status` (`unverified` | `pending` | `verified` | `rejected`)
- `lister_identity_submissions` table
- Private storage bucket `lister-id-docs` + RLS

## 2. Admin access

Set in `.env.local` (and Vercel):

```bash
ADMIN_EMAILS=your@email.com
```

Use the email you log in with. Restart `npm run dev` after changing it.

## 3. Test flow

1. Log in as a **lister** (or sign up as one).
2. Dashboard shows verify banner → **Verify identity**.
3. Fill details, upload licence/passport/birth cert → submit → status `pending`.
4. Deposit / post job should be blocked.
5. Log in as admin → open `/admin/identity` → **Approve** (or Reject with notes).
6. Lister can deposit and post.

## Routes

| Path | Who |
|------|-----|
| `/dashboard/lister/verify-identity` | Lister submit / status |
| `/admin/identity` | Admin review queue |
| `POST /api/lister/identity` | Submit after upload |
| `GET /api/lister/identity` | Status |
| `GET/POST /api/admin/identity` | List / approve-reject |
| `GET /api/admin/identity/document` | Signed URL to view file |

## Notes

- Existing listers default to `unverified` after migration — they must verify once.
- To grandfather test accounts:  
  `UPDATE profiles SET identity_status = 'verified' WHERE role = 'lister' AND id = '…';`
- Files live in private Storage; only the owner (via RLS) and service-role (admin signed URLs) can read them.
- Students are unchanged (university email trust).
