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
- Use `cn()` from `@/lib/utils` for conditional classes.
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

## Monorepo Convention

- `frontend/` — Next.js app. All source code inside `frontend/src/`.
- `backend/` — workspace package (`"backend": "workspace:*"` in root/frontend package.json).
- Hono app (`backend/src/app.ts`) is the single entry point imported by API route.
- Better Auth config lives in `backend/src/lib/auth.ts` with Prisma adapter.
- Prisma 7 uses `prisma.config.ts` (not `datasource.url` in schema). Adapter-based PrismaClient with `@prisma/adapter-neon`.
- Seed file at `backend/prisma/seed.ts` uses `npx tsx` via prisma config.
- Auth route protection: `frontend/src/proxy.ts` (Next.js config matcher) — not `middleware.ts`.
- Turborepo tasks: `db:generate` (generate Prisma client) → `typecheck` → `lint` → `build`.

## Import Aliases

- `@/components` → `frontend/src/components`
- `@/features` → `frontend/src/features`
- `@/hooks` → `frontend/src/hooks`
- `@/lib` → `frontend/src/lib`
- `@/types` → `frontend/src/types`
- `@/data` → `frontend/src/data`
- `backend/*` → `backend/src/*` (workspace package)

## General

- TypeScript strict mode. `any` allowed only in `utils/response.ts` (generic error field) and Hono catch-all types.
- RSC by default. `"use client"` only when necessary.
- React Compiler enabled — avoid useMemo/useCallback unless compiler can't optimize.
- No `console.log` in production code.

## Backend Module Convention

```
backend/src/
├── modules/<domain>/
│   ├── <domain>.route.ts      # Hono route handlers
│   ├── <domain>.service.ts    # Business logic (DB + external ops)
│   └── <domain>.schema.ts    # Zod schemas (request validation)
├── middlewares/                # Shared Hono middleware
├── schemas/                   # Shared Zod schemas (param, query)
├── utils/                     # Shared utilities (response.ts)
└── lib/                       # Shared utilities (db, auth, r2, etc.)
```

### Route file
- Chain routes with `.get()`, `.post()`, etc.
- Place public routes before `requireAuth`, auth-required routes after.
- Use `zValidator(target, schema)` for validation — never manual `safeParse`.
- Wrap success responses with `successResponse(data, msg)` from `backend/utils/response` — `c.json(successResponse(data, msg), status)`.
- `delete` routes return `c.json(successResponse(null, "..."), 200)` — 204 is avoided to keep the response envelope uniform.

### Service file
- One exported function per operation (uploadImage, listImages, etc.)
- Throw `HTTPException` with specific status + message.
- Keep R2/external ops and DB ops in same function (service owns full flow).

### Schema file
- Export Zod schemas + inferred types.
- Named `<Name>Schema` (PascalCase).
- Import from `zod` (not `@hono/zod-validator`).

## API Response Format

All endpoints must return one of two shapes:

**Success (2xx):**
```ts
{ success: true, data: T, message: string }
```

**Error (4xx/5xx):**
```ts
{ success: false, data: null, message: string, error: any }
```

- Use `successResponse(data, message?)` in route handlers for success responses.
- Use `errorResponse(message, error?)` in `app.ts` global `onError` / `notFound` handlers (and thrown `HTTPException` automatically lands in `onError`).
- Every route handler returns data via `successResponse()` — never raw `c.json(data)`.
- `message` should be descriptive Indonesian (e.g. `"Foto berhasil dihapus"`).
- `error` field in error responses carries the technical cause or a user-safe string when cause is internal.
