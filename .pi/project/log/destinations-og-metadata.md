---
date: 2026-06-24
title: Destinations OG Metadata and Images
tags: [seo, og, open-graph, metadata, destinations, twitter-card]
---

- **Decision:** Add OpenGraph + Twitter card metadata to root layout (default OG image, site info)
- **Decision:** Replace static metadata with dynamic `generateMetadata` on destinations page (canonical, OG, Twitter, conditional robots noindex for filtered views)
- **Decision:** Add OG image assets (`/og/default.svg`, `/og/destinations.svg`)
- **Decision:** Disallow filtered destination URLs (`/destinations?category`, `/destinations?search`) in robots.txt
