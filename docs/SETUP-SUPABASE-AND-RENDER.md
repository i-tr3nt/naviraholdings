# Connect Supabase to NAVIRA HARDWARE (local + Render)

Follow these steps in order.

---

## Part 1 — Create a Supabase project (free)

1. Open **[https://supabase.com/dashboard](https://supabase.com/dashboard)** and sign in (GitHub is fine).
2. Click **New project**.
3. Fill in:
   - **Name:** `navira-hardware` (any name)
   - **Database password:** choose a strong password and **save it** (for dashboard/SQL only)
   - **Region:** pick closest to your users (e.g. South Africa / EU if available)
4. Click **Create new project** and wait until status is **Active** (green).

---

## Part 2 — Copy API keys into your app

1. In Supabase: **Project Settings** (gear) → **API**.
2. Copy:

   | Supabase field | Your `.env` variable |
   |----------------|----------------------|
   | Project URL | `VITE_SUPABASE_URL` |
   | anon public | `VITE_SUPABASE_PUBLISHABLE_KEY` |
   | Reference ID (from URL, e.g. `abcdefgh...`) | `VITE_SUPABASE_PROJECT_ID` |

3. On your PC, edit `naviraholdings/.env` (no quotes):

   ```env
   VITE_SUPABASE_PROJECT_ID=paste-reference-id-here
   VITE_SUPABASE_URL=https://paste-reference-id-here.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=paste-anon-key-here
   ```

4. Test in browser (replace with your real id):

   `https://YOUR-PROJECT-ID.supabase.co/auth/v1/health`

   You should see JSON, not “can’t reach this page”.

5. Restart local dev:

   ```bash
   npm run dev
   ```

   Open **Create account** — the red “Cannot connect to Supabase” message should be gone.

---

## Part 3 — Create database tables (migrations)

1. Supabase → **SQL Editor** → **New query**.
2. Open each file below from your repo folder `supabase/migrations/` **in this order**, paste into the editor, click **Run** (one file at a time, or combine if you’re comfortable):

   1. `20251117201414_fc1fe62c-a87a-433f-bd3f-d99a32841c89.sql`
   2. `20251117201427_b9f3fc0a-ff28-465c-8882-8e5e6761f4a6.sql`
   3. `20251119081045_e8fe191e-d4a2-4c09-94de-46f8614873fa.sql`
   4. `20251119082327_96ef9ae6-aa71-4dc9-8c2e-f9f1f33a6b1f.sql`
   5. `20251121090756_282d67cf-163c-48ad-bfb7-ca0ae7314c89.sql`
   6. `20250601120000_staff_security_fixes.sql`
   7. `20250601130000_split_customer_staff_auth.sql`
   8. `20251201072123_625e0c49-dac3-4b24-8762-1fa6a641b4e8.sql`
   9. `20251203205746_ffac7c5b-d30f-4403-8c9c-1bc404d5131c.sql`
   10. `20251204165252_169ed5c4-24d3-45b7-969e-51bf3e79bc10.sql`
   11. `20251204165903_8c633e0e-b93a-43d5-9a3c-503af62cbd73.sql`
   12. `20251205135942_ce9c70dc-7b67-4a85-90bd-4e92a7e6fae7.sql`
   13. `20251208082951_73ccaa7d-a765-4458-a611-69effd372d8e.sql`
   14. `20250603120000_navira_company_contact.sql`
   15. `20250603140000_customer_profiles.sql`
   16. `20250603150000_sale_items_line_details.sql`
   17. `20250603160000_online_customer_orders.sql`

3. **Table Editor** should show tables like `inventory`, `sales`, `customer_profiles`.

---

## Part 4 — Auth settings (signup & login)

1. Supabase → **Authentication** → **URL configuration**.

2. **Site URL** (use your Render URL after deploy, or local for now):
   - Local: `http://localhost:8080`
   - Render: `https://navira-hardware.onrender.com` (your real Render URL)

3. **Redirect URLs** — add **both** (one per line):
   ```
   http://localhost:8080/**
   https://YOUR-RENDER-APP.onrender.com/**
   ```

4. Optional (easier testing): **Authentication** → **Providers** → **Email** → turn off **Confirm email** so users can sign in right after registering.

---

## Part 5 — Deploy on Render

### A. Push code to GitHub

Ensure your repo is on GitHub (e.g. `i-tr3nt/naviraholdings`).

### B. Create Static Site on Render

1. **[https://dashboard.render.com](https://dashboard.render.com)** → **New +** → **Static Site**.
2. Connect GitHub and select the **naviraholdings** repository.
3. Settings:

   | Field | Value |
   |-------|--------|
   | Name | `navira-hardware` |
   | Branch | `main` (or your default) |
   | Build Command | `npm install && npm run build` |
   | Publish Directory | `dist` |

4. **Environment variables** (same three as `.env`):

   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_SUPABASE_PROJECT_ID`

   Paste the **same values** from Part 2.

5. **Create Static Site** and wait for the build to finish.

### C. SPA routing (if pages 404 on refresh)

**Redirects / Rewrites** tab → add:

| Source | Destination | Action |
|--------|-------------|--------|
| `/*` | `/index.html` | **Rewrite** |

(Also included in `render.yaml` if you use Blueprint.)

### D. Update Supabase for production URL

After Render gives you a URL like `https://navira-hardware.onrender.com`:

1. Supabase → **Authentication** → **URL configuration**.
2. Set **Site URL** to that Render URL.
3. Ensure that URL is in **Redirect URLs** with `/**` at the end.

4. **Manual deploy** on Render (or push a commit) so the build picks up env vars if you added them late.

---

## Part 6 — Checklist

- [ ] Supabase project **Active**
- [ ] `.env` has correct URL + anon key (local)
- [ ] Migrations run (tables exist)
- [ ] Local: create account works
- [ ] Render: three `VITE_*` env vars set
- [ ] Render: rewrite `/*` → `/index.html`
- [ ] Supabase auth URLs include Render domain
- [ ] Production: browse products, register, checkout

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Cannot connect to Supabase | Wrong or old project URL in `.env` / Render env |
| Failed to fetch | Project deleted/paused; create new project |
| Build fails on Render | Add all three `VITE_*` variables before build |
| Blank page on `/shop` | Add rewrite rule to `/index.html` |
| Signup works locally, not on Render | Add Render URL to Supabase redirect URLs |
| Orders fail | Run migration `20250603160000_online_customer_orders.sql` |

---

## What runs where

| Piece | Where |
|-------|--------|
| Website (HTML/JS) | **Render** |
| Database + login | **Supabase** (free tier to start) |

You pay nothing to start on both free tiers; upgrade later if traffic grows.
