---
date: 2026-06-07
title: DESIGN.md ↔ globals.css Hybrid Alignment
tags: [design, css, tailwind]
---

- **Decision:** Adopt hybrid approach (Option C) for DESIGN.md ↔ globals.css discrepancies
- **Decision:** Keep near-black `oklch(0.205)` primary instead of pure `#000000` — softer on screen, shadcn convention
- **Decision:** Keep light gray borders (`oklch(0.922)`) instead of pure black — less aggressive, shadcn default
- **Decision:** Add missing tokens: `--text-body-gray`, `--text-muted-gray`, `--link-default`, `--link-white`, `--link-black`
- **Decision:** Remove dark theme — project doesn't support it
- **Decision:** DESIGN.md is source of truth for public paths; shadcn defaults for authenticated (dashboard) paths
