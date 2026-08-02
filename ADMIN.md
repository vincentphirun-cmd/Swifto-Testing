# Admin role

Admin is a first-class `profiles.role` value (`admin`), separate from `lister` and `student`.

## 1. Run SQL (required)

In Supabase → SQL Editor, run:

`supabase_admin_role_migration.sql`

This adds `admin` to the `user_role` enum.

## 2. Env

Keep your email in `.env.local` (and Vercel):

```bash
ADMIN_EMAILS=your@email.com
```

On login, if your email is in `ADMIN_EMAILS`, the app **auto-promotes** `profiles.role` to `admin` (via `POST /api/admin/check`).

## 3. Manual promote (optional)

```sql
UPDATE profiles
SET role = 'admin'
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'your@email.com'
);
```

## 4. What you get

| Path | Purpose |
|------|---------|
| `/admin` | Hub: KPIs + links |
| `/admin/identity` | Lister ID review |
| `/admin/finance` | Ledger export |
| `/admin/messages` | Chat archive |

Login as that account → you should land on **`/admin`**, not the lister dashboard. Nav shows **Admin** and **Verify IDs**.

## 5. Notes

- Signup still only creates `lister` or `student` — admins are promoted, not self-serve.
- Access = `role = admin` **or** email in `ADMIN_EMAILS`.
- After the migration, log out and log back in once so promotion + redirect apply.
