# Codebase Directory

Monorepo with two workspace packages: `frontend/` and `backend/`. Orchestrated via Turborepo.

```
frontend/                         # Next.js app (Next.js 16, App Router)
├── package.json
├── next.config.ts
├── tsconfig.json
├── components.json               # shadcn/ui config
├── postcss.config.mjs
├── eslint.config.mjs
├── .env                          # Env vars (DATABASE_URL, BETTER_AUTH_SECRET, etc.)
│
└── src/
    ├── app/
    │   ├── layout.tsx             # Root layout (fonts + html/body + RootProviders)
    │   ├── globals.css            # Tailwind base styles
    │   ├── not-found.tsx          # Global 404 page
    │   │
    │   ├── (public)/              # Public route group (Navbar + Footer)
    │   │   ├── layout.tsx         # Public layout (Navbar + Footer)
    │   │   ├── page.tsx           # Homepage
    │   │   ├── open-trip/         # Open Trip listing + detail
    │   │   ├── private-trip/      # Private Trip page
    │   │   ├── umrah/             # Private Umrah page
    │   │   ├── destinations/      # Destinations listing + detail
    │   │   ├── artikel/           # Articles listing + detail
    │   │   ├── about/             # About Us page
    │   │   ├── faq/               # FAQ page
    │   │   └── contact/           # Contact page
    │   │
    │   ├── admin/                 # Admin route group (no Navbar/Footer)
    │   │   ├── page.tsx           # Admin index (redirects to dashboard or login)
    │   │   ├── loading.tsx        # Loading fallback for admin
    │   │   ├── (auth)/            # Auth pages (centered layout)
    │   │   │   ├── layout.tsx     # Centered auth layout
    │   │   │   ├── login/         # Login page
    │   │   │   ├── forgot-password/
    │   │   │   └── reset-password/
    │   │   └── dashboard/         # Admin dashboard (SidebarProvider layout)
    │   │       ├── layout.tsx     # Admin dashboard layout (SidebarProvider + AppSidebar)
    │   │       ├── page.tsx       # Dashboard home (cards placeholder)
    │   │       └── destination/   # Destination management (shell pages)
    │   │           ├── page.tsx   # Destination list
    │   │           └── category/  # Attraction category management
    │   │               └── page.tsx
    │   │
    │   └── api/
    │       └── [[...route]]/
    │           └── route.ts       # Hono catch-all API handler
    │
    ├── components/
    │   ├── ui/                    # shadcn/ui primitives
    │   │   ├── avatar.tsx
    │   │   ├── breadcrumb.tsx
    │   │   ├── button.tsx
    │   │   ├── carousel.tsx
    │   │   ├── collapsible.tsx
    │   │   ├── dropdown-menu.tsx
    │   │   ├── field.tsx
    │   │   ├── hero-3.tsx
    │   │   ├── input.tsx
    │   │   ├── label.tsx
    │   │   ├── separator.tsx
    │   │   ├── sheet.tsx
    │   │   ├── sidebar.tsx        # shadcn Sidebar (SidebarProvider, SidebarTrigger, etc.)
    │   │   ├── skeleton.tsx
    │   │   ├── sonner.tsx
    │   │   ├── testimonials-columns-1.tsx
    │   │   └── tooltip.tsx
    │   │
    │   ├── header.tsx             # Admin header with breadcrumb + sidebar trigger
    │   ├── main-page.tsx          # Admin page layout wrapper
    │   ├── navbar.tsx             # Public navbar
    │   ├── footer.tsx             # Public footer
    │   ├── cta-section.tsx        # Shared CTA section
    │   ├── faq-section.tsx        # Shared FAQ accordion
    │   ├── floating-whatsapp.tsx  # Floating WhatsApp button
    │   └── sidebar/               # Admin sidebar components
    │       ├── app-sidebar.tsx    # Main sidebar with nav groups
    │       ├── nav-main.tsx       # Nav items (Dashboard, Destinasi, etc.)
    │       ├── nav-user.tsx       # User menu in sidebar footer
    │       ├── nav-skeleton.tsx   # Loading skeleton for sidebar
    │       └── sidebar-header-item.tsx
    │
    ├── features/                  # Feature modules (domain-driven)
    │   ├── about-us/              # Components, data, types
    │   ├── articles/              # Components, data, types
    │   ├── auth/                  # Login/forgot/reset forms + Zod schemas
    │   ├── contact/               # Components, data
    │   ├── destinations/          # Components, data, types
    │   ├── faq/                   # Components, data
    │   ├── homepage/              # Homepage section components
    │   ├── open-trip/             # Components, data, types
    │   ├── private-trip/          # Components, data, types
    │   ├── umrah/                 # Components, data, types
    │   ├── collaborate/           # (empty — not started)
    │   └── image/                 # Image CRUD (admin) — queries, mutations, stores, components
    │
    ├── providers/                 # React provider wrappers
    │   ├── root.tsx               # RootProviders (TooltipProvider + QueryProvider + Toaster)
    │   └── query-provider.tsx     # React Query provider (TanStack Query)
    │
    ├── hooks/                     # Shared custom hooks
    │   └── use-mobile.ts          # Mobile detection hook (used by sidebar)
    │
    ├── lib/                       # Utilities
    │   ├── utils.ts               # cn() helper (clsx + tailwind-merge)
    │   ├── auth-client.ts         # Better Auth browser client
    │   ├── form.tsx               # useAppForm (TanStack Form factory)
    │   └── query-client.ts        # React Query client instance
    │
    ├── data/                      # Static data (testimonials only)
    ├── types/                     # Shared TypeScript types (empty — types in features)
    └── proxy.ts                   # Next.js auth middleware (route protection)

backend/                           # Workspace package: API + DB + Auth
├── package.json                   # Dependencies: hono, better-auth, prisma, resend, sharp, blurhash, @aws-sdk/client-s3
├── tsconfig.json                  # Extends root tsconfig.base.json
├── prisma.config.ts               # Prisma 7 config (schema path, datasource URL, seed)
├── .env                           # Env vars (DATABASE_URL, RESEND_API_KEY, R2_*, etc.)
│
├── prisma/
│   ├── schema.prisma              # Models: User, Session, Account, Verification
│   │                             #   Image (url, alt, fileSize, blurHash), Destination, DestinationImage,
│   │                             #   AttractionCategory, Attraction, AttractionImage
│   ├── migrations/                # Migration files (auth + destination + image fields)
│   └── seed.ts                    # Admin user seed
│
└── src/
    ├── app.ts                     # Hono app (CORS, auth, route registration)
    ├── app.type.ts                # AppContext (nullable) + AppAuthContext (guaranteed)
    ├── middlewares/
    │   ├── require-auth.ts        # Auth guard middleware (narrows context)
    │   └── validator-wrapper.ts   # zValidator wrapper (auto HTTPException)
    ├── schemas/
    │   ├── param.schema.ts        # Shared param schemas (paramIdSchema)
    │   └── query.schema.ts        # Shared query schemas (querySchema)
    ├── utils/
    │   └── response.ts            # successResponse() / errorResponse() helpers
    ├── lib/
    │   ├── db.ts                  # PrismaClient with Neon adapter
    │   ├── auth.ts                # Better Auth config (email+password, resend)
    │   ├── resend.ts              # Resend email client
    │   ├── r2.ts                  # S3Client + upload/delete wrappers
    │   └── image-processing.ts    # Sharp resize + blurHash pipeline
    └── modules/
        └── image/
            ├── image.route.ts     # Hono routes (GET public, mutations auth)
            ├── image.service.ts   # Business logic (R2 + DB)
            └── image.schema.ts   # Zod schemas (upload, update)

public/                            # Static assets (root level, served by Next.js)

.github/workflows/
└── migrate.yml                    # CI: Prisma migrate deploy + seed on push to main

## Monorepo Structure

- **Root:** Turbo (task orchestration), Prettier (shared config), tsconfig.base.json
- **frontend/** — Next.js 16 app (imports `"backend": "workspace:*"`)
- **backend/** — Hono + Prisma (generated Prisma client in `src/generated/prisma/`)
- **Turborepo tasks:** `db:generate` → `typecheck` → `lint` → `build`
- **Single `.env` per package** (frontend/.env for Next.js, backend/.env for Prisma)

## Rules

- `components/ui/` — **shadcn only.** Auto-generated. Don't hand-edit.
- `features/<x>/` — feature owns its stuff. Import from features, not the other way.
- `data/` — static TS data until CMS replaces it.
- Pages in `app/` import from `features/` and `components/`. Pages stay thin.
- `backend/` — workspace package imported via `"backend": "workspace:*"`. Hono app imported by API route.
- `frontend/src/proxy.ts` — Next.js middleware matcher for `/admin/:path*`. Not a standard middleware file.
