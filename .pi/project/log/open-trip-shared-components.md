---
date: 2026-05-11
title: Open Trip Page & Shared Components
tags: [open-trip, homepage, shared-components, cta, faq]
---

- **Decision:** Created full Open Trip page with 8 sections: Hero, Social Proof, Explanation (Direction A editorial), How It Works, Trip Listing, Gallery, Why Us, CTA
- **Decision:** Moved CTA to shared `src/components/cta-section.tsx` — used by homepage and open-trip page
- **Decision:** Moved FAQ to shared `src/components/faq-section.tsx` — used by homepage
- **Decision:** Testimonials stay on homepage only (existing infinite-scroll columns), removed from open-trip
- **Decision:** Trip detail page (`/open-trip/[slug]`) with itinerary timeline, inclusions/exclusions, WhatsApp CTA
- **Reason:** Avoid duplication, shared CTA + FAQ across pages, each page has distinct sections
