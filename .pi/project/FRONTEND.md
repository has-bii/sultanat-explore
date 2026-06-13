# Frontend

## Architecture

### Routing

- **Server Components by default.** Add `"use client"` only when needed (event handlers, hooks, browser APIs).
- **Feature-based modules.** `frontend/src/features/<domain>/` owns components, hooks, types. Shared resources at `frontend/src/components/`, `frontend/src/hooks/`, `frontend/src/lib/`.
- **Route groups.** Public pages in `(public)` route group (Navbar/Footer in its layout). Admin in `admin/` route group with dashboard layout (sidebar + header).
- **Admin layout.** Dashboard pages wrapped in shadcn `SidebarProvider` + `AppSidebar` + `Header`/`MainPage` components.
- **No CMS yet.** Content still static/hardcoded for public pages. CMS decision deferred until admin modules built.

### Feature Module Structure

```
features/<name>/
├── components/       # Feature-specific components
├── dto/              # Valibot schemas + inferred types
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

### Design System

- **Source:** `DESIGN.md` — Uber-inspired achromatic design system.
- **Fonts:** Inter (body / UberMoveText substitute), DM Sans (headings / UberMove substitute). Loaded via `next/font/google`.
- **Colors:** Strictly black + white + gray. Zero chroma in UI chrome. See `DESIGN.md §2`.
- **Radius:** Pill buttons (999px), standard cards (8px), comfortable containers (12px). No in-between.
- **Shadows:** `rgba(0,0,0,0.12)`–`0.16` only. Whisper-subtle. No colored shadows.
- **Typography:** Custom utilities (`text-display` thru `text-micro`) map to DESIGN.md §3 scale.
- **Components:** shadcn/ui overridden to match — full-pill buttons, achromatic palette, minimal borders.

## Conventions

### File Naming

| Type | Pattern | Example |
|---|---|---|
| Components | `kebab-case.tsx` | `trip-card.tsx` |
| Pages | Next.js convention | `page.tsx`, `layout.tsx`, `loading.tsx` |
| Hooks | `use-<name>.ts` | `use-trip-filter.ts` |
| Utilities | `kebab-case.ts` | `format-currency.ts` |
| Types | `kebab-case.ts` | `trip.ts` |
| Data files | `kebab-case.ts` or `.json` | `destinations.ts` |

### Component Naming

- File: `trip-card.tsx` → Export: `TripCard` (PascalCase)
- One component per file. Co-locate variants in same file if small.
- Barrel exports via `index.ts` in feature folders.
- **Suspense components use `export default`** — never barrel-export. Components that call `useSuspenseQuery` or `useSuspenseInfiniteQuery` must `export default` and be consumed via `next/dynamic`.
- Every suspense component needs a **`<Name>Skeleton`** (e.g. `TripCardSkeleton`) collocated in the same file or a sibling `<name>-skeleton.tsx`.
- Consume pattern:
  ```ts
  const Component = dynamic(() => import("..."), {
    ssr: false,
    loading: ComponentSkeleton,
  })
  ```

### Import Aliases

- `@/components` → `frontend/src/components`
- `@/features` → `frontend/src/features`
- `@/hooks` → `frontend/src/hooks`
- `@/lib` → `frontend/src/lib`
- `@/types` → `frontend/src/types`
- `@/data` → `frontend/src/data`
- `backend/*` → `backend/src/*` (workspace package)

### Zustand Store Convention

#### Shared Factories

Use `createDialogStore<TMeta>()` from `@/hooks/create-dialog-store` for open/close + metadata stores:

```ts
// Simple open/close with entity ID
export const useXDialogStore = createDialogStore<string>()

// Open/close with multiple fields
export const useXDialogStore = createDialogStore<{ id: string; name: string }>()

// Toggle-only (no metadata)
export const useXDialogStore = createToggleStore()
```

Store shape:
- `createDialogStore<TMeta>` → `{ open, meta: TMeta | null, onOpen(meta: TMeta | null), onClose() }`
- `createToggleStore()` → `{ open, onOpen(), onOpenChange(bool) }`

`onOpen` accepts `TMeta | null` to support "create mode" (e.g. `openDialog(null)` to open form with no pre-selected entity).

Do NOT create store files from scratch for dialog/sheet state. Use the factory.

#### General Zustand Rules

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

### List Filter Hooks

For paginated list pages with search + sort filters, use shared utilities from `@/hooks/use-list-filters`:

- `filterParsers` — spread into `useQueryStates` for `search` and `order` params.
- `featuredParser` — spread separately for features that need a `featured` filter.
- `createFilterMethods(setQuery, sortFields)` — returns `onSearchChange`, `onSortOrderChange`, `onFeaturedChange`.

Each feature still defines its own `useQueryStates` call with feature-specific `sort` options. Custom filters (beyond search/sort/featured) are added as additional nuqs params.

```ts
import { createFilterMethods, filterParsers, featuredParser } from "@/hooks/use-list-filters"

// Without featured
export function useXFilters() {
  const [query, setQuery] = useQueryStates({
    ...filterParsers,
    sort: parseAsStringLiteral(["name", "createdAt"] as const).withDefault("createdAt"),
  })
  const { onSearchChange, onSortOrderChange } = createFilterMethods(setQuery, ["name", "createdAt"])
  return { query, methods: { onSearchChange, onSortOrderChange } }
}

// With featured
export function useXFilters() {
  const [query, setQuery] = useQueryStates({
    ...filterParsers,
    ...featuredParser,
    sort: parseAsStringLiteral(["name", "createdAt"] as const).withDefault("createdAt"),
  })
  const methods = createFilterMethods(setQuery, ["name", "createdAt"])
  return { query, methods }
}
```

### Query Convention

- Always use `queryOptions` for single-item fetches and `infiniteQueryOptions` for cursor-paginated lists.
- Always place factories in `features/<name>/queries/`. Factories are plain functions returning options objects.
- `queryOptions` → use with `useQuery(...)`. `infiniteQueryOptions` → use with `useInfiniteQuery(...)`. Never mix.
- Always create `infiniteQueryOptions` for cursor-based pagination response data.
- Always check `json.success` from the unified response.
- Export query key as a const for cross-file reference (mutations need it for invalidation).

### Mutation Convention

Every mutation is a custom hook file in `features/<name>/mutations/<name>.mutation.ts`:

```ts
// Pattern
export const useUpdateImage = (id: string) => {
  return useMutation({
    mutationFn: async (input) => {
      const res = await $api({ param: { id }, json: input })
      const json = await res.json()
      if (!json.success) throw new Error(json.message)
      return json
    },
    onSuccess: (res) => {
      toast.success(res.message)
    },
    onError: (err) => {
      toast.error(err.message)
    },
    onSettled: (_res, _error, _vars, _result, context) => {
      context.client.invalidateQueries({ queryKey: [...] })
    },
  })
}
```

Rules:
- Always destructure `res.json()`, check `json.success`, throw on failure.
- Show toast in `onSuccess` (message from API) and `onError` (error message).
- Invalidate related queries in `onSettled` via `context.client.invalidateQueries`.
- Export a const query key (e.g. `export const UPLOAD_MUTATION_KEY = ["upload-images"] as const`).

### Form Convention

- Use `useAppForm()` from `@/lib/form` — never raw `useForm` from TanStack.
- `useAppForm()` exposes `form.AppField`, `form.AppForm`, `field.TextField`, `form.SubmitButton`.
- Valibot validators passed via `validators: { onSubmit: <ValibotSchema> }` — TanStack Form supports Standard Schema natively.
- Do NOT use `@tanstack/valibot-form-adapter` — deprecated. Pass Valibot schema directly.
- Form error display via local `formError` state (set in `onSubmit` handler).

### Button Icon Convention

Use the `Button` component from `@/components/ui/button` for icon + label buttons. Do **not** apply explicit icon size classes; the button sizes icons automatically via `data-icon`.

- Left icon:
  ```tsx
  <Button>
    <Icon data-icon="inline-start" />
    <span>Label</span>
  </Button>
  ```
- Right icon:
  ```tsx
  <Button>
    <span>Label</span>
    <Icon data-icon="inline-end" />
  </Button>
  ```

Rules:
- Only applies to the shadcn `Button` component.
- Skip plain `<button>` elements.
- Skip icon-only buttons (`size="icon"`, `size="icon-sm"`, etc.).
- Always wrap the label in `<span>`.
- Never set icon size classes on the icon; spacing and sizing are handled by the button styles.

### Button Loading Convention

Use the `ButtonLoading` component from `@/components/button-loading` for any submit or async action button:

```tsx
import { ButtonLoading } from "@/components/button-loading"

<ButtonLoading isLoading={isPending} loadingLabel="Menyimpan...">
  Simpan
</ButtonLoading>
```

Rules:
- `isLoading: boolean` — required; shows spinner and swaps label while true.
- `loadingLabel?: string` — label during loading. Default: `"Memuat..."`.
- `icon?: LucideIcon` — optional left icon shown when not loading.
- Always use `ButtonLoading` for form submit buttons and async CTAs.
- Keep `loadingLabel` in Bahasa Indonesia, descriptive of the action.
- Button is automatically disabled while `isLoading` is true.