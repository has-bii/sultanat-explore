---
date: 2026-06-28
title: Open Trip Related by City Endpoint
tags: [api, open-trip, endpoint]
---

- **Decision:** Added public endpoint `GET /open-trip/city/:citySlug` to return published open trips that visit a given city.
- **Decision:** Uses custom `select` instead of `includeList` — adds `inclusions` with label so the card can show include/exclude items at a glance.
- **Decision:** Param is `citySlug` (not UUID) — matches existing public city routes, frontend passes slug directly from URL.
- **Reason:** For city detail page "related open trips" section. No pagination, no filters — minimal endpoint.
