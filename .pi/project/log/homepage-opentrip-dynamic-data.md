---
date: 2026-06-28
title: Homepage OpenTripSection — dynamic API data
tags: [frontend, homepage, open-trip, react-query]
---

- **Decision:** Replace static `openTripService` data in `OpenTripSection` with live API data via `useSuspenseInfiniteQuery`
- **Decision:** Reuse `getPublicOpenTripsQueryOptions` from open-trip feature instead of duplicating fetch logic
- **Decision:** Remove `openTripTrips`, `openTripService`, `Trip`, `Inclusion` from `homepage/data.ts` — no longer needed
- **Decision:** Add `Suspense` boundary with skeleton fallback in `ServicesSection`
