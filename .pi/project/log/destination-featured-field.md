---
date: 2026-06-24
title: Destination Featured Field
tags: [backend, prisma, destination]
---

- **Decision:** Added `featured Boolean @default(false)` to Destination model, matching City and Article pattern.
- **Decision:** `featured` is settable on both create and update endpoints.
- **Decision:** `GET /api/destinations?featured=true` filter added to list endpoint.
- **Decision:** No limit on featured count. No sort-by-featured added.
