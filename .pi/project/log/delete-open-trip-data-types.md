---
date: 2026-06-28
title: Delete open-trip data.ts and types.ts — inline to callers
tags: [frontend, open-trip, refactor, cleanup]
---

- **Decision:** Deleted `features/open-trip/data.ts` and `features/open-trip/types.ts`.
- **Decision:** Inlined static data (`trustBadges`, `howItWorks`, `socialStats`, `galleryImages`) directly into each consuming component.
- **Decision:** Inlined `formatDate` as a local function in `itinerary-section.tsx`, `inclusion-section.tsx`, and `page.tsx`.
- **Decision:** Replaced `formatPrice` import with `@/utils/format-price` in `inclusion-section.tsx`.
- **Decision:** Inlined `WHATSAPP_BASE` constant in `inclusion-section.tsx`.
- **Reason:** Eliminate barrel data file with mixed concerns (static mock data, utilities, constants). Each caller now owns its own data — easier to find, no dead exports.
