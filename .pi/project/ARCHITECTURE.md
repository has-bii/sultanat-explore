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
| Monorepo | Turborepo (task orchestration + caching) |
| Forms | TanStack React Form (useAppForm) |
| URL state | nuqs | Type-safe URL search params for filters |
| Auth | Better Auth (server) + auth-client (browser) |
| API layer | Hono (catch-all route in `frontend/src/app/api/[[...route]]`) |
| Database | PostgreSQL via Neon + Prisma 7 |
| Email | Resend (password reset) |
| Client data | TanStack React Query (React Query) |
| Theme | next-themes |
| Toasts | sonner |
| CI | GitHub Actions (Prisma migrate on push to main) |
| Image storage | Cloudflare R2 (S3-compatible) |
| Image processing | Sharp (resize + WebP)
| Blur placeholder | blurhash (encode from 64×64 thumbnail) |
| Validation | Valibot + @hono/standard-validator |
| DnD / Upload | Native HTML5 drag + File API |

## Monorepo Layout

```
sultanat-explore/
├── frontend/      # Next.js app (public + admin pages)
├── backend/       # Hono API + Prisma + Better Auth
├── turbo.json     # Task orchestration
└── pnpm-workspace.yaml
```

- Root has only Prettier, Turbo, and convenience scripts (`dev`, `build`, `lint`, `typecheck`).
- Each package has its own `.env`, `package.json`, `tsconfig.json`, ESLint config.
- `frontend/` imports `"backend": "workspace:*"` — Hono app bundled into Next.js build.
- Turborepo pipeline: `db:generate` → `typecheck` → `lint` → `build`.

## General Patterns

- TypeScript strict mode. `any` allowed only in `utils/response.ts` (generic error field) and Hono catch-all types.
- RSC by default. `"use client"` only when necessary.
- React Compiler enabled — avoid useMemo/useCallback unless compiler can't optimize.
- No `console.log` in production code.

## Monorepo Convention

- `frontend/` — Next.js app. All source code inside `frontend/src/`.
- `backend/` — workspace package (`"backend": "workspace:*"` in root/frontend package.json).
- Hono app (`backend/src/app.ts`) is the single entry point imported by API route.
- Better Auth config lives in `backend/src/lib/auth.ts` with Prisma adapter.
- Prisma 7 uses `prisma.config.ts` (not `datasource.url` in schema). Adapter-based PrismaClient with `@prisma/adapter-neon`.
- Seed file at `backend/prisma/seed.ts` uses `npx tsx` via prisma config.
- Auth route protection: `frontend/src/proxy.ts` (Next.js config matcher) — not `middleware.ts`.
- Turborepo tasks: `db:generate` (generate Prisma client) → `typecheck` → `lint` → `build`.

## Key Decisions

| Decision | Choice | Why |
|---|---|---|
| i18n | Hardcoded Bahasa Indonesia | Single language, no lib overhead |
| Component lib | radix-ui + shadcn/ui | Radix primitives + shadcn copy-paste components |
| Styling | Tailwind only | No CSS modules, no styled-components |
| File naming | kebab-case | Next.js App Router convention |
| State | React state / URL params + zustand for UI state | zustand for sheet, dialog, and other transient UI state. React state + URL params for persistent/route-level state |
| Design system | Uber-inspired (DESIGN.md) | High-contrast achromatic, content-dense, pill buttons |
| Fonts | DM Sans + Inter + Geist | DM Sans for headings, Inter/Geist for body |
| Auth | Better Auth | Full-stack auth (Hono handler + React client + cookies) |
| Database | Prisma 7 + Neon | Serverless Postgres, adapter-based PrismaClient |
| API routing | Hono catch-all | Single route handler in `[[...route]]` for all API paths |
| Form system | TanStack React Form (useAppForm) | Type-safe forms with Valibot validation (Standard Schema), reactive submit state |
| Route protection | Next.js proxy.ts | Cookie-based, redirects unauthenticated to /admin/login |
| Monorepo | Turborepo + pnpm workspaces | Task caching, clean separation, shared base tsconfig |
| Client data | TanStack React Query | Server-state for admin CRUD pages. queryOptions/infiniteQueryOptions factories in features/<name>/queries/. useQuery for queryOptions, useInfiniteQuery for infiniteQueryOptions. Query invalidation in onSettled |
| Admin layout | shadcn SidebarProvider | Collapsible sidebar + breadcrumb header pattern |
| Image upload | Sharp + R2 | Resize to 1920px max, WebP quality 75, blurHash for placeholders. Multi-file via `File[]` schema, parallel `Promise.all`. Frontend: drag-and-drop, file validation (type + size), file list with remove, max 10 files |
| Gallery management | MultiImagePickerDialog + @dnd-kit | Pick existing images (max 10), drag-to-reorder, sync via PUT endpoint. Join table `DestinationImage` with `order` field. Attractions have no gallery. |
| Image pickers | ImagePickerDialog (single) + MultiImagePickerDialog (multi) | Reusable across features. Single for hero images, multi for galleries. Dynamic import ImageGrid (SSR disabled) |
| API response format | `successResponse`/`errorResponse` | Unified `{ success, data, message, error }` contract for frontend consumers |

## Database Models (Prisma 7)

### Auth models
- `User`, `Session`, `Account`, `Verification` — Better Auth standard models.

### Content models
- `Image` — Reusable image entity (`url`, `alt`, `fileSize`, `blurHash`). Referenced by typed FKs from destinations and attractions.
- `Destination` — City/region (slug, name, tagline, description, highlights[], featured flag). FK to Image (hero).
- `DestinationImage` — Join table for destination gallery images, ordered.
- `Attraction` — Landmark/activity per destination. FK to Image (hero), Destination. No category, no gallery — flat entity.

Gallery pattern uses a join table (`DestinationImage`) with `order` field instead of JSON arrays or polymorphic relations.

## Dependency Map

```
frontend/src/app/api/[[...route]]/route.ts
  └── imports Hono app from backend/src/app.ts
        ├── Hono instance with CORS + error handling
        ├── Better Auth handler at /api/auth/*
        │     └── Prisma adapter → Neon Postgres
        ├── Public routes (GET /api/images — no auth required)
        └── Protected routes (requireAuth middleware)
              ├── Set c.set("user") / c.set("session")
              └── POST/PATCH/DELETE mutations

frontend/src/proxy.ts (Next.js config)
  └── Matches /admin/:path*
      └── Reads Better Auth session cookie
          ├── Protected + no cookie → redirect /admin/login
          └── Auth page + cookie → redirect /admin/dashboard

frontend/src/lib/auth-client.ts
  └── Better Auth browser client (useSession, signIn, signOut)

frontend/src/lib/api-client.ts
  └── Hono RPC client (hc<AppType>) — NEXT_PUBLIC_API_URL env var
      ├── credentials: include (cookie-based auth)
      ├── Used for typed client-side API calls
      └── Mutations destructure response, check json.success, throw on failure

frontend/src/lib/form.tsx (useAppForm)
  └── TanStack React Form factory
      ├── TextField: label + input + error (Valibot validation)
      └── SubmitButton: reactive disabled/loading state

frontend/src/providers/
  ├── root.tsx — TooltipProvider + QueryProvider + Toaster
  └── query-provider.tsx — TanStack Query (React Query) client provider

backend/src/lib/db.ts
  └── PrismaClient with PrismaNeon adapter

backend/src/lib/auth.ts
  └── Better Auth server config (email+password, resend for reset)

backend/src/lib/resend.ts
  └── Resend client for password reset emails

backend/src/lib/r2.ts
  └── S3Client init + r2Upload/r2Delete/r2KeyFromUrl

backend/src/lib/image-processing.ts
  └── Sharp resize (1920px max, WebP 75) + blurHash encode

backend/src/utils/
  └── response.ts — successResponse() / errorResponse() helpers
```
