---
date: 2026-05-11
title: Artikel Feature Implementation
tags: [artikel, blog, seo, feature-complete]
---

- **Decision:** Implemented full Artikel feature — listing page + detail page with 6 SEO articles
- **Decision:** Used structured `ContentBlock` type (paragraph, heading, list, tip, quote) instead of MDX for content
- **Decision:** Nav label changed from "Articles / /articles" to "Artikel / /artikel" — Bahasa Indonesia, route matches page
- **Reason:** Static data, no CMS yet. Content blocks give rendering flexibility without MDX build complexity.
- **Reason:** PRD requires all UI in Bahasa Indonesia.
