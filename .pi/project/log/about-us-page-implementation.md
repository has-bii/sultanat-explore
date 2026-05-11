---
date: 2026-05-12
title: About Us Page Implementation
tags: [about-us, navbar-inversion, testimonials, shared-data]
---

- **Decision:** Built About Us page at `/about` with 7 sections: full-bleed hero, company story timeline, why-turkey grid, team cards, values grid, testimonials, CTA
- **Decision:** Extracted testimonials data to `src/data/testimonials.ts` — shared between homepage and about-us (single source of truth)
- **Decision:** Implemented navbar dark-theme auto-inversion using `data-nav-theme="dark"` sentinel + IntersectionObserver. Any hero with dark overlay adds sentinel, navbar detects and inverts colors. Reusable for future dark heroes.
- **Decision:** Team section uses card grid (4A from brainstorm) — avatar, name, role pill, bio
