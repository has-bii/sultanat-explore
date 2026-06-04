---
date: 2026-06-04
title: Monorepo Restructure
tags: [architecture, monorepo, config]
---

- **Decision:** Restructure to explicit monorepo with `backend/` and `frontend/` packages
- **Decision:** Root `package.json` has Prettier + convenience scripts only (`dev`, `build`, `typecheck`, `lint`)
- **Decision:** TypeScript base config at root, packages extend it
- **Decision:** ESLint configs separate per package (Next.js needs specific rules)
- **Decision:** Single `.env` at root, moved to `frontend/.env` so Next.js picks it up
- **Decision:** `vercel.json` stays at root (monorepo deploy, backend bundled into frontend)
- **Reason:** Cleaner separation, each package self-contained but orchestrated from root
