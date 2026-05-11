---
date: 2025-05-11
title: Navbar and Footer Implementation
tags: [navbar, footer, layout, navigation]
---

- **Decision:** Transparent overlay navbar that becomes solid on scroll
- **Decision:** Text logo "SultanatExplore" with red accent on "Explore"
- **Decision:** Services dropdown with Open Trip, Private Trip, Umrah sub-links
- **Decision:** Nav links: Home, Services, Destinations, Articles, About, Contact
- **Decision:** Green WhatsApp CTA button in desktop nav, full WA button in mobile drawer
- **Decision:** Mobile hamburger → slide-out drawer with accordion Services section
- **Decision:** Minimal footer with logo+tagline, Services links, Company links, social icons (WA + Instagram inline SVG), © year
- **Decision:** Navbar + Footer wired into root layout.tsx wrapping `<main>` around `{children}`
- **Reason:** Transparent nav suits travel site hero section. Services dropdown groups trip types logically. WA CTA matches project CTA requirement.
