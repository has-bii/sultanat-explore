---
date: 2026-06-17
title: Query and Mutation Conventions
tags: [conventions, react-query, frontend]
---

- **Decision:** Standardize query and mutation implementation patterns across all feature modules.
- **Decision:** Create `.pi/project/frontend/QUERY-MUTATION.md` as the living guideline for `features/<name>/queries/` and `features/<name>/mutations/`; link from `FRONTEND.md`.
- **Decision:** Detail query keys nested under `all()` prefix (e.g. `["articles", "detail", id]`) instead of separate root keys.
- **Decision:** Remove per-query `staleTime` overrides; rely on global `QueryClient` default (`5 * 60 * 1000`).
- **Decision:** Every mutation exports a `MUTATION_KEY` const. Entity-scoped mutations include `id` in the key only when using Option 2.
- **Decision:** Update/delete mutations support two hook signatures: Option 1 (`useX() → mutate(id|{id,...})`) for list pages, Option 2 (`useX(id) → mutate()`) for detail pages.
- **Decision:** Invalidation uses `exact: false` for broad `queryKeys.all()` invalidation and `exact: true` for specific detail/sub-resource invalidation.
- **Decision:** Use `import type { InferRequestType, InferResponseType } from "hono"` in all query/mutation files.
- **Reason:** Existing modules (article, attraction, category, destination, image, user) had inconsistent patterns for query keys, staleTime, mutation keys, invalidation scope, and type imports. A single convention doc reduces drift and makes CRUD feature implementation predictable.
