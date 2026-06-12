---
date: 2026-06-13
title: AttractionCategory + AttractionGallery Abandoned
tags: [schema, decision, cleanup]
---

- **Decision:** Drop `AttractionCategory` and `AttractionGallery` (a.k.a. `AttractionImage`) from the data model and codebase.
- **Why:** Planned in the 2026-06-07 PRD alongside Destination/Attraction, but never built. Attractions stay flat: `name`, `description`, `cover imageId`, `destinationId`. No category enum, no per-attraction gallery. Destination keeps its own gallery.
- **What shipped:** Schema, modules, and routes for `Destination`, `DestinationImage` (destination gallery), and `Attraction` only.
- **Cleanup done:**
  - Removed phantom `category` select from `backend/src/modules/destination/destination.service.ts` (it referenced a non-existent `AttractionCategory.attractions` relation and would have thrown at runtime).
  - Deleted 3 superseded log entries: `validation-migration-valibot.md`, `destination-attraction-crud-complete.md`, `destination-attraction-crud-prd.md` (they claimed the abandoned features existed).
  - Scrubbed `ARCHITECTURE.md` and `CODEBASE-DIRECTORY.md` of `AttractionCategory` / `AttractionImage` references.
  - Removed stale generated files `src/generated/prisma/models/AttractionCategory.ts` and `AttractionImage.ts`.
  - No Prisma migration needed — schema was never deployed with these models.
- **Rule for future work:** If a feature is planned but not built within the same session, don't pre-document it in `CODEBASE-DIRECTORY.md` / `ARCHITECTURE.md` / LOG until code lands.
