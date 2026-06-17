# Frontend

## Architecture

### Routing

- **Server Components by default.** Add `"use client"` only when needed (event handlers, hooks, browser APIs).
- **Page components** (`features/<name>/pages/*.page.tsx`) should be **server components** that compose client children. Do not add `"use client"` unless the page itself uses hooks/browser APIs.
- **Feature-based modules.** `frontend/src/features/<domain>/` owns components, hooks, types. Shared resources at `frontend/src/components/`, `frontend/src/hooks/`, `frontend/src/lib/`.
- **Route groups.** Public pages in `(public)` route group (Navbar/Footer in its layout). Admin in `admin/` route group with dashboard layout (sidebar + header).
- **Admin layout.** Dashboard pages wrapped in shadcn `SidebarProvider` + `AppSidebar` + `Header`/`MainPage` components.
- **No CMS yet.** Content still static/hardcoded for public pages. CMS decision deferred until admin modules built.

### Feature Module Structure

```
features/<name>/
├── components/       # Feature-specific components
│   ├── <concern>/    # Grouped by concern (form/, table/, dialog/, filter/, gallery/, etc.)
│   │   ├── index.tsx     # Main component
│   │   ├── skeleton.tsx  # Custom skeleton (layout-aware, substantial)
│   │   └── <sub>.tsx     # Supporting pieces (row, view, card, etc.)
│   ├── <singular>.tsx    # Standalone single file (rare)
│   └── edit-skeleton.tsx # Page-level Suspense fallback
├── hooks/            # Feature-specific hooks (if any)
├── mutations/        # TanStack Query mutation hooks
├── queries/          # queryOptions + infiniteQueryOptions factories
├── stores/           # Zustand UI stores
├── pages/            # Page components (imported by app/page.tsx)
├── lib/              # Feature-specific utilities
└── types.ts          # Feature types
```

#### Component Naming Rules

- **Drop feature prefix** inside `features/<name>/components/` — path provides context.
- **Subfolder name** = concern noun: `form/`, `table/`, `dialog/`, `filter/`, `gallery/`, `grid/`, `detail-sheet/`, `upload-dialog/`.
- **Export names stay PascalCase prefixed** — `DestinationForm`, `DestinationTable`.
- **File names lose prefix** — `form/index.tsx` not `destination-form.tsx`.

#### Skeleton Rules

- **Thin wrapper** (`<TableSkeleton rows={5} cols={N} />`) → inline at call site, no separate file.
- **Custom skeleton** (form layout, header, gallery grid) → `<concern>/skeleton.tsx`.
- **Page-level skeleton** (edit page with header + form) → `components/edit-skeleton.tsx`.

#### Store Rule

- **Always separate file** in `stores/` — never define stores inside component files.

### Design System

- **Source:** `DESIGN.md` — Uber-inspired achromatic design system.
- **Scope:** DESIGN.md governs **public-facing pages only**. Admin pages use default shadcn/ui styling — no custom overrides needed.
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
| Pages (route) | Next.js convention | `page.tsx`, `layout.tsx`, `loading.tsx` |
| Pages (feature) | `<name>.page.tsx` | `destination-list.page.tsx` |
| Hooks | `use-<name>.ts` | `use-trip-filter.ts` |
| Utilities | `kebab-case.ts` | `format-currency.ts` |
| Types | `kebab-case.ts` | `trip.ts` |
| Data files | `kebab-case.ts` or `.json` | `destinations.ts` |

### Component Naming

- File: `trip-card.tsx` → Export: `TripCard` (PascalCase)
- One component per file. Co-locate variants in same file if small.
- **All components use named exports** — no `export default`. Standard import pattern for everything.
- **Suspense components** (components that call `useSuspenseQuery` or `useSuspenseInfiniteQuery`) must be wrapped in `<Suspense fallback={...}>` at the call site. Never use `next/dynamic` with `ssr: false` for Suspense — use React `<Suspense>` instead.
- Every Suspense component needs a **`<Name>Skeleton`** (e.g. `TripCardSkeleton`) collocated in `<concern>/skeleton.tsx` or inline at call site (thin wrappers).
- Consume pattern for Suspense components:
  ```tsx
  import { Suspense } from "react"
  import { DestinationTable } from "@/features/destination/components/table"
  import { TableSkeleton } from "@/components/table-skeleton"

  // Thin skeleton — inline at call site
  <Suspense fallback={<TableSkeleton rowCount={5} columns={6} />}>
    <DestinationTable />
  </Suspense>

  // Custom skeleton — from concern/skeleton.tsx
  import { DestinationGallerySkeleton } from "@/features/destination/components/gallery/skeleton"
  <Suspense fallback={<DestinationGallerySkeleton />}>
    <DestinationGallery />
  </Suspense>
  ```
- Consume pattern for non-Suspense client components:
  ```ts
  import { SomeDialog } from "@/features/x/components/some-dialog"
  ```

#### Suspense Component Identification

Any component that uses `useSuspenseQuery` or `useSuspenseInfiniteQuery` **must** be wrapped in `<Suspense>` at its call site. To make these easy to identify:

- The component name should clearly indicate data loading (e.g. `DestinationTable`, `ImageGrid`, `TripCardList`).
- If a component refactors from `useQuery` to `useSuspenseQuery`, a `<Suspense fallback={...}>` wrapper must be added at the call site immediately — no exceptions.
- **Never use `next/dynamic` with `ssr: false` for Suspense boundaries.** Use React `<Suspense>` with a skeleton fallback instead.

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
- **Dialog/sheet stores:** Always use `createDialogStore<TMeta>()` or `createToggleStore()` factories — never write manual `create<State>()` stores for open/close patterns.
- **Complex UI stores** (e.g. multi-field selection): Use `create<State>()((set) => ({ ... }))` only when the state shape doesn't fit the factory pattern.
- Components subscribe via selector: `useStore((s) => s.onOpen)`.
- Clean up on close: use `useEffect` or `setTimeout` in `onClose` to reset transient state after animation.

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

See [frontend/QUERY-MUTATION.md](frontend/QUERY-MUTATION.md) for full query conventions.

### Mutation Convention

See [frontend/QUERY-MUTATION.md](frontend/QUERY-MUTATION.md) for full mutation conventions.

### Form Convention

See [frontend/FORM.md](frontend/FORM.md) for full form conventions.

Quick rules:
- Use `useAppForm()` from `@/lib/form` — never raw `useForm` from TanStack.
- `useAppForm()` exposes `form.AppField`, `form.AppForm`, `field.<RegisteredField>`, `form.SubmitButton`.
- Pass Valibot schema via `validators: { onChange: <ValibotSchema> }` for immediate feedback.
- Build full `defaultValues` inside the custom hook; clean/normalize values in the hook's `onSubmit`.
- Form-level errors: pass the `error` from `useMutation`; never use local `formError` state.
- Submit wiring: `e.preventDefault(); e.stopPropagation(); form.handleSubmit()`; wrap `<form.SubmitButton>` with `<form.AppForm>`.

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

### No console.log

- Do not leave `console.log` / `console.warn` / `console.error` in production code.
- Use `toast.error()` for user-facing errors and proper logging services for debug info.
- If temporarily needed, use `// TODO:` comment to mark for removal.