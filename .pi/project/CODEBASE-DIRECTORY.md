# Codebase Directory

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Homepage
│   ├── globals.css         # Tailwind base styles
│   ├── open-trip/          # Open Trip page + detail
│   ├── private-trip/       # Private Trip page
│   ├── umrah/              # Private Umrah page
│   ├── destinasi/          # Destinations listing + detail
│   ├── artikel/            # Articles listing + detail
│   ├── collaborate/        # Collaborate page
│   ├── about/              # About Us page
│   ├── faq/                # FAQ page
│   └── contact/            # Contact page
│
├── components/             # Shared UI components
│   ├── ui/                 # shadcn/ui primitives (button, badge, dialog…)
│   ├── layout/             # Layout components (header, footer, nav)
│   └── shared/             # Shared feature-agnostic components
│
├── features/               # Feature modules (domain-driven)
│   ├── open-trip/          # Open trip components, data, types
│   ├── private-trip/       # Private trip components, data, types
│   ├── umrah/              # Umrah components, data, types
│   ├── destinations/       # Destination components, data, types
│   ├── articles/           # Article components, data, types
│   └── collaborate/        # Collaboration components, data, types
│
├── hooks/                  # Shared custom hooks
├── lib/                    # Utilities (cn, formatters, constants)
├── types/                  # Shared TypeScript types/interfaces
└── data/                   # Static data (trips, destinations, articles)

public/                     # Static assets (images, icons)
```

## Rules

- `components/ui/` — **shadcn only.** Auto-generated. Don't hand-edit.
- `features/<x>/` — feature owns its stuff. Import from features, not the other way.
- `data/` — static JSON/TS data until CMS replaces it.
- Pages in `app/` import from `features/` and `components/`. Pages stay thin.
