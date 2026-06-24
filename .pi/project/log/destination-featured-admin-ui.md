---
date: 2026-06-24
title: Destination Featured Admin UI
tags: [frontend, destination, featured]
---

- **Decision:** Added `featured` Switch toggle to destination table row for quick inline toggle.
- **Decision:** Added `featured` Checkbox to destination create/edit form.
- **Decision:** Added featured filter dropdown (Semua/Unggulan/Tidak Unggulan) to destination list filters.
- **Decision:** Changed `destinationQuerySchema.featured` from `v.boolean()` to `v.picklist(["true","false"])` with transform, matching `cityQuerySchema` pattern.
