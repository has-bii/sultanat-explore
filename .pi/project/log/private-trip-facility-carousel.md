---
date: 2026-05-11
title: Private Trip Facility Cards Redesign
tags: [private-trip, facility-card, carousel, embla]
---

- **Decision:** FacilityCard redesigned with image-top layout — full-bleed Unsplash image with gradient overlay, icon + title + description below
- **Decision:** Added `image: string` field to `Facility` type in `data.ts` — applies to both private trip and umrah facilities
- **Decision:** Switched facility grid to Embla carousel (`loop: true`, `align: "start"`)
- **Decision:** Mobile: 1 card per view (`basis-full`), desktop: 2 cards (`sm:basis-1/2`)
- **Decision:** Carousel nav centered on mobile, left-aligned on desktop (`justify-center sm:justify-start`)
- **Decision:** Custom prev/next buttons + dot indicators instead of shadcn defaults
- **Reason:** Image cards feel more premium than text-only. Carousel adds interactivity and saves vertical space on mobile.
