### Supabase Docs
https://supabase.com/docs/guides/getting-started/mcp

### Connection String
```
postgresql://postgres.hrotvriykmthhttkpbhf:[hZ5nFKlNrnbNEhzU]@aws-1-ap-south-1.pooler.supabase.com:5432/postgres
```

### Supabase Command
npx -y @modelcontextprotocol/server-postgres postgresql://postgres.hrotvriykmthhttkpbhf:[hZ5nFKlNrnbNEhzU]@aws-1-ap-south-1.pooler.supabase.com:5432/postgres


### Database password…
hZ5nFKlNrnbNEhzU

### Complete MCP Command …
```bash
cursor mcp add postgres --name swifto-supabase --url "postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
```
Replace `[YOUR-PROJECT-REF]`, `[YOUR-PASSWORD]`, and `[REGION]` with your values.

---

### Project env setup
- Store Supabase config in a local **`.env.local`** file at the project root.
- Add:
  - `NEXT_PUBLIC_SUPABASE_URL` — your project URL (e.g. `https://[YOUR-PROJECT-REF].supabase.co`)
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — your project anon/public key from **Settings → API**.
  - `SUPABASE_SERVICE_ROLE_KEY` — **service_role** key from **Settings → API** (secret). Required for profile creation on signup. Never expose to the client.
- Ensure **`.env.local`** is gitignored (e.g. via `.env*.local`). Never commit it.
