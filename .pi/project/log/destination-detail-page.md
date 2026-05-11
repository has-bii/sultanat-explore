---
date: 2026-05-11
title: Destination Detail Page
tags: [destinasi, detail-page, ssg]
---

- **Decision:** Destination detail page at `/destinations/[slug]` with SSG via `generateStaticParams`
- **Decision:** Components: DetailHero, AboutSection, GallerySection, RelatedTrips, OtherDestinations — all in `src/features/destinations/components/`
- **Decision:** Related trips matched by checking if open trip `destination` field contains the destination `name`
- **Decision:** Gallery uses client component with thumbnail selector
- **Reason:** Follows existing open-trip detail page pattern, achromatic design system, RSC by default with `"use client"` only where needed
