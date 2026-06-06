---
date: 2026-06-07
title: Query Factory Options Pattern
tags: [frontend, convention, react-query]
---

- **Decision:** Standardize on `queryOptions` / `infiniteQueryOptions` factory functions in `features/<name>/queries/`.
- **Decision:** Always use `useQuery` for `queryOptions` and `useInfiniteQuery` for `infiniteQueryOptions`. Never mix.
- **Decision:** Create `infiniteQueryOptions` for cursor-based pagination response data.
- **Reason:** Separates query config from hook call, enables reuse across components, makes RSC boundaries explicit.
