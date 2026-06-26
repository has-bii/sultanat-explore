---
date: 2026-06-26
title: CacheLife Hours for Data Fetchers
tags: [cache, performance, nextjs]
---

- **Decision:** Added `cacheLife("hours")` to all `"use cache"` functions in article, city, and destination fetch modules.
- **Reason:** Controls cache duration for server-side data fetches, ensuring stale data refreshes hourly.
