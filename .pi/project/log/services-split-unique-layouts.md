---
date: 2026-05-11
title: Services Split Unique Layouts
tags: [homepage, services, architecture, design]
---

- **Decision:** Split single `ServiceSection` into 3 unique components: `open-trip-section.tsx`, `private-trip-section.tsx`, `umrah-section.tsx`
- **Decision:** `services-section.tsx` becomes thin composer importing the three
- **Decision:** Open Trip — horizontal scroll cards with trip data, dynamic-ready. White bg. Text link CTA
- **Decision:** Private Trip — two-column layout (text left, 2x4 facility grid right). `bg-muted/30`. Solid button CTA. Shows facilities instead of trip cards
- **Decision:** Umrah — dark teal gradient bg, diamond geometric pattern, amber/gold accent color. Centered layout, 4-col facility grid. Amber outline CTA. Spiritual aesthetic distinct from Private Trip
- **Decision:** New `Facility` type in data.ts: `{ icon: string, title: string, description: string }`. Facility data for Private Trip (8 items) and Umrah (8 items)
- **Decision:** data.ts restructured: individual exports (`openTripService`, `privateTripService`, `umrahService`) replacing old `services` array
- **Decision:** Facilities are provisional — user will adjust items/descriptions later
