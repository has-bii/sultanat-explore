---
date: 2026-06-14
title: Scripts config and AGENTS.md fixes
tags: [config, turbo, scripts, docs]
---

- **Decision:** Added `start` script to root `package.json` and `start` task to `turbo.json` (depends on build, persistent).
- **Decision:** Changed frontend `lint` script from bare `eslint` to `eslint .`.
- **Decision:** Updated AGENTS.md commands — `npx tsc --noEmit` → `pnpm typecheck`, `npx prettier` → `pnpm format`, `npx shadcn@latest add` → `pnpm dlx shadcn@latest add <component> -c frontend` (monorepo fix).
