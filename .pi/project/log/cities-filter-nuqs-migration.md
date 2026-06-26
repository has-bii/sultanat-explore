---
date: 2026-06-26
title: Cities Filter nuqs Migration
tags: [frontend, cities, nuqs, filter]
---

- **Decision:** Migrated cities grid category filter from Link-based URL navigation to nuqs useQueryState
- **Decision:** Removed intermediate CategoryFilterContent wrapper component, simplified data flow
- **Decision:** Added fetchAllCities server cache function for infinite query prefetch
- **Reason:** Client-side category filtering without full page navigation; prefetch via server cache eliminates query function dependency in prefetch
