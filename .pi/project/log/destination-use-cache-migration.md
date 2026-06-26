---
date: 2026-06-26
title: Destination use cache Migration
tags: [frontend, destination, caching]
---

- **Decision:** Replaced react cache() with "use cache" directive in featured destinations fetcher
- **Decision:** Removed unnecessary async from FeaturedDestinations component
- **Reason:** React 19 "use cache" is the modern replacement for cache(), simpler and aligns with Next.js caching model
