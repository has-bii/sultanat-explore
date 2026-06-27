---
date: 2026-06-28
title: Open Trip Detail Page — dynamic API fetch refactor
tags: [frontend, open-trip, api, refactor]
---

- **Decision:** Refactored open-trip detail page (`[slug]/page.tsx`) from static data to dynamic server-side fetch via `fetchOpenTripBySlug`.
- **Decision:** Itinerary renders from `cities` array (with nested destinations) instead of static `ItineraryDay[]`. Each city shows arrival date + destination list.
- **Decision:** Inclusions split by `type: "include" | "exclude"` with ✓/✗ icons. Dropped emoji icons, highlights, seats — none exist in DB schema.
- **Decision:** Duration computed from `startAt`/`endAt`. Description rendered as Tiptap JSON via `renderArticleContent` (same extensions as article editor).
- **Decision:** Added `loading.tsx` with header + description skeleton (first 2 sections only).
