---
date: 2026-06-14
title: Shared Order Direction Schema
tags: [backend, schema, valibot, DRY]
---

- **Decision:** Extract shared `orderDirectionSchema` (`asc`/`desc` picklist, default `desc`) to `backend/schemas/query.schema.ts`.
- **Reason:** `order` field was duplicated identically across destination, image, attraction query schemas. Single source of truth now — change default or values in one place.
