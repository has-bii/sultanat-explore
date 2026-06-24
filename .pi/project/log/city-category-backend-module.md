---
date: 2026-06-24
title: City Category Backend Module
tags: [backend, database, city, category, m2m]
---

- **Decision:** New `CityCategory` model, separate from article `Category`.
- **Decision:** Implicit M2M with `City` (no join model, no link ordering).
- **Decision:** Inline `categoryIds` on City create/update (Prisma `set`); no separate sync endpoint.
- **Decision:** `[]` unlinks all categories; omitting `categoryIds` leaves relation untouched.
- **Decision:** Delete category unrestricted — Prisma drops links, cities kept.
- **Decision:** Uniqueness on `slug` only; name not unique. No `_count.cities` on list response. No pagination.
- **Reason:** Mirror of article `category` module; city categories filter/group cities frontend-side later.