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
├── mutations/        # TanStack Query mutation hooks
├── queries/          # queryOptions + infiniteQueryOptions factories
├── stores/           # Zustand UI stores
├── pages/            # Page components (imported by app/page.tsx)
├── lib/              # Feature-specific utilities
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

## Query Factory Convention (Frontend)

Always use `queryOptions` for single-item fetches and `infiniteQueryOptions` for cursor-paginated lists. Always place factories in `features/<name>/queries/`. Factories are plain functions returning options objects.

```ts
// Pattern — single item (useQuery)
export const IMAGE_QUERY_KEY = "image" as const

export const getImageDetailQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: [IMAGE_QUERY_KEY, id],
    queryFn: async () => {
      const res = await $getImageDetail({ param: { id } })
      const json = await res.json()
      if (!json.success) throw new Error(json.message)
      return json.data
    },
  })
}

// Pattern — cursor-paginated list (useInfiniteQuery)
export const IMAGES_QUERY_KEY = "images" as const

export const getImagesQueryOptions = (query: GetImagesQuery = {}) => {
  return infiniteQueryOptions({
    queryKey: [IMAGES_QUERY_KEY, query],
    queryFn: async ({ pageParam }) => {
      const res = await $getImages({ query: { ...query, cursor: pageParam } })
      const json = await res.json()
      if (!json.success) throw new Error(json.message)
      return json.data
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
  })
}
```

- `queryOptions` → use with `useQuery(...)`. `infiniteQueryOptions` → use with `useInfiniteQuery(...)`. Never mix.
- Always create `infiniteQueryOptions` for cursor-based pagination response data.
- Components call `useQuery(getImageDetailQueryOptions(id))` or `useInfiniteQuery(getImagesQueryOptions(query))` directly.
- Always check `json.success` from the unified response.
- Export query key as a const for cross-file reference (mutations need it for invalidation).

## Mutation Convention (Frontend)

Every mutation is a custom hook file in `features/<name>/mutations/<name>.mutation.ts`:

```ts
// Pattern
export const useUpdateImage = (id: string) => {
  return useMutation({
    mutationFn: async (input) => {
      const res = await $api({ param: { id }, json: input })
      const json = await res.json()
      if (!json.success) throw new Error(json.message)  // check unified response
      return json
    },
    onSuccess: (res) => {
      toast.success(res.message)       // user-facing message from API
    },
    onError: (err) => {
      toast.error(err.message)         // error toast on failure
    },
    onSettled: (_res, _error, _vars, _result, context) => {
      context.client.invalidateQueries({ queryKey: [...] })  // invalidate in onSettled
    },
  })
}
```

Rules:
- Always destructure `res.json()`, check `json.success`, throw on failure.
- Show toast in `onSuccess` (message from API) and `onError` (error message).
- Invalidate related queries in `onSettled` via `context.client.invalidateQueries`.
- Export a const query key (e.g. `export const UPLOAD_MUTATION_KEY = ["upload-images"] as const`).

## Zustand Store Convention

- Use for **transient UI state only** (sheet open/close, dialog open/close, selected item IDs).
- Never store server data in zustand — use React Query for that.
- Place in `features/<name>/stores/<name>.store.ts`.
- Export store via `create<State>()((set) => ({ ... }))`.
- Components subscribe via selector: `useStore((s) => s.onOpen)`.
- Clean up on close: use `useEffect` to reset state when component closes.

```ts
// Pattern
import { create } from "zustand"

interface State {
  open: boolean
  selectedImageId: string | null
  onOpen: (imageId: string) => void
  onClose: () => void
}

export const useImageDetailSheetStore = create<State>()((set) => ({
  open: false,
  selectedImageId: null,
  onOpen: (imageId) => set({ selectedImageId: imageId, open: true }),
  onClose: () => {
    set({ open: false })
    setTimeout(() => set({ selectedImageId: null }), 300)
  },
}))
```

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
