---
date: 2026-06-26
title: Related Cities API Endpoint
tags: [api, city, endpoint]
---

- **Decision:** Added `GET /api/cities/slug/:slug/related` public endpoint for fetching related cities.
- **Decision:** "Related" defined as cities sharing at least one CityCategory. Returns max 6 cities, excludes self.
- **Reason:** Needed for city detail page to show related/similar cities to visitors.
