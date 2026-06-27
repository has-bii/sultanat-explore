---
date: 2026-06-28
title: Remove Open Trip Query Filters
tags: [open-trip, backend, cleanup]
---

- **Decision:** Removed `startAtFrom`, `startAtTo`, `priceMin`, `priceMax` from `openTripQuerySchema` and the corresponding filter logic in `listOpenTrips`.
- **Reason:** Unused by any frontend caller — dead code.
