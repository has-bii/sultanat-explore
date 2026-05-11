---
date: 2026-05-11
title: Services Section Refinement
tags: [architecture, homepage, services]
---

- **Decision:** Each service (Open Trip, Private Trip, Umrah) gets its own full section — not a single card grid
- **Decision:** Each section shows explanation + featured trip cards (horizontal row, scrollable on mobile)
- **Decision:** Trip cards show: image, name, destination, duration, price (IDR), inclusions (icon + label chips)
- **Decision:** Trip data lives in `src/features/homepage/data.ts` — typed placeholder data, ready for CMS swap
- **Decision:** About section redesigned — single paragraph, minimal, text-only, centered `max-w-2xl`
- **Decision:** Section components moved from `src/components/sections/` to `src/features/homepage/components/` per convention
- **Decision:** Barrel export via `src/features/homepage/index.ts`
