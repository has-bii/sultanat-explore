# Architecture

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, RSC) |
| UI | React 19 + radix-ui + shadcn/ui |
| Styling | Tailwind CSS 4 (utility-only) |
| Icons | Lucide React |
| Language | TypeScript (strict) |
| Compiler | React Compiler (babel plugin) |
| Package mgr | pnpm |
| Forms | TanStack React Form (useAppForm) |
| Auth | Better Auth (server) + auth-client (browser) |
| API layer | Hono (catch-all route in `src/app/api/[[...route]]`) |
| Database | PostgreSQL via Neon + Prisma 7 |
| Email | Resend (password reset) |
| CI | GitHub Actions (Prisma migrate on push to main) |

## Patterns

- **Server Components by default.** Add `"use client"` only when needed (event handlers, hooks, browser APIs).
- **Feature-based modules.** `src/features/<domain>/` owns components, hooks, types. Shared resources at `src/components/`, `src/hooks/`, `src/lib/`.
- **Workspace backend.** `backend/` is a local workspace package (`"backend": "workspace:*"`) with its own `package.json`, Prisma schema, Hono app, auth config, and Resend integration.
- **API catch-all.** All API routes handled by `src/app/api/[[...route]]/route.ts` which imports the Hono app from `backend/`.
- **Route protection.** `src/proxy.ts` (Next.js config-based middleware) checks Better Auth session cookie before admin routes.
- **Route groups.** Public pages in `(public)` route group (Navbar/Footer in its layout). Admin in `admin/` route group (no Navbar/Footer).
- **No CMS yet.** Content still static/hardcoded for public pages. CMS decision deferred until admin modules built.

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
| Component lib | radix-ui + shadcn/ui | Radix primitives + shadcn copy-paste components |
| Styling | Tailwind only | No CSS modules, no styled-components |
| File naming | kebab-case | Next.js App Router convention |
| State | React state / URL params | No global store needed yet |
| Design system | Uber-inspired (DESIGN.md) | High-contrast achromatic, content-dense, pill buttons |
| Fonts | Inter + DM Sans | Closest open-source to UberMove / UberMoveText |
| Auth | Better Auth | Full-stack auth (Hono handler + React client + cookies) |
| Database | Prisma 7 + Neon | Serverless Postgres, adapter-based PrismaClient |
| API routing | Hono catch-all | Single route handler in `[[...route]]` for all API paths |
| Form system | TanStack React Form (useAppForm) | Type-safe forms with Zod validation, reactive submit state |
| Route protection | Next.js proxy.ts | Cookie-based, redirects unauthenticated to /admin/login |

## Dependency map

```
src/app/api/[[...route]]/route.ts
  └── imports Hono app from backend/src/app.ts
        ├── Hono instance with CORS + error handling
        ├── Better Auth handler at /api/auth/*
        │     └── Prisma adapter → Neon Postgres
        └── Protected routes (auth check on every request)
              └── Set c.set("user") / c.set("session")

src/proxy.ts (Next.js config)
  └── Matches /admin/:path*
      └── Reads Better Auth session cookie
          ├── Protected + no cookie → redirect /admin/login
          └── Auth page + cookie → redirect /admin/dashboard

src/lib/auth-client.ts
  └── Better Auth browser client (useSession, signIn, signOut)

src/lib/form.tsx (useAppForm)
  └── TanStack React Form factory
      ├── TextField: label + input + error (Zod validation)
      └── SubmitButton: reactive disabled/loading state

backend/src/lib/db.ts
  └── PrismaClient with PrismaNeon adapter

backend/src/lib/auth.ts
  └── Better Auth server config (email+password, resend for reset)

backend/src/lib/resend.ts
  └── Resend client for password reset emails
```
