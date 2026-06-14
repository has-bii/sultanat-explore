---
date: 2026-06-14
title: Suspense: Replace dynamic/ssr:false with React Suspense
tags: [suspense, convention, frontend, react]
---

- **Decision:** Replace all `next/dynamic({ ssr: false })` + `export default` patterns with named exports + `<Suspense fallback={...}>` at call sites
- **Decision:** Remove `// @suspense` comment requirement
- **Decision:** Remove `export default` requirement for Suspense components — all components use named exports
- **Reason:** React `<Suspense>` is the standard way to handle `useSuspenseQuery`/`useSuspenseInfiniteQuery` boundaries. `next/dynamic({ ssr: false })` is unnecessary indirection. Named exports are consistent with the rest of the codebase.
- **Created:** `ClientOnly` component at `@/components/client-only.tsx` — wraps children to prevent SSR/hydration mismatch for client-only content
- **Updated:** `MainPageContent` now uses `ClientOnly` wrapper around children