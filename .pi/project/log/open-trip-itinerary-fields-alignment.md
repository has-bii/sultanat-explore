---
date: 2026-06-27
title: OpenTrip Form Itinerary Fields Alignment
tags: [open-trip, frontend, forms, itinerary]
---

- **Decision:** Removed `departAt` from city stops; `arriveAt` is the only per-city timestamp and implies city order.
- **Decision:** Replaced per-destination `visitAt` datetime picker with array-position order (`order`). Reordering is via ↑/↓ buttons using TanStack Form `moveValue`; a read-only numeric badge shows the position.
- **Decision:** Derived `order` from array index and reindex `cities[i].destinations[j].order = j` at submit time in `use-open-trip-form.ts`, so duplicate/gap orders can never be submitted.
- **Decision:** Did NOT use `@dnd-kit` for destination reorder. It is not installed (the PRD's technical note was wrong); the gallery feature actually uses `motion/react` drag-swap. Up/down buttons satisfy every acceptance criterion with zero new deps and shorter diff than porting the motion grid hit-test to a vertical list.
- **Decision:** Chose up/down buttons over the PRD's R2-b drag recommendation because R2-b needs product sign-off (PRD is Draft) and a new dependency; up/down is the cheaper working solution.
- **Reason:** The admin OpenTrip form was broken against the simplified backend types (`OpenTripCity` lost `departAt`, `OpenTripDestination` swapped `visitAt` for `order`). PRD: `prd/open-trip-itinerary-fields.md`.
- **Note:** The same backend commit that simplified the model also made `startAt`/`endAt` required in `createOpenTripSchema` (the PRD's model-delta table omitted this). Aligned the form hook to treat them as required `string` (default `""`) so `pnpm --filter frontend typecheck` reaches zero errors. The Date Range card's "Kosongkan untuk otomatis dari kota pertama/terakhir" copy is now stale (service no longer auto-derives from cities) — left untouched as it is outside this PRD's enumerated scope; follow-up if misleading.