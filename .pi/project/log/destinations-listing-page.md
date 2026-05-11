---
date: 2026-05-11
title: Destinations Listing Page
tags: [destinations, listing, search, categories, feature]
---

- **Decision:** Created `/destinations` listing page with 7 sections: Hero, Featured Destinations, Searchable Grid, Featured Attractions, Why Turkey, Social Proof, CTA
- **Decision:** Route changed from `/destinasi` to `/destinations`
- **Decision:** Multi-category data model — `categories: DestinationCategory[]` instead of single `category`. Each destination can belong to multiple categories (budaya, alam, pantai)
- **Decision:** Searchable grid with search bar (filters name/tagline/description/highlights) + category tabs (Semua/Budaya & Sejarah/Alam & Petualangan/Pantai & Pesisir)
- **Decision:** 11 destinations, 6 featured attractions, 6 why-turkey items as seed data
- **Decision:** Featured destinations use bigger cards in 2-col grid; all-destinations grid uses uniform cards
- **Reason:** Single category too rigid — Cappadocia is both nature and culture, Antalya is both beach and culture
