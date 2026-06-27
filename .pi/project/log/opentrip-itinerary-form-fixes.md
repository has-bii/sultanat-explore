---
date: 2026-06-27
title: OpenTrip Itinerary Form Fixes
tags: [open-trip, form, validation, accessibility]
---

- **Decision:** Added array-level validation error display for destinations list
- **Decision:** Reset destinations array when city changes via `form.setFieldValue` in custom `onValueChange` handler
- **Reason:** Destinations were city-specific but remained stale after city change; no useEffect needed
