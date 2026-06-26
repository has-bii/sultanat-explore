---
date: 2026-06-26
title: Public Fetchers Try/Catch for Build Prerender
tags: [build, prerender, cache-components, fetch, public]
---

- **Decision:** Wrap all public fetchers (`article`, `city`, `destination` public libs) in try/catch and return safe fallbacks (`[]` / `null`) on failure.
- **Decision:** Do NOT use `export const dynamic = "force-dynamic"` on public pages. It is incompatible with `nextConfig.cacheComponents` (Next 16) — build throws "Route segment config dynamic is not compatible with cacheComponents".
- **Reason:** Backend API mounted via Hono route handler at `/api/[[...route]]` (same Next app, port 3000). During `next build` no server is running, so `apiClient` HTTP fetches to `NEXT_PUBLIC_API_URL=http://localhost:3000` fail with `ECONNREFUSED`. Fetchers are inside `"use cache"` boundaries, so the failure aborts static page generation. try/catch lets pages prerender as empty shells and the cache warms on first prod request (revalidate 15m).
- **Precedent:** Matches existing pattern in `fetchAllCitySlugs` and `src/app/sitemap.ts` which already swallow build-time fetch errors.
- **Caveat:** `fetchFeaturedDestinations` previously `throw new Error()` on `!resData.success` — now returns `[]`. Behaviour change intentional.
- **Follow-up option:** Cleaner upgrade = call Hono `app.request()` directly (bypass HTTP) during prerender so pages build with real data. Not done now.