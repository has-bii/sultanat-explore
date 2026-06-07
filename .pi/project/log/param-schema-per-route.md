---
date: 2026-06-07
title: Per-Route Param Schemas
tags: [backend, validation, zod]
---

- **Decision:** Use per-route param schemas instead of single shared schema with optional fields.
- **Reason:** Single `attractionParamsSchema` with optional `id`/`imageId` forced non-null assertions (`!`) in handlers. Splitting into `listParamsSchema`, `idParamsSchema`, `galleryImageParamsSchema` makes types exact per route — no `!` needed.
