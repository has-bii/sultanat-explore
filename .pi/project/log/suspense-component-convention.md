---
date: 2026-06-14
title: Suspense Component Convention
tags: [convention, frontend, react-query, dynamic-import]
---

- **Decision:** Components using `useSuspenseQuery` or `useSuspenseInfiniteQuery` must `export default` (never barrel-export). Paired with a `<Name>Skeleton` (e.g. `AttractionTableSkeleton`). Consumed via `next/dynamic` with `ssr: false` and `loading: <Name>Skeleton`.
- **Reason:** `useSuspenseQuery` suspends the tree — `dynamic` + `ssr: false` creates a client-side Suspense boundary. Skeleton shows immediately, avoids layout shift. `export default` ensures clean code-splitting; barrel exports break `next/dynamic` tree-shaking. Naming: `<Name>Skeleton` (not Fallback) matches existing codebase pattern.