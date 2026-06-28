---
date: 2026-06-29
title: Unified GallerySection across all public pages
tags: [gallery, frontend, refactor]
---

- **Decision:** Replaced per-page masonry gallery components (`PastTripGallery`, `Gallery`) in open-trip, private-trip, and umrah pages with the homepage's `GallerySection` (animated scrolling columns backed by backend gallery data).
- **Decision:** `GallerySection` now accepts `type`, `title`, and `subtitle` props with defaults that preserve existing homepage behavior.
- **Decision:** Deleted old gallery component files, their `galleryImages` hardcoded data, and unused `GalleryImage` types from each feature's `data.ts` and `types.ts`.
- **Reason:** The backend already supports `GalleryType` enum (`home`, `open_trip`, `private_trip`, `umrah`) — no reason to maintain 3 separate hardcoded masonry galleries when one dynamic component covers all pages.
