---
date: 2026-05-12
title: Vercel Deployment + Prisma Migration CI
tags: [vercel, prisma, supabase, github-actions, deployment]
---

- **Decision:** Added `postinstall: "prisma generate"` to `package.json` for Vercel builds
- **Decision:** Created GitHub Actions workflow (`.github/workflows/migrate.yml`) to run `prisma migrate deploy` on push to main when `prisma/` files change
- **Decision:** Use Supabase **direct connection** (port 5432, `db.xxx.supabase.co`) for migrations — not pooler. Pooler (pgbouncer) incompatible with DDL statements
- **Reason:** Migrations alter schema → need direct connection. Pooler is for app queries only.
- **Decision:** Added `prisma db seed` step after migration in CI — runs seed after every schema change on main
