---
date: 2026-06-07
title: Backend CRUD PRD for Destination/Attraction
tags: [backend, crud, destination, attraction, prd]
---

- **Decision:** Backend CRUD for Destination, DestinationImage, AttractionCategory, Attraction, AttractionImage — 5 phases
- **Decision:** GETs public, mutations behind `requireAuth` — same pattern as Image module
- **Decision:** Slugs (Destination + AttractionCategory) auto-generated from `name`, even on update
- **Decision:** Highlights field as simple `string[]`, max 20 items
- **Decision:** Gallery management via individual add/remove/reorder endpoints (not bulk replace)
- **Decision:** Reorder via full ordered imageId array, backend recalculates `order`
- **Decision:** Attraction routes nested under destination (`/destinations/:destinationId/attractions/...`)
- **Decision:** Destination update — all fields modifiable except slug (auto-regen)
- **Decision:** Attraction update — `destinationId` locked
- **Decision:** List responses include relations (image, category, `_count`)
- **Decision:** Cursor-based pagination — consistent with Image module
- **Decision:** AttractionCategory deletion uses `onDelete: SetNull` — attractions lose category
- **Decision:** Destination deletion cascades to attractions + galleries, hero image stays
- **Decision:** List endpoints support search by name, filter (featured/categoryId), sort (name/createdAt)
- **Decision:** Separate backend modules: `destination/`, `attraction/`, `attraction-category/`
- **Schema change:** `AttractionCategory.label` removed, replaced by `slug` (unique)
- **Schema change:** `Attraction.categoryId` made optional (`String? @db.Uuid`), `onDelete: SetNull`
