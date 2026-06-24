---
date: 2026-06-24
title: City List Category Filter by Slug
tags: [city, category, query, backend]
---

- **Decision:** ListCities accepts `category` slug query param (not `categoryId` UUID).
- **Decision:** Slug resolved to id in service; empty page returned when slug not found.
- **Reason:** Matches Article module pattern. Frontend-friendly — no UUID exposure. Slug unique + indexed → cheap lookup.
