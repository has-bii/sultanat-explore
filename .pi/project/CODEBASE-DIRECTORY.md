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
    │   │       └── destination/   # Destination management
    │   │           ├── page.tsx               # Destination list (table + filters)
    │   │           ├── create/
    │   │           │   └── page.tsx           # Create destination form
    │   │           └── [id]/
    │   │               └── edit/
    │   │                   └── page.tsx       # Edit destination (form + gallery)
    │   │       └── image/       # Image management
    │   │           └── page.tsx               # Image grid + upload + detail sheet
    │   │
    │   └── api/
    │       └── [[...route]]/
    │           └── route.ts       # Hono catch-all API handler
    │
    ├── components/
    │   ├── ui/                    # shadcn/ui primitives
    │   │   ├── alert-dialog.tsx       # Confirm dialogs (delete, destructive actions)
    │   │   ├── alert.tsx              # Alert banners (info, warning, error)
    │   │   ├── avatar.tsx
    │   │   ├── badge.tsx              # Status/tag badges
    │   │   ├── breadcrumb.tsx
    │   │   ├── button.tsx
    │   │   ├── card.tsx               # Card layout (ImageCard, etc.)
    │   │   ├── carousel.tsx
    │   │   ├── collapsible.tsx
    │   │   ├── dialog.tsx             # Modal dialogs (upload, picker)
    │   │   ├── dropdown-menu.tsx
    │   │   ├── empty.tsx              # Empty state placeholder
    │   │   ├── field.tsx
    │   │   ├── hero-3.tsx
    │   │   ├── input-group.tsx
    │   │   ├── input.tsx
    │   │   ├── item.tsx               # ItemGroup for stacked lists
    │   │   ├── label.tsx
    │   │   ├── scroll-area.tsx
    │   │   ├── select.tsx
    │   │   ├── separator.tsx
    │   │   ├── sheet.tsx
    │   │   ├── sidebar.tsx            # shadcn Sidebar (SidebarProvider, SidebarTrigger, etc.)
    │   │   ├── skeleton.tsx
    │   │   ├── sonner.tsx
    │   │   ├── testimonials-columns-1.tsx
    │   │   ├── textarea.tsx
    │   │   └── tooltip.tsx
    │   │
    │   ├── button-copy.tsx        # Copy-to-clipboard button with tooltip
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
    │   ├── destination/             # Destination CRUD (admin) — queries, mutations, hooks, components, pages
    │   │   ├── components/
    │   │   │   ├── destination-form.tsx         # Create/edit form (name, tagline, description, image, highlights, featured)
    │   │   │   ├── destination-table.tsx        # Infinite scroll table with filters
    │   │   │   ├── destination-table-row.tsx    # Table row with inline featured toggle
    │   │   │   ├── destination-table-skeleton.tsx
    │   │   │   ├── destination-filters.tsx      # Search + sort + featured filter controls
    │   │   │   ├── destination-skeleton.tsx
    │   │   │   ├── delete-destination-dialog.tsx
    │   │   │   └── destination-gallery/         # Gallery management sub-feature
    │   │   │       ├── index.tsx               # Gallery card with save button, uses MultiImagePickerDialog
    │   │   │       ├── gallery-view.tsx        # DnD sortable grid (@dnd-kit)
    │   │   │       ├── draggable-item.tsx      # Wrapper for sortable items
    │   │   │       └── image-card.tsx          # Gallery image with delete overlay
    │   │   ├── hooks/
    │   │   │   ├── use-destination-filters.ts   # Nuqs URL state (search, sort, order, featured)
    │   │   │   └── use-destination-form.ts      # TanStack Form + Valibot (createDestinationSchema)
    │   │   ├── mutations/
    │   │   │   ├── create-destination.mutation.ts
    │   │   │   ├── update-destination.mutation.ts
    │   │   │   ├── delete-destination.mutation.ts
    │   │   │   └── update-gallery.mutation.ts    # Sync gallery image IDs (PUT)
    │   │   ├── pages/
    │   │   │   ├── destination-list.page.tsx     # Table + filters + empty states
    │   │   │   ├── create-destination.page.tsx   # Card-wrapped form
    │   │   │   └── edit-destination.page.tsx     # Form + gallery side-by-side, lazy delete dialog
    │   │   └── queries/
    │   │       └── index.ts                     # Query factory (infinite list, detail, gallery)
    │   ├── image/                 # Image CRUD (admin) — queries, mutations, stores, components
    │   │   ├── components/
    │   │   │   ├── image-grid.tsx               # Infinite query grid (cursor paginated)
    │   │   │   ├── image-grid-with-filters.tsx  # Grid + selection + filter wiring
    │   │   │   ├── image-grid-skeleton.tsx
    │   │   │   ├── image-card.tsx               # Card with checkbox + click-to-detail
    │   │   │   ├── image-picker-dialog.tsx      # Single image picker (form field)
    │   │   │   ├── multi-image-picker-dialog.tsx # Multi image picker (gallery, max 10)
    │   │   │   ├── filters-toolbar.tsx          # Search + featured + sort controls
    │   │   │   ├── selection-bar.tsx            # Bulk selection count + clear + bulk delete
    │   │   │   ├── bulk-delete-dialog.tsx       # Confirm bulk delete
    │   │   │   ├── image-delete-dialog.tsx      # Confirm single delete
    │   │   │   ├── image-error-message.tsx
    │   │   │   ├── image-detail-sheet/          # Side sheet for image detail + edit
    │   │   │   │   ├── index.tsx                # Sheet wrapper (mutation-aware close)
    │   │   │   │   ├── image-update-form.tsx    # Alt text form + delete button
    │   │   │   │   └── image-update-form-skeleton.tsx
    │   │   │   └── upload-images-dialog/        # Multi-file upload dialog
    │   │   │       ├── index.tsx                # Dialog with DnD + file list + submit
    │   │   │       ├── dnd-images.tsx           # Drag-and-drop zone (react-dropzone)
    │   │   │       ├── file-list.tsx            # File list container + max 10 alert
    │   │   │       └── file-list-item.tsx       # File preview (blob URL) + size + remove
    │   │   ├── hooks/
    │   │   │   ├── use-image-filters.ts         # Nuqs URL state (search, sort, order, featured)
    │   │   │   └── use-update-image-form.ts     # TanStack Form (updateImageSchema)
    │   │   ├── lib/
    │   │   │   └── blurhash.ts                  # blurhash → data URL (OffscreenCanvas)
    │   │   ├── mutations/
    │   │   │   ├── upload-images.mutation.ts
    │   │   │   ├── delete-image.mutation.ts
    │   │   │   ├── bulk-delete-images.mutation.ts
    │   │   │   └── update-image.mutation.ts
    │   │   ├── pages/
    │   │   │   └── images.page.tsx               # FiltersToolbar + dynamic grid + dialogs
    │   │   ├── query/
    │   │   │   └── index.ts                      # Query factory (infinite list, detail)
    │   │   └── stores/
    │   │       ├── image-detail-sheet.store.ts    # Zustand: open/close + selectedImageId
    │   │       ├── image-selection.store.ts       # Zustand: Set<string> + toggle/clear
    │   │       └── upload-images-dialog.store.ts  # Zustand: open/close
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
        ├── image/
        │   ├── image.route.ts     # Hono routes (GET public, mutations auth)
        │   ├── image.service.ts   # Business logic (R2 + DB)
        │   └── image.schema.ts   # Zod schemas (upload, update)
        ├── destination/
        │   ├── destination.route.ts    # CRUD + gallery endpoints (GET public, mutations auth)
        │   ├── destination.service.ts  # Business logic (DB + slug auto-gen, cascade delete)
        │   └── destination.schema.ts  # Zod schemas (create, update, query, gallery)
        ├── attraction/
        │   ├── attraction.route.ts    # CRUD + gallery, nested under /destinations/:destinationId/attractions
        │   ├── attraction.service.ts  # Business logic (DB, destination-scoped)
        │   └── attraction.schema.ts  # Zod schemas (create, update, query, gallery)
        └── attraction-category/
            ├── attraction-category.route.ts    # CRUD at /attraction-categories
            ├── attraction-category.service.ts  # Business logic (DB, auto-slug, _count)
            └── attraction-category.schema.ts  # Zod schemas (create, update)

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
