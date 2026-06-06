---
date: 2026-06-07
title: Query Factory Hook Pattern
tags: [frontend, convention, react-query]
---

- **Decision:** Standardize on `useQuery` / `useInfiniteQuery` as return values from query factory hooks, replacing `queryOptions` / `infiniteQueryOptions` object-returning pattern.
- **Decision:** Rename factory functions from `getXxxQueryOptions` to `useXxxQuery` / `useXxxDetailQuery`.
- **Decision:** Components call `useXxxQuery(...)` directly — no wrapping `useQuery(getXxxQueryOptions(...))` at call site.
- **Reason:** Reduces boilerplate at call sites, aligns conventions with TanStack Query docs, makes RSC boundaries clearer.
