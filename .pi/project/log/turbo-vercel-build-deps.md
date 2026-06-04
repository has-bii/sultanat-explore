---
date: 2026-06-04
title: Turbo & Vercel Build Dependencies
tags: [turbo, vercel, build]
---

- **Decision:** `build` task in turbo.json now depends on `typecheck` and `lint`
- **Decision:** Removed `^build` dependency from `typecheck` and `lint` tasks (was creating circular deps)
- **Decision:** Simplified vercel.json `buildCommand` from `pnpm typecheck && pnpm lint && pnpm build` to `pnpm build`
- **Reason:** Let turborepo manage the task graph, avoid redundant commands in Vercel
