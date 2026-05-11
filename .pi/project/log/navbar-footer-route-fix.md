---
date: 2026-05-11
title: Navbar & Footer Route Fixes
tags: [navbar, footer, routes, bugfix]
---

- **Decision:** Changed all `#` hash links in navbar and footer to proper slash routes (`/open-trip`, `/private-trip`, `/umrah`, `/destinations`, `/articles`, `/about`, `/contact`, `/services`)
- **Decision:** Fixed navbar transparent background on mid-page refresh by calling `handleScroll()` on mount
- **Decision:** Removed `motion.header` slide-in animation on load — replaced with plain `<header>` for instant render
- **Reason:** Hash links don't scale for multi-page app. Scroll state on refresh was stale. Load animation felt jarring.
