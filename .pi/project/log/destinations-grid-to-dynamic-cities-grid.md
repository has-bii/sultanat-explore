---
date: 2026-06-24
title: DestinationsGrid to Dynamic CitiesGrid
tags: [frontend, destinations, city, react-query, nuqs]
---

- **Decision:** Replaced static `DestinationsGrid` (`features/destinations`) on `/destinations` with dynamic `CitiesGridSection` (`features/destination/public/components/cities-grid`) backed by `/api/cities` + `/api/city-categories`.
- **Decision:** Architecture = hybrid (option C): server prefetch via `HydrationBoundary` + per-component `Suspense`, client `useSuspenseInfiniteQuery` / `useSuspenseQuery` reads dehydrated cache. Mirrors `article-list-section` convention exactly.
- **Decision:** Filters via nuqs URL state — `category` (non-shallow, server prefetch per tab) + `search` (shallow, 500ms debounce). Category filter toggles active tab to null (no explicit "Semua" pill).
- **Decision:** Search scope = API `search` param only (name STARTS-WITH, case-insensitive). Accepted regression vs old static multi-field (name+tagline+description+highlights) match. Widening backend search is out of scope.
- **Decision:** Pagination = single fetch `limit: "100"`, first-page-only. City roster stays low-double-digits; avoids pagination UX overhead. Swap to "load more" if roster ever exceeds 100.
- **Decision:** Card design ported from old static `destinations-grid` (4-col, category-pill overlay on image, name + tagline + "Lihat detail") but driven by dynamic fields — `city.categories[].name` (no label map), `city.image.url/alt`, link `/destinations/{slug}`.
- **Decision:** Kept `/destinations/{slug}` URL on city cards — detail page still static (out of scope). Old `DestinationsGrid` file + barrel export left in place (only the page consumed it).