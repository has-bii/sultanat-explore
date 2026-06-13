---
date: 2026-06-13
title: Separate Attraction Module from Destination
tags: [backend, api, routing, attraction]
---

- **Decision:** Move attraction routes from nested `/destinations/:destinationId/attractions` to top-level `/attractions`.
- **Decision:** `destinationId` moves from URL param to required field in `createAttractionSchema` body and optional query param in `attractionQuerySchema`.
- **Reason:** Decouple attraction from destination routing — simpler API surface, independent module.
- **No changes:** DB schema, frontend, Prisma model — all unchanged.
