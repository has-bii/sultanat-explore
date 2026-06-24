---
date: 2026-06-24
title: Destinations SEO Structured Data
tags: [seo, structured-data, sitemap, destinations]
---

- **Decision:** Add JSON-LD structured data (BreadcrumbList + ItemList) to destinations page
- **Decision:** Add city entries to sitemap with `fetchAllCitySlugs` fetcher
- **Decision:** Make destinations page `force-dynamic` for fresh structured data
- **Decision:** Wrap sitemap API calls in try/catch for build resilience
