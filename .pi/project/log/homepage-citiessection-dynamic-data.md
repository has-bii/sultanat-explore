---
date: 2026-06-28
title: Homepage CitiesSection — dynamic API data
tags: [homepage, cities, dynamic-data, refactor]
---

- **Decision:** Renamed `DestinationsSection` → `CitiesSection`, converted from client component with static `destinationItems` to server component fetching `fetchFeaturedCities()`.
- **Decision:** Split into server `CitiesSection` (data fetch + Suspense) + client `CitiesCarousel` (carousel interactivity via `use()` pattern).
- **Decision:** Removed static `destinationItems` array from `homepage/data.ts`, deleted old `destinations-section.tsx`.
