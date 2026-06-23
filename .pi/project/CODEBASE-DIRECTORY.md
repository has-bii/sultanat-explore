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
    │   │   ├── open-trip/
    │   │   ├── private-trip/
    │   │   ├── umrah/
    │   │   ├── destinations/
    │   │   ├── artikel/
    │   │   ├── about/
    │   │   ├── faq/
    │   │   ├── contact/
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
    │   │       ├── page.tsx       # Dashboard home
    │   │       ├── article/
    │   │       ├── city/
    │   │       ├── image/
    │   │       ├── inclusion-item/
    │   │       ├── open-trip/
    │   │       ├── settings/
    │   │       ├── user/
    │   │
    │   └── api/
    │       └── [[...route]]/
    │           └── route.ts       # Hono catch-all API handler
    │
    ├── components/
    │   ├── ui/                    # shadcn/ui (auto-generated) + shadcn-originated custom primitives
    │   │   ├── alert-dialog.tsx
    │   │   ├── alert.tsx
    │   │   ├── avatar.tsx
    │   │   ├── badge.tsx
    │   │   ├── breadcrumb.tsx
    │   │   ├── button.tsx
    │   │   ├── card.tsx
    │   │   ├── carousel.tsx
    │   │   ├── checkbox.tsx
    │   │   ├── collapsible.tsx
    │   │   ├── dialog.tsx
    │   │   ├── dropdown-menu.tsx
    │   │   ├── empty.tsx
    │   │   ├── field.tsx
    │   │   ├── input-group.tsx
    │   │   ├── input.tsx
    │   │   ├── item.tsx
    │   │   ├── label.tsx
    │   │   ├── progress.tsx
    │   │   ├── scroll-area.tsx
    │   │   ├── select.tsx
    │   │   ├── separator.tsx
    │   │   ├── sheet.tsx
    │   │   ├── sidebar.tsx
    │   │   ├── skeleton.tsx
    │   │   ├── sonner.tsx
    │   │   ├── switch.tsx
    │   │   ├── table.tsx
    │   │   ├── textarea.tsx
    │   │   ├── toggle-group.tsx
    │   │   ├── toggle.tsx
    │   │   ├── tooltip.tsx
    │   │
    │   ├── button-copy.tsx
    │   ├── button-loading.tsx
    │   ├── client-only.tsx
    │   ├── cta-section.tsx
    │   ├── error-component.tsx
    │   ├── faq-section.tsx
    │   ├── floating-whatsapp.tsx
    │   ├── footer.tsx
    │   ├── header.tsx
    │   ├── hero-3.tsx
    │   ├── main-page.tsx
    │   ├── navbar.tsx
    │   ├── query-boundary.tsx
    │   ├── table-empty.tsx
    │   ├── table-skeleton.tsx
    │   ├── testimonials-columns-1.tsx
    │   └── sidebar/               # Admin sidebar components
    │       ├── app-sidebar.tsx
    │       ├── nav-admin.tsx
    │       ├── nav-dashboard.tsx
    │       ├── nav-main.tsx
    │       ├── nav-skeleton.tsx
    │       ├── nav-user-skeleton.tsx
    │       ├── nav-user.tsx
    │       ├── sidebar-header-item.tsx
    │
    ├── features/                  # Feature modules (domain-driven)
    │   ├── about-us/
    │   │   ├── components/
    │   │   │   ├── about-hero.tsx
    │   │   │   ├── company-story.tsx
    │   │   │   ├── team-section.tsx
    │   │   │   ├── testimonials-section.tsx
    │   │   │   ├── values-section.tsx
    │   │   │   ├── why-turkey.tsx
    │   │   ├── data.ts
    │   │   ├── types.ts
    │   │   └── index.ts
    │   ├── article/
    │   │   ├── components/
    │   │   │   ├── dialog/
    │   │   │   │   ├── delete.tsx
    │   │   │   ├── edit-skeleton.tsx
    │   │   │   ├── filter/
    │   │   │   │   ├── index.tsx
    │   │   │   ├── form/
    │   │   │   │   ├── index.tsx
    │   │   │   ├── table/
    │   │   │   │   ├── index.tsx
    │   │   │   │   ├── row.tsx
    │   │   ├── hooks/
    │   │   │   ├── use-article-filters.ts
    │   │   │   ├── use-article-form.ts
    │   │   ├── mutations/
    │   │   │   ├── create-article.mutation.ts
    │   │   │   ├── delete-article.mutation.ts
    │   │   │   ├── update-article.mutation.ts
    │   │   ├── queries/
    │   │   │   ├── index.ts
    │   │   ├── pages/
    │   │   │   ├── article-list.page.tsx
    │   │   │   ├── create-article.page.tsx
    │   │   │   ├── edit-article.page.tsx
    │   ├── auth/
    │   │   ├── components/
    │   │   │   ├── forgot-password-form.tsx
    │   │   │   ├── login-form.tsx
    │   │   │   ├── reset-password-form.tsx
    │   │   ├── dto/
    │   │   │   ├── auth.schema.ts
    │   │   ├── mutations/
    │   │   │   ├── forgot-password.mutation.ts
    │   │   │   ├── login.mutation.ts
    │   │   │   ├── logout.mutation.ts
    │   │   │   ├── reset-password.mutation.ts
    │   │   ├── query/
    │   │   │   ├── index.ts
    │   │   └── index.ts
    │   ├── category/
    │   │   ├── components/
    │   │   │   ├── dialog/
    │   │   │   │   ├── delete.tsx
    │   │   │   │   ├── index.tsx
    │   │   │   ├── form/
    │   │   │   │   ├── index.tsx
    │   │   │   ├── table/
    │   │   │   │   ├── index.tsx
    │   │   │   │   ├── row.tsx
    │   │   ├── hooks/
    │   │   │   ├── use-category-form.ts
    │   │   ├── mutations/
    │   │   │   ├── create-category.mutation.ts
    │   │   │   ├── delete-category.mutation.ts
    │   │   │   ├── update-category.mutation.ts
    │   │   ├── queries/
    │   │   │   ├── index.ts
    │   │   ├── pages/
    │   │   │   ├── category-list.page.tsx
    │   │   ├── stores/
    │   │   │   ├── category-dialog.store.ts
    │   │   │   ├── delete-category-dialog.store.ts
    │   ├── city/
    │   │   ├── components/
    │   │   │   ├── dialog/
    │   │   │   │   ├── delete.tsx
    │   │   │   ├── edit-skeleton.tsx
    │   │   │   ├── filter/
    │   │   │   │   ├── index.tsx
    │   │   │   ├── form/
    │   │   │   │   ├── index.tsx
    │   │   │   ├── gallery/
    │   │   │   │   ├── draggable-item.tsx
    │   │   │   │   ├── gallery-view.tsx
    │   │   │   │   ├── image-card.tsx
    │   │   │   │   ├── index.tsx
    │   │   │   │   ├── skeleton.tsx
    │   │   │   ├── table/
    │   │   │   │   ├── index.tsx
    │   │   │   │   ├── row.tsx
    │   │   ├── hooks/
    │   │   │   ├── use-city-filters.ts
    │   │   │   ├── use-city-form.ts
    │   │   ├── mutations/
    │   │   │   ├── create-city.mutation.ts
    │   │   │   ├── delete-city.mutation.ts
    │   │   │   ├── update-city.mutation.ts
    │   │   │   ├── update-gallery.mutation.ts
    │   │   ├── queries/
    │   │   │   ├── index.ts
    │   │   ├── pages/
    │   │   │   ├── city-list.page.tsx
    │   │   │   ├── create-city.page.tsx
    │   │   │   ├── edit-city.page.tsx
    │   ├── contact/
    │   │   ├── components/
    │   │   │   ├── contact-cards.tsx
    │   │   │   ├── contact-hero.tsx
    │   │   │   ├── faq-mini.tsx
    │   │   │   ├── inquiry-form.tsx
    │   │   │   ├── operating-hours.tsx
    │   │   └── index.ts
    │   ├── destination/
    │   │   ├── components/
    │   │   │   ├── dialog/
    │   │   │   │   ├── delete.tsx
    │   │   │   │   ├── index.tsx
    │   │   │   ├── form/
    │   │   │   │   ├── index.tsx
    │   │   │   │   ├── skeleton.tsx
    │   │   │   ├── list-filter/
    │   │   │   │   ├── index.tsx
    │   │   │   ├── table/
    │   │   │   │   ├── index.tsx
    │   │   │   │   ├── row.tsx
    │   │   ├── hooks/
    │   │   │   ├── use-destination-form.ts
    │   │   │   ├── use-destination-list-filters.ts
    │   │   ├── mutations/
    │   │   │   ├── create-destination.mutation.ts
    │   │   │   ├── delete-destination.mutation.ts
    │   │   │   ├── update-destination.mutation.ts
    │   │   ├── queries/
    │   │   │   ├── index.ts
    │   │   ├── pages/
    │   │   │   ├── destination-list.page.tsx
    │   │   ├── stores/
    │   │   │   ├── delete-destination-dialog.store.ts
    │   │   │   ├── destination-dialog.store.ts
    │   ├── destinations/
    │   │   ├── components/
    │   │   │   ├── about-section.tsx
    │   │   │   ├── destinations-grid.tsx
    │   │   │   ├── detail-hero.tsx
    │   │   │   ├── featured-attractions.tsx
    │   │   │   ├── gallery-section.tsx
    │   │   │   ├── hero-section.tsx
    │   │   │   ├── other-destinations.tsx
    │   │   │   ├── related-trips.tsx
    │   │   │   ├── why-turkey.tsx
    │   │   ├── data.ts
    │   │   ├── types.ts
    │   │   └── index.ts
    │   ├── faq/
    │   │   ├── components/
    │   │   │   ├── faq-page-content.tsx
    │   │   ├── data.ts
    │   │   └── index.ts
    │   ├── homepage/
    │   │   ├── components/
    │   │   │   ├── about-section.tsx
    │   │   │   ├── destinations-section.tsx
    │   │   │   ├── hero-section.tsx
    │   │   │   ├── open-trip-section.tsx
    │   │   │   ├── private-trip-section.tsx
    │   │   │   ├── services-section.tsx
    │   │   │   ├── testimonials-section.tsx
    │   │   │   ├── umrah-section.tsx
    │   │   ├── data.ts
    │   │   └── index.ts
    │   ├── image/
    │   │   ├── components/
    │   │   │   ├── bulk-delete-dialog.tsx
    │   │   │   ├── delete-dialog.tsx
    │   │   │   ├── detail-sheet/
    │   │   │   │   ├── index.tsx
    │   │   │   │   ├── update-form-skeleton.tsx
    │   │   │   │   ├── update-form.tsx
    │   │   │   ├── filters-toolbar.tsx
    │   │   │   ├── grid/
    │   │   │   │   ├── index.tsx
    │   │   │   │   ├── skeleton.tsx
    │   │   │   │   ├── with-filters.tsx
    │   │   │   ├── image-card.tsx
    │   │   │   ├── multi-picker-dialog.tsx
    │   │   │   ├── picker-dialog.tsx
    │   │   │   ├── selection-bar.tsx
    │   │   │   ├── upload-dialog/
    │   │   │   │   ├── dnd-images.tsx
    │   │   │   │   ├── file-list-item.tsx
    │   │   │   │   ├── file-list.tsx
    │   │   │   │   ├── index.tsx
    │   │   ├── hooks/
    │   │   │   ├── use-image-filters.ts
    │   │   │   ├── use-update-image-form.ts
    │   │   │   ├── use-upload-queue.ts
    │   │   ├── mutations/
    │   │   │   ├── bulk-delete-images.mutation.ts
    │   │   │   ├── confirm-images.mutation.ts
    │   │   │   ├── delete-image.mutation.ts
    │   │   │   ├── presign-images.mutation.ts
    │   │   │   ├── update-image.mutation.ts
    │   │   ├── queries/
    │   │   │   ├── index.ts
    │   │   ├── pages/
    │   │   │   ├── images.page.tsx
    │   │   ├── stores/
    │   │   │   ├── image-detail-sheet.store.ts
    │   │   │   ├── image-selection.store.ts
    │   │   │   ├── upload-images-dialog.store.ts
    │   │   ├── lib/
    │   │   │   ├── blurhash.ts
    │   │   │   ├── placeholder-blurhash.ts
    │   │   │   ├── upload-to-r2.ts
    │   │   ├── types.ts
    │   ├── inclusion-item/
    │   │   ├── components/
    │   │   │   ├── dialog/
    │   │   │   │   ├── delete.tsx
    │   │   │   │   ├── index.tsx
    │   │   │   ├── form/
    │   │   │   │   ├── index.tsx
    │   │   │   ├── table/
    │   │   │   │   ├── index.tsx
    │   │   │   │   ├── row.tsx
    │   │   ├── hooks/
    │   │   │   ├── use-inclusion-item-form.ts
    │   │   ├── mutations/
    │   │   │   ├── create-inclusion-item.mutation.ts
    │   │   │   ├── delete-inclusion-item.mutation.ts
    │   │   │   ├── update-inclusion-item.mutation.ts
    │   │   ├── queries/
    │   │   │   ├── index.ts
    │   │   ├── pages/
    │   │   │   ├── inclusion-item-list.page.tsx
    │   │   ├── stores/
    │   │   │   ├── delete-inclusion-item-dialog.store.ts
    │   │   │   ├── inclusion-item-dialog.store.ts
    │   ├── open-trip/
    │   │   ├── components/
    │   │   │   ├── dialog/
    │   │   │   │   ├── delete.tsx
    │   │   │   ├── edit-skeleton.tsx
    │   │   │   ├── filter/
    │   │   │   │   ├── index.tsx
    │   │   │   ├── form/
    │   │   │   │   ├── index.tsx
    │   │   │   │   ├── select-fields.tsx
    │   │   │   │   ├── use-app-form.ts
    │   │   │   ├── how-it-works.tsx
    │   │   │   ├── inclusion-section.tsx
    │   │   │   ├── itinerary-section.tsx
    │   │   │   ├── open-trip-explanation.tsx
    │   │   │   ├── past-trip-gallery.tsx
    │   │   │   ├── social-proof-bar.tsx
    │   │   │   ├── table/
    │   │   │   │   ├── index.tsx
    │   │   │   │   ├── row.tsx
    │   │   │   ├── trip-card.tsx
    │   │   │   ├── trip-list.tsx
    │   │   │   ├── why-us.tsx
    │   │   ├── hooks/
    │   │   │   ├── use-open-trip-filters.ts
    │   │   │   ├── use-open-trip-form.ts
    │   │   ├── mutations/
    │   │   │   ├── create-open-trip.mutation.ts
    │   │   │   ├── delete-open-trip.mutation.ts
    │   │   │   ├── update-open-trip.mutation.ts
    │   │   ├── queries/
    │   │   │   ├── index.ts
    │   │   ├── pages/
    │   │   │   ├── create-open-trip.page.tsx
    │   │   │   ├── edit-open-trip.page.tsx
    │   │   │   ├── open-trip-list.page.tsx
    │   │   ├── stores/
    │   │   │   ├── delete-open-trip-dialog.store.ts
    │   │   ├── data.ts
    │   │   ├── types.ts
    │   │   └── index.ts
    │   ├── private-trip/
    │   │   ├── components/
    │   │   │   ├── benefits-section.tsx
    │   │   │   ├── comparison-table.tsx
    │   │   │   ├── past-trip-gallery.tsx
    │   │   │   ├── private-faq.tsx
    │   │   │   ├── private-trip-explanation.tsx
    │   │   │   ├── process-timeline.tsx
    │   │   │   ├── sample-itinerary.tsx
    │   │   │   ├── social-proof-bar.tsx
    │   │   │   ├── testimonials-section.tsx
    │   │   │   ├── travel-advisor.tsx
    │   │   │   ├── trip-builder-wizard.tsx
    │   │   ├── data.ts
    │   │   ├── types.ts
    │   │   └── index.ts
    │   ├── settings/
    │   │   ├── components/
    │   │   │   ├── avatar-upload.tsx
    │   │   │   ├── password-section.tsx
    │   │   │   ├── profile-section-skeleton.tsx
    │   │   │   ├── profile-section.tsx
    │   │   ├── hooks/
    │   │   │   ├── use-password-form.ts
    │   │   │   ├── use-profile-form.ts
    │   │   ├── mutations/
    │   │   │   ├── change-password.mutation.ts
    │   │   │   ├── update-profile.mutation.ts
    │   │   │   ├── upload-avatar.mutation.ts
    │   │   ├── pages/
    │   │   │   ├── settings.page.tsx
    │   │   ├── types.ts
    │   ├── umrah/
    │   │   ├── components/
    │   │   │   ├── gallery.tsx
    │   │   │   ├── inclusion-grid.tsx
    │   │   │   ├── itinerary-preview.tsx
    │   │   │   ├── package-cards.tsx
    │   │   │   ├── process-timeline.tsx
    │   │   │   ├── social-proof-bar.tsx
    │   │   │   ├── testimonials.tsx
    │   │   │   ├── travel-advisor.tsx
    │   │   │   ├── umrah-explanation.tsx
    │   │   │   ├── umrah-faq.tsx
    │   │   ├── data.ts
    │   │   ├── types.ts
    │   │   └── index.ts
    │   ├── user/
    │   │   ├── components/
    │   │   │   ├── dialog/
    │   │   │   │   ├── delete.tsx
    │   │   │   │   ├── index.tsx
    │   │   │   ├── table/
    │   │   │   │   ├── index.tsx
    │   │   │   │   ├── row.tsx
    │   │   ├── hooks/
    │   │   │   ├── use-user-filters.ts
    │   │   ├── mutations/
    │   │   │   ├── create-user.mutation.ts
    │   │   │   ├── delete-user.mutation.ts
    │   │   │   ├── update-user-role.mutation.ts
    │   │   ├── queries/
    │   │   │   ├── index.ts
    │   │   ├── pages/
    │   │   │   ├── user-list.page.tsx
    │   │   ├── stores/
    │   │   │   ├── delete-user-dialog.store.ts
    │   │   │   ├── user-dialog.store.ts
    │
    ├── providers/                 # React provider wrappers
    │   ├── query-provider.tsx  # React Query provider (TanStack Query)
    │   ├── root.tsx  # RootProviders (TooltipProvider + QueryProvider + Toaster)
    │
    ├── hooks/                     # Shared custom hooks
    │   ├── create-dialog-store.ts  # Zustand dialog/toggle store factory
    │   ├── use-debounced-value.ts
    │   ├── use-list-filters.ts  # Shared list filter hooks (nuqs)
    │   ├── use-mobile.ts  # Mobile detection hook (used by sidebar)
    │
    ├── lib/                       # Utilities
    │   ├── api-client.ts  # Hono RPC client
    │   ├── auth-client.ts  # Better Auth browser client
    │   ├── date.ts
    │   ├── form.tsx  # useAppForm (TanStack Form factory)
    │   ├── query-client.ts  # React Query client instance
    │   ├── utils.ts  # cn() helper (clsx + tailwind-merge)
    │
    ├── utils/                     # Shared utility functions
    │   ├── date-to-string.type.ts  # Date-to-string type helper
    │   ├── format-file-size.ts  # File size formatter
    │
    ├── data/                      # Static data (testimonials only)
    ├── types/                     # Shared TypeScript types (empty — types in features)
    └── proxy.ts                   # Next.js auth middleware (route protection)

backend/                           # Workspace package: API + DB + Auth
├── package.json
├── tsconfig.json                  # Extends root tsconfig.base.json
├── prisma.config.ts               # Prisma 7 config (schema path, datasource URL, seed)
├── .env                           # Env vars
│
├── prisma/
│   ├── schema.prisma              # Prisma schema models
│   ├── migrations/                # Migration files
│   └── seed.ts                    # Admin user seed
│
└── src/
    ├── app.ts                     # Hono app (CORS, auth, route registration)
    ├── app.type.ts                # AppContext (nullable) + AppAuthContext (guaranteed)
    ├── middlewares/
    │   ├── require-admin.ts
    │   ├── require-auth.ts
    │   ├── validator-wrapper.ts
    ├── schemas/
    │   ├── param.schema.ts  # Shared param schemas (paramIdSchema)
    │   ├── query.schema.ts  # Shared query schemas (querySchema)
    ├── utils/
    │   └── response.ts  # successResponse() / errorResponse() helpers
    ├── lib/
    │   ├── auth.ts  # Better Auth config (email+password, resend)
    │   ├── db.ts  # PrismaClient with Neon adapter
    │   ├── logger.ts  # Server logger
    │   ├── paginate.ts  # Cursor pagination helper
    │   ├── prisma-fragments.ts  # Prisma select fragments
    │   ├── r2.ts  # S3Client + upload/delete wrappers
    │   ├── resend.ts  # Resend email client
    │   ├── slug.ts  # Slug generation utility
    └── modules/
        ├── article/
        │   ├── article.route.ts
        │   ├── article.schema.ts
        │   ├── article.service.ts
        ├── category/
        │   ├── category.route.ts
        │   ├── category.schema.ts
        │   ├── category.service.ts
        ├── city/
        │   ├── city.route.ts
        │   ├── city.schema.ts
        │   ├── city.service.ts
        ├── destination/
        │   ├── destination.route.ts
        │   ├── destination.schema.ts
        │   ├── destination.service.ts
        ├── image/
        │   ├── image.route.ts
        │   ├── image.schema.ts
        │   ├── image.service.ts
        ├── inclusion-item/
        │   ├── inclusion-item.route.ts
        │   ├── inclusion-item.schema.ts
        │   ├── inclusion-item.service.ts
        ├── open-trip/
        │   ├── open-trip.route.ts
        │   ├── open-trip.schema.ts
        │   ├── open-trip.service.ts
        ├── user/
        │   ├── user.route.ts
        │   ├── user.schema.ts
        │   ├── user.service.ts
        ├── users/
        │   ├── users.route.ts
        │   ├── users.schema.ts
        │   ├── users.service.ts
```

## Monorepo Structure

- **Root:** Turbo (task orchestration), Prettier (shared config), tsconfig.base.json
- **frontend/** — Next.js 16 app (imports `"backend": "workspace:*"`)
- **backend/** — Hono + Prisma (generated Prisma client in `src/generated/prisma/`)
- **Turborepo tasks:** `db:generate` → `typecheck` → `lint` → `build`
- **Single `.env` per package** (frontend/.env for Next.js, backend/.env for Prisma)

## Rules

- `components/ui/` — shadcn/ui registry components + shadcn-originated custom primitives (empty, field, input-group, item). Don't hand-edit core shadcn files.
- `components/` (root level) — shared custom components (hero-3, testimonials-columns-1, etc.). Not from shadcn, reused across 2+ features.
- `features/<x>/` — feature owns its stuff. Import from features, not the other way.
- `data/` — static TS data until CMS replaces it.
- Pages in `app/` import from `features/` and `components/`. Pages stay thin.
- `backend/` — workspace package imported via `"backend": "workspace:*"`. Hono app imported by API route.
- `frontend/src/proxy.ts` — Next.js middleware matcher for `/admin/:path*`. Not a standard middleware file.
