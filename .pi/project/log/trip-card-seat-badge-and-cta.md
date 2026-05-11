---
date: 2026-05-11
title: Trip Card Seat Badge & CTA Refinements
tags: [open-trip, trip-card, seat-badge, ui]
---

- **Decision:** SeatBadge refactored to 3 distinct levels: empty (`available === 0`, `bg-destructive`), almost empty (1–3, `bg-amber-500`), normal (>3, `bg-primary`)
- **Decision:** Removed `animate-pulse` from almost-empty badge — static color enough
- **Decision:** "Lihat detail" CTA always visible — removed hover-to-reveal opacity transition
- **Reason:** Original badge variants hard to distinguish between levels; hover CTA hid useful info
