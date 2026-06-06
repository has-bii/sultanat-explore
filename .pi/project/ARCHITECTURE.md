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
| Validation | Zod (v4) + @hono/zod-validator |

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

## Patterns

- **Server Components by default.** Add `"use client"` only when needed (event handlers, hooks, browser APIs).
- **Feature-based modules.** `frontend/src/features/<domain>/` owns components, hooks, types. Shared resources at `frontend/src/components/`, `frontend/src/hooks/`, `frontend/src/lib/`.
- **Backend modules.** `backend/src/modules/<domain>/` owns route, service, schema. Shared middleware at `backend/src/middlewares/`, shared schemas at `backend/src/schemas/`.
- **Unified API response format.** All endpoints return `{ success: true, data, message }` for success, `{ success: false, data: null, message, error }` for errors. Use `successResponse()` and `errorResponse()` from `backend/src/utils/response.ts`.
- **Zod validation via zValidator.** Use `zValidator(target, schema)` wrapper — auto-throws HTTPException(400) on failure. Never manual `safeParse` in routes.
- **Auth split.** `AppContext` (nullable user/session) for public routes. `AppAuthContext` (guaranteed) for protected routes. `requireAuth` middleware narrows context type.
- **Workspace backend.** `backend/` is a local workspace package with its own `package.json`, Prisma schema, Hono app, auth config, and Resend integration.
- **API catch-all.** All API routes handled by `frontend/src/app/api/[[...route]]/route.ts` which imports the Hono app from `backend/`.
- **Route protection.** `frontend/src/proxy.ts` (Next.js config-based middleware) checks Better Auth session cookie before admin routes.
- **Route groups.** Public pages in `(public)` route group (Navbar/Footer in its layout). Admin in `admin/` route group with dashboard layout (sidebar + header).
- **Admin layout.** Dashboard pages wrapped in shadcn `SidebarProvider` + `AppSidebar` + `Header`/`MainPage` components.
- **No CMS yet.** Content still static/hardcoded for public pages. CMS decision deferred until admin modules built.
- **Zustand for UI state.** Feature-scoped zustand stores for transient UI state (sheet open/close, dialog open/close, selected item IDs). Never for server data — use React Query for that.
- **Mutation pattern.** Each mutation is a custom hook wrapping `useMutation`. Always check `json.success` from the unified response and throw on failure. `toast.success`/`toast.error` in `onSuccess`/`onError`. Query invalidation in `onSettled` via `context.client.invalidateQueries`.
- **Query factory pattern.** Always place `queryOptions` and `infiniteQueryOptions` factories in `features/<name>/queries/`. Use `queryOptions` for single-item fetches, `infiniteQueryOptions` for cursor-paginated lists. Factories are plain functions returning options objects — called via `useQuery(getXxxQueryOptions(...))` or `useInfiniteQuery(getXxxQueryOptions(...))` at the call site. Never pass `queryOptions` to `useInfiniteQuery` or vice versa.
- **Sheet + dialog managed by stores.** Sheet open state + selected entity ID stored in zustand. Dialog open state also in zustand. Components subscribe via selector. Reset on close with `useEffect` cleanup.

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
| State | React state / URL params + zustand for UI state | zustand for sheet, dialog, and other transient UI state. React state + URL params for persistent/route-level state |
| Design system | Uber-inspired (DESIGN.md) | High-contrast achromatic, content-dense, pill buttons |
| Fonts | Inter + DM Sans | Closest open-source to UberMove / UberMoveText |
| Auth | Better Auth | Full-stack auth (Hono handler + React client + cookies) |
| Database | Prisma 7 + Neon | Serverless Postgres, adapter-based PrismaClient |
| API routing | Hono catch-all | Single route handler in `[[...route]]` for all API paths |
| Form system | TanStack React Form (useAppForm) | Type-safe forms with Zod validation, reactive submit state |
| Route protection | Next.js proxy.ts | Cookie-based, redirects unauthenticated to /admin/login |
| Monorepo | Turborepo + pnpm workspaces | Task caching, clean separation, shared base tsconfig |
| Client data | TanStack React Query | Server-state for admin CRUD pages. queryOptions/infiniteQueryOptions factories in features/<name>/queries/. useQuery for queryOptions, useInfiniteQuery for infiniteQueryOptions. Query invalidation in onSettled |
| Admin layout | shadcn SidebarProvider | Collapsible sidebar + breadcrumb header pattern |
| Image upload | Sharp + R2 | Resize to 1920px max, WebP quality 75, blurHash for placeholders. Multi-file via `File[]` schema, parallel `Promise.all`. Frontend: drag-and-drop, file validation (type + size), file list with remove, max 10 files |
| API response format | `successResponse`/`errorResponse` | Unified `{ success, data, message, error }` contract for frontend consumers |

## Database Models (Prisma 7)

### Auth models
- `User`, `Session`, `Account`, `Verification` — Better Auth standard models.

### Content models
- `Image` — Reusable image entity (`url`, `alt`, `fileSize`, `blurHash`). Referenced by typed FKs from destinations and attractions.
- `Destination` — City/region (slug, name, tagline, description, highlights[], featured flag). FK to Image (hero).
- `DestinationImage` — Join table for gallery images, ordered.
- `AttractionCategory` — Category entity (budaya, alam, pantai, etc.) — not an enum.
- `Attraction` — Landmark/activity per destination. FK to Image (hero), Category, Destination.
- `AttractionImage` — Join table for attraction gallery images, ordered.

Gallery pattern uses join tables (`DestinationImage`, `AttractionImage`) with `order` field instead of JSON arrays or polymorphic relations.

## Dependency map

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
      ├── TextField: label + input + error (Zod validation)
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

backend/src/modules/image/
  ├── image.route.ts — Hono routes (GET public, mutations auth)
  ├── image.service.ts — Business logic (R2 + DB)
  └── image.schema.ts — Zod schemas (upload multi-file, update)

frontend/src/features/image/
  ├── queries/ — queryOptions + infiniteQueryOptions factories
  ├── mutations/ — useMutation hooks (upload, update, delete)
  ├── stores/ — zustand stores for UI state (sheet, dialog)
  ├── hooks/ — feature hooks (use-image-filters, use-update-image-form)
  ├── components/ — feature components (image-detail-sheet/, upload-images-dialog/)
  ├── dto/ — Zod schemas + inferred types
  └── lib/ — blurhash helpers

backend/src/middlewares/
  ├── require-auth.ts — Auth guard (narrows to AppAuthContext)
  └── validator-wrapper.ts — zValidator wrapper (auto HTTPException)

backend/src/schemas/
  ├── param.schema.ts — UUID param validation
  └── query.schema.ts — Cursor + limit query validation
```
