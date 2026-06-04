# Convention

## File Naming

| Type | Pattern | Example |
|---|---|---|
| Components | `kebab-case.tsx` | `trip-card.tsx` |
| Pages | Next.js convention | `page.tsx`, `layout.tsx`, `loading.tsx` |
| Hooks | `use-<name>.ts` | `use-trip-filter.ts` |
| Utilities | `kebab-case.ts` | `format-currency.ts` |
| Types | `kebab-case.ts` | `trip.ts` |
| Data files | `kebab-case.ts` or `.json` | `destinations.ts` |

## Component Naming

- File: `trip-card.tsx` → Export: `TripCard` (PascalCase)
- One component per file. Co-locate variants in same file if small.
- Barrel exports via `index.ts` in feature folders.

## Styling

- **Tailwind only.** No CSS modules, no styled-components.
- Use shadcn/components-ui as building blocks.
- Use `cn()` from `src/lib/utils.ts` for conditional classes.
- Tailwind classes sorted by prettier-plugin-tailwindcss.

### Design System Rules (DESIGN.md)

- **Achromatic only.** No color in UI chrome. Black, white, grays only.
- **No gradients.** Every surface = flat solid color.
- **No colored shadows.** Only `rgba(0,0,0,0.08–0.16)`.
- **Pill buttons.** All buttons use `rounded-full` (999px). No `rounded-md` on buttons.
- **Content-dense cards.** Minimal internal padding. Rely on shadow + radius for boundaries.
- **Typography utilities.** Use `text-display`, `text-heading`, `text-card-title`, `text-subheading`, `text-small-heading`, `text-nav`, `text-caption`, `text-micro` instead of arbitrary sizes.
- **Shadow utilities.** Use `shadow-uber-sm`, `shadow-uber-md`, `shadow-uber-lg`, `shadow-uber-pressed`.
- **Radius scale.** `rounded-sm` = 8px (inputs), `rounded-lg` = 12px (cards), `rounded-full` = 999px (buttons/chips). No `rounded-md`.
- **Font family.** Headings: `font-heading` (DM Sans). Body: `font-sans` (Inter). Never mix.
- **Heading weight.** 700 only. Body weight: 400–500.
- **No serif fonts anywhere.** Geometric sans-serif only.
- **No decorative borders.** Borders functional only (inputs, dividers).

## Feature Module Structure

```
features/<name>/
├── components/       # Feature-specific components
├── dto/              # Zod schemas + inferred types
│   └── <name>.schema.ts
├── hooks/            # Feature-specific hooks (if any)
├── types.ts          # Feature types
├── index.ts          # Public barrel export
└── data.ts           # Feature static data (if any)
```

### DTO convention

- Schemas in `dto/<name>.schema.ts`, named `<Name>Schema` (PascalCase).
- Inferred types exported alongside: `export type <Name>Input = z.infer<typeof <Name>Schema>`.
- Components import schemas from `../dto/<name>.schema` — no Zod in component files.
- One schema file per feature. Split to multiple only if schemas >150 lines.

## Form Convention (TanStack Form)

- Use `useAppForm()` from `@/lib/form` — never raw `useForm` from TanStack.
- `useAppForm()` exposes `form.AppField`, `form.AppForm`, `field.TextField`, `form.SubmitButton`.
- Zod validators passed via `validators: { onSubmit: <ZodSchema> }`.
- Form error display via local `formError` state (set in `onSubmit` handler).
- Reference: `src/features/auth/components/login-form.tsx`.

## Backend Convention

- `backend/` is a workspace package (`"backend": "workspace:*"` in root package.json).
- Hono app (backend/src/app.ts) is the single entry point imported by API route.
- Better Auth config lives in `backend/src/lib/auth.ts` with Prisma adapter.
- Prisma 7 uses `prisma.config.ts` (not `datasource.url` in schema). Adapter-based PrismaClient with `@prisma/adapter-neon`.
- Seed file at `backend/prisma/seed.ts` uses `npx tsx` via prisma config.
- Auth route protection: `src/proxy.ts` (Next.js config matcher) — not `middleware.ts`.

## Import Aliases

- `@/components` → `src/components`
- `@/features` → `src/features`
- `@/hooks` → `src/hooks`
- `@/lib` → `src/lib`
- `@/types` → `src/types`
- `@/data` → `src/data`
- `backend/*` → `backend/src/*`

## General

- TypeScript strict mode. No `any`.
- RSC by default. `"use client"` only when necessary.
- React Compiler enabled — avoid useMemo/useCallback unless compiler can't optimize.
- No `console.log` in production code.
