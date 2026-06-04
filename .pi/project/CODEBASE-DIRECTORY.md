# Codebase Directory

```
src/
├── app/
│   ├── layout.tsx                 # Root layout (fonts + html/body only)
│   ├── globals.css                # Tailwind base styles
│   ├── not-found.tsx              # Global 404 page
│   │
│   ├── (public)/                  # Public route group (Navbar + Footer)
│   │   ├── layout.tsx             # Public layout (Navbar + Footer)
│   │   ├── page.tsx               # Homepage
│   │   ├── open-trip/             # Open Trip listing + detail
│   │   ├── private-trip/          # Private Trip page
│   │   ├── umrah/                 # Private Umrah page
│   │   ├── destinations/          # Destinations listing + detail
│   │   ├── artikel/               # Articles listing + detail
│   │   ├── about/                 # About Us page
│   │   ├── faq/                   # FAQ page
│   │   └── contact/               # Contact page
│   │
│   ├── admin/                     # Admin route group (no Navbar/Footer)
│   │   ├── layout.tsx             # Admin bare layout
│   │   ├── page.tsx               # Admin index (redirects to dashboard or login)
│   │   ├── dashboard/             # Admin dashboard
│   │   └── (auth)/                # Auth pages (centered layout)
│   │       ├── layout.tsx         # Centered auth layout
│   │       ├── login/             # Login page
│   │       ├── forgot-password/   # Forgot password page
│   │       └── reset-password/    # Reset password page
│   │
│   └── api/
│       └── [[...route]]/
│           └── route.ts           # Hono catch-all API handler
│
├── components/
│   ├── ui/                        # shadcn/ui primitives (button, badge, carousel…)
│   ├── layout/                    # Layout components (navbar, footer)
│   └── shared/                    # Shared feature-agnostic components
│       ├── cta-section.tsx
│       ├── faq-section.tsx
│       └── floating-whatsapp.tsx
│
├── features/                      # Feature modules (domain-driven)
│   ├── about-us/                  # About Us components, data, types
│   ├── articles/                  # Article components, data, types
│   ├── auth/                      # Auth components (login, forgot, reset forms) + Zod schemas
│   ├── contact/                   # Contact components, data
│   ├── destinations/              # Destination components, data, types
│   ├── faq/                       # FAQ components, data
│   ├── homepage/                  # Homepage section components
│   ├── open-trip/                 # Open trip components, data, types
│   ├── private-trip/              # Private trip components, data, types
│   ├── umrah/                     # Umrah components, data, types
│   └── collaborate/               # (empty — not started)
│
├── hooks/                         # Shared custom hooks
├── lib/                           # Utilities
│   ├── utils.ts                   # cn() helper (clsx + tailwind-merge)
│   ├── auth-client.ts             # Better Auth browser client
│   └── form.tsx                   # useAppForm (TanStack Form factory)
│
├── data/                          # Static data (testimonials only — trips etc. in features)
├── types/                         # Shared TypeScript types
└── proxy.ts                       # Next.js auth middleware (route protection)

backend/                           # Workspace package: API + DB + Auth
├── package.json                   # Dependencies: hono, better-auth, prisma, resend
├── tsconfig.json                  # Path alias: backend/* → ./src/*
├── prisma.config.ts               # Prisma 7 config (schema path, datasource URL, seed)
├── prisma/
│   ├── schema.prisma              # User, Session, Account, Verification models
│   ├── migrations/                # Prisma migration files
│   └── seed.ts                    # Admin user seed
└── src/
    ├── app.ts                     # Hono app (CORS, auth handler, /api/hello)
    ├── app.type.ts                # Hono context types (user, session)
    └── lib/
        ├── db.ts                  # PrismaClient with Neon adapter
        ├── auth.ts                # Better Auth config (email+password, resend)
        └── resend.ts              # Resend email client

public/                            # Static assets (images, icons)

.github/workflows/
└── migrate.yml                    # CI: Prisma migrate deploy + seed on push
```

## Rules

- `components/ui/` — **shadcn only.** Auto-generated. Don't hand-edit.
- `features/<x>/` — feature owns its stuff. Import from features, not the other way.
- `data/` — static TS data until CMS replaces it.
- Pages in `app/` import from `features/` and `components/`. Pages stay thin.
- `backend/` — workspace package imported via `"backend": "workspace:*"`. Hono app imported by API route.
- `src/proxy.ts` — Next.js middleware matcher for `/admin/:path*`. Not a standard middleware file.
