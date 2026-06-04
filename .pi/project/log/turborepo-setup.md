---
date: 2026-06-04
title: Turborepo Setup
tags: [turborepo, monorepo, build]
---

- **Decision:** Added Turborepo to the monorepo for task orchestration and caching
- **Decision:** Configured `globalPassThroughEnv` for all app secrets (auth, database, resend)
- **Decision:** Kept `.env` in `frontend/` directory
- **Reason:** Next.js in workspace setup requires `.env` in the frontend package for proper loading
