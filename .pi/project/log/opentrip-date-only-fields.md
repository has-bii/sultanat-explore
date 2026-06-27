---
date: 2026-06-27
title: OpenTrip Date-Only Fields
tags: [open-trip, prisma, schema]
---

- **Decision:** Changed `OpenTrip.startAt`, `OpenTrip.endAt`, and `OpenTripCity.arriveAt` from `DateTime` (timestamp) to `DateTime @db.Date` (date-only).
- **Decision:** Updated backend schema validation from `v.isoTimestamp()` to `v.isoDate()` and frontend form inputs from `datetime-local` to `date`.
- **Reason:** These fields represent trip dates, not precise times — date-only is semantically correct and simpler to work with.
