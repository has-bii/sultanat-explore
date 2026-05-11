# Architecture

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, RSC) |
| UI | React 19 + shadcn/ui (radix-vega) |
| Styling | Tailwind CSS 4 (utility-only) |
| Icons | Lucide React |
| Language | TypeScript (strict) |
| Compiler | React Compiler (babel plugin) |
| Package mgr | pnpm |

## Patterns

- **Server Components by default.** Add `"use client"` only when needed (event handlers, hooks, browser APIs).
- **Feature-based modules.** `src/features/<domain>/` owns components, hooks, types. Shared resources at `src/components/`, `src/hooks/`, `src/lib/`.
- **No CMS yet.** Content static/hardcoded. CMS decision deferred.
- **No API routes yet.** No backend. All data static until CMS chosen.

## Design System

- **Source:** `DESIGN.md` — Uber-inspired achromatic design system.
- **Fonts:** Inter (body / UberMoveText substitute), DM Sans (headings / UberMove substitute). Loaded via `next/font/google`.
- **Colors:** Strictly black + white + gray. Zero chroma in UI chrome. See `DESIGN.md §2`.
- **Radius:** Pill buttons (999px), standard cards (8px), comfortable containers (12px). No in-between.
- **Shadows:** `rgba(0,0,0,0.12)`–`0.16` only. Whisper-subtle. No colored shadows.
- **Typography:** Custom utilities (`text-display` thru `text-micro`) map to DESIGN.md §3 scale.
- **Components:** shadcn/ui overridden to match — full-pill buttons, achromatic palette, minimal borders.

## Key Decisions

| Decision | Choice | Why |
|---|---|---|
| i18n | Hardcoded Bahasa Indonesia | Single language, no lib overhead |
| Component lib | shadcn/ui | Copy-paste, customizable, RSC-friendly |
| Styling | Tailwind only | No CSS modules, no styled-components |
| File naming | kebab-case | Next.js App Router convention |
| State | React state / URL params | No global store needed yet |
| Design system | Uber-inspired (DESIGN.md) | High-contrast achromatic, content-dense, pill buttons |
| Fonts | Inter + DM Sans | Closest open-source to UberMove / UberMoveText |
