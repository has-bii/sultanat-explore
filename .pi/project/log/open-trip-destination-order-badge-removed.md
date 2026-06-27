---
date: 2026-06-27
title: OpenTrip Destination Order Badge Removed
tags: [open-trip, frontend, itinerary, ui]
---

- **Decision:** Removed the read-only order badge (the `destIndex + 1` numeric) from each destination row in the admin OpenTrip form. Destination order remains derived from array index, reordered via ↑/↓ buttons, and reindexed at submit — only the visible position number was dropped.
- **Reason:** Operator doesn't need to see the rendered order; the position is implicit from row order. Removing it declutters the row.
- **Note:** `destIndex` is still used internally for the field name path (`cities[${cityIndex}].destinations[${destIndex}].destinationId`) and for `isFirst`/`isLast`/move handlers, so no schema or submit-shape change.
- **Predecessor:** [open-trip-itinerary-fields-alignment.md](open-trip-itinerary-fields-alignment.md).