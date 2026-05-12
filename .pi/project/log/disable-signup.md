---
date: 2026-05-13
title: Disable Public Sign Up
tags: [auth, better-auth, admin]
---

- **Decision:** Set `disableSignUp: true` on `emailAndPassword` in Better Auth config
- **Reason:** Auth is admin-only. Public sign-up blocked at route level. Admin user created via `prisma/seed.ts` (server-side API call, bypasses route check).
