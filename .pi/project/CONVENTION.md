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
- **Suspense components use `export default`** — never barrel-export. Components that call `useSuspenseQuery` or `useSuspenseInfiniteQuery` must `export default` and be consumed via `next/dynamic`.
- Every suspense component needs a **`<Name>Skeleton`** (e.g. `TripCardSkeleton`) collocated in the same file or a sibling `<name>-skeleton.tsx`.
- Consume pattern:
  ```ts
  const Component = dynamic(() => import("..."), {
    ssr: false,
    loading: ComponentSkeleton,
  })
  ```

## Import Aliases

- `@/components` → `frontend/src/components`
- `@/features` → `frontend/src/features`
- `@/hooks` → `frontend/src/hooks`
- `@/lib` → `frontend/src/lib`
- `@/types` → `frontend/src/types`
- `@/data` → `frontend/src/data`
- `backend/*` → `backend/src/*` (workspace package)

## Zustand Store Convention

### Shared Factories

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

## List Filter Hooks

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
