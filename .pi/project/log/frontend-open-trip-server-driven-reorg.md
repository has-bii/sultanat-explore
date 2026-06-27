---
date: 2026-06-28
title: Frontend Open Trip — server-driven trip list + component reorg
tags: [frontend, open-trip, refactor]
---

- **Decision:** TripList now fetches from API via `getPublicOpenTripsQueryOptions` instead of receiving static `openTrips` data
- **Decision:** Moved TripCard and TripList into `components/` subdirectory under `public/`
- **Decision:** Added `TripListSkeleton` for Suspense fallback during streaming
- **Decision:** Extracted `format-price.ts` utility into `@/utils/` for reuse
- **Decision:** Removed `generateStaticParams` from detail page (no longer static)
- **Decision:** Replaced `formatDate` re-export with direct `date-fns` usage in `RelatedOpenTrips`
