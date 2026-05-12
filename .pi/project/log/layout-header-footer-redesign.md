---
date: 2026-05-12
title: Layout Header/Footer Redesign
tags: [navbar, footer, layout, design-system]
---

- **Decision:** Redesigned navbar and footer from scratch. Flat text links (not pill chips) for nav items, pill button only for WhatsApp CTA.
- **Decision:** Footer uses pure black background (`bg-black`) with 4-column grid: Brand (col-span-6) + Trip + Explore + Perusahaan (col-span-2 each). Ghost social icons without boxes.
- **Decision:** All nav labels switched to Bahasa Indonesia: Beranda, Layanan, Destinasi, Artikel, Tentang Kami, FAQ, Kontak.
- **Decision:** Active nav state via `usePathname()` — color + underline indicator.
- **Decision:** Mobile nav changed from slide-in drawer to full-screen black overlay with large text links.
- **Decision:** Max-width `max-w-7xl` for both navbar and footer.
- **Decision:** Footer responsive: mobile stacked, tablet brand full-row + 3 equal link cols, desktop 6+2+2+2 grid.
- **Reason:** DESIGN.md pill chips suited for buttons, not 7-item nav. Footer violated black bg spec. Labels contradicted PRD Bahasa Indonesia policy.
