---
date: 2026-05-11
title: Testimonials Infinite Scroll Columns
tags: [testimonials, homepage, 21dev, motion]
---

- **Decision:** Replaced carousel-style testimonials with 21dev infinite-scroll column layout using `motion/react` animations
- **Decision:** Extracted reusable `TestimonialsColumn` component to `src/components/ui/testimonials-columns-1.tsx`
- **Reason:** Column animation more visually engaging than single-card carousel; 3-column responsive layout (1/2/3 cols at sm/md/lg)
