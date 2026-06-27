---
date: 2026-06-28
title: Open Trip City Endpoint — return endAt instead of excerpt
tags: [backend, open-trip, api]
---

- **Decision:** Changed `getOpenTripsByCitySlug` select from `excerpt` to `endAt`
- **Reason:** The frontend related-open-trips component needs the end date to display trip duration, not the excerpt.
