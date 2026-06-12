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

## Import Aliases

- `@/components` → `frontend/src/components`
- `@/features` → `frontend/src/features`
- `@/hooks` → `frontend/src/hooks`
- `@/lib` → `frontend/src/lib`
- `@/types` → `frontend/src/types`
- `@/data` → `frontend/src/data`
- `backend/*` → `backend/src/*` (workspace package)
