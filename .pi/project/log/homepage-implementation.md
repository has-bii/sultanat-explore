---
date: 2026-05-11
title: Homepage Implementation
tags: [architecture, homepage, hero, animation]
---

- **Decision:** Homepage sections: Hero → About → Services → Destinations → Testimonials → CTA + floating WhatsApp
- **Decision:** Hero uses `AnimatedMarqueeHero` (21st.dev hero-3) with scrolling Turkey image marquee
- **Decision:** `motion` library (not `framer-motion`) for animations — newer package, same API, import from `motion/react`
- **Decision:** `motion/react` components in `src/components/ui/`, section wrappers in `src/components/sections/`
- **Decision:** Testimonial carousel — CSS-only with `useState`/`useEffect`, no animation library
- **Decision:** Hero CTA button uses shadcn semantic colors (`bg-primary`) not hardcoded colors
- **Decision:** WhatsApp number placeholder `6281234567890` — needs real number
- **Decision:** Unsplash placeholder images — swap with real assets later
