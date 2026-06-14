---
date: 2026-06-14
title: Turbo Sequential Lint and Typecheck
---

- **Decision:** Use `workspace#task` override in `turbo.json` to enforce `backend#typecheck` → `frontend#typecheck` and `backend#lint` → `frontend#lint`
- **Reason:** Backend must pass first before frontend runs. Frontend may depend on shared types or contracts from backend. Preserves Turborepo cache and parallel execution benefits for independent tasks. Rejected pure sequential `pnpm -F` approach in root package.json because it kills caching.
