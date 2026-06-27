---
date: 2026-06-28
title: OpenTrip Form Date Normalization
tags: [open-trip, form, validation, valibot]
---

- **Decision:** Normalize all incoming date values to `YYYY-MM-DD` in `useOpenTripForm` via a `toDate()` slicer, applied to `startAt`, `endAt`, and `cities[i].arriveAt`.
- **Decision:** Remove redundant `new Date(...).toISOString()` conversions in `edit-open-trip.page.tsx` — values now pass through unchanged.
- **Reason:** `createOpenTripSchema` uses `v.isoDate` (expects `YYYY-MM-DD`) and `DateField` renders `<input type="date">`. The edit page fed full ISO datetimes (`…T00:00:00.000Z`), so the `onChange` validator failed on every date field at load. Fixing the single shared entry point (`useOpenTripForm`) covers both create and edit; `DateField` already slices for display and writes `YYYY-MM-DD` on change.