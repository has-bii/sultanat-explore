---
date: 2026-06-27
title: OpenTrip Destination Filter by City
tags: [open-trip, itinerary, destination, ux]
---

- **Decision:** Remove duplicate "Destinasi" label from per-entry DestinationSelectField; keep only section-level label in CityEntry
- **Decision:** Filter destination select by selected cityId using existing backend query param
- **Decision:** Show "Pilih kota terlebih dahulu" placeholder when city not selected, guiding form fill order
