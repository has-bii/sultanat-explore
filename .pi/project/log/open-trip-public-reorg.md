---
date: 2026-06-28
title: Open Trip Public Components Reorganization
tags: [frontend, open-trip, refactor, convention]
---

- **Decision:** Moved public-facing open-trip components from `components/` to `public/` subdirectory
- **Decision:** Removed barrel `index.ts` in favor of direct imports from `@/features/open-trip/public/<file>`
- **Decision:** Added `RelatedOpenTrips` component on destination detail page using new city-slug endpoint
- **Reason:** Separate public vs admin open-trip components; clear directory boundary matches the routing convention.
