---
date: 2026-05-11
title: Design System Applied (Uber-inspired)
tags: [design-system, theme, styling, globals-css, shadcn, typography]
---

- **Decision:** Apply DESIGN.md (Uber-inspired achromatic design system) to entire project
- **Decision:** Use Inter (body) + DM Sans (headings) as UberMove/UberMoveText open-source substitutes
- **Decision:** All buttons full-pill (`rounded-full` / 999px), no `rounded-md` on interactive elements
- **Decision:** Strict achromatic palette — zero chroma in UI chrome. `--primary: #000`, `--background: #fff`
- **Decision:** Custom type scale utilities (`text-display` thru `text-micro`) map to DESIGN.md §3 hierarchy
- **Decision:** Custom shadow utilities (`shadow-uber-sm` thru `shadow-uber-pressed`) replace arbitrary shadows
- **Decision:** WhatsApp CTA buttons use `bg-primary` (black) instead of WhatsApp green — DESIGN.md rules no color in UI chrome
- **Decision:** Image overlay gradients preserved (functional photo legibility, not decorative)
- **Decision:** Umrah section converted from green gradient + amber accents → flat black bg + white/gray
- **Reason:** DESIGN.md explicitly bans: gradients, colored shadows, off-blacks/whites, serif fonts, decorative borders, rounded-md on buttons
