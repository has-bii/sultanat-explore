---
date: 2026-06-27
title: OpenTrip Model Simplification
tags: [opentrip, schema, backend, migration]
---

- **Decision:** `OpenTripCity` drops `departAt` and `order` (+ `@@unique([openTripId, order])`). City fields are now `id, openTripId, cityId, arriveAt, createdAt, updatedAt`. City stop sequence is implied chronologically by `arriveAt`, not by an explicit index.
- **Decision:** `OpenTripDestination` drops `visitAt`; adds required `order Int`; restores `@@unique([openTripCityId, order])`. Destinations within a city are sequenced by `order` (unique per city), with no per-destination visit timestamp.
- **Decision:** Backend `open-trip` module re-aligned to the new model. `validateCityDateRanges` removed (no `departAt` to range-check), replaced by `validateCities` which guards duplicate per-city destination `order` values before the DB can fail with P2002. `includeDetail.cities.destinations.orderBy` switched from `visitAt asc` to `order asc`. Create/update nested writes emit `order` instead of `visitAt`, and no longer write `departAt`.
- **Decision:** Migrations applied — `20260627093634_simplify_open_trip_dates` (drop `order` + unique indexes on both tables) then `20260627120937_open_trip_drop_timing` (drop `departAt` + `visitAt`, re-add required `order` on destination, recreate `open_trip_destination_openTripCityId_order_key`).
- **Reason:** Simplify the itinerary timeline — a city stop is just an arrival on the schedule, and destinations within a city are an ordered checklist, not dated sub-events. Removes two timestamp fields that were always optional/implied and one redundant manual index.
- **Followups:** Frontend OpenTrip feature no longer typechecks (consumes dropped `departAt`/`visitAt`). Alignment PRD created at `.pi/project/prd/open-trip-itinerary-fields.md`.