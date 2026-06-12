# SultanatExplore

Travel agency website. Turkey-based, serving Indonesian travelers. Open trips, private trips, Umrah packages.

**Tech:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind 4 · shadcn/ui (radix-vega) · React Compiler

**Language:** Bahasa Indonesia (hardcoded). **Currency:** IDR. **CTA:** WhatsApp.

## Commands

| Command | Description |
|---|---|
| `pnpm dev` | Start dev server (localhost:3000) |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `npx prettier --write .` | Format all files |
| `npx tsc --noEmit` | Type check without build |
| `npx shadcn@latest add <component>` | Add shadcn/ui component |

**Docs:**

- [ARCHITECTURE.md](.pi/project/ARCHITECTURE.md) — tech stack, monorepo, key decisions, DB models
- [FRONTEND.md](.pi/project/FRONTEND.md) — feature modules, queries, mutations, forms, design system
- [BACKEND.md](.pi/project/BACKEND.md) — API modules, route/service/schema conventions
- [CODEBASE-DIRECTORY.md](.pi/project/CODEBASE-DIRECTORY.md) — folder structure overview
- [CONVENTION.md](.pi/project/CONVENTION.md) — naming rules, import aliases
- [LOG.md](.pi/project/LOG.md) — decisions timeline
- [DESIGN.md](DESIGN.md) — Uber-inspired design system (colors, typography, components, layout)

**Load docs by session domain:**

| Domain | Load | Skip |
|---|---|---|
| Frontend (UI, components, pages) | `ARCHITECTURE` + `FRONTEND` + `CONVENTION` + `DESIGN` | `BACKEND` |
| Backend (API, DB, services) | `ARCHITECTURE` + `BACKEND` + `CONVENTION` | `FRONTEND`, `DESIGN` |
| Full stack / cross-cutting | All docs | — |
