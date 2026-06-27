---
date: 2026-06-28
title: Backend listOpenTrips — explicit select
tags: [backend, open-trip, refactor]
---

- **Decision:** Replaced `include` with explicit `select` in `listOpenTrips` to reduce API response payload
- **Reason:** Only public-facing fields needed (id, slug, title, status, excerpt, price, startAt, endAt, inclusions labels, coverImage); removes unnecessary eager-loading from detail include
