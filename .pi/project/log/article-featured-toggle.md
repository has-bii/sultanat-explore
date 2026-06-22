---
date: 2026-06-22
title: Article Featured Toggle via Existing PATCH
tags: [article, api, featured]
---

- **Decision:** Featured flag edited via existing `PATCH /articles/:id` (no dedicated toggle route). Added `featured: v.boolean()` to `createArticleSchema` — `updateArticleSchema = v.partial(...)` inherits optional `featured?`.
- **Decision:** Explicit set shape (`{ featured: boolean }`), not true flip. Caller sends target state.
- **Reason:** Idempotent (safe vs retry/double-click), matches City module precedent (`featured` on its update schema, no toggle endpoint), fewer files touched, fits existing partial-update flow.
