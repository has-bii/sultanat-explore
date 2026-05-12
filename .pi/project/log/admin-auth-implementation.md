---
date: 2026-05-12
title: Admin Auth Implementation
tags: [auth, better-auth, prisma, tanstack-form, admin]
---

- **Decision:** Better Auth + Prisma 7 (PostgreSQL) for admin authentication. Predefined admins only, no registration, no RBAC.
- **Decision:** Prisma 7 uses `prisma.config.ts` for datasource URL + seed command (no `url` in schema, adapter-based `PrismaClient`).
- **Decision:** Docker Compose for Postgres (OrbStack PG on 5432 used instead).
- **Decision:** `useAppForm` (TanStack Form `createFormHook`) with `form.Subscribe` for reactive submit button state.
- **Decision:** `src/proxy.ts` (Next.js 16) for route protection instead of `middleware.ts`.
- **Decision:** Resend for password reset emails (stubbed with console.log when API key missing).
- **Decision:** Zod v4 — import from `"zod"` directly, no `/v4` subpath.
- **Decision:** Better Auth client method is `requestPasswordReset` (not `forgetPassword`).
