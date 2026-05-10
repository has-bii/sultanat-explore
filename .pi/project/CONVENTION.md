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
- Use shadcn components as building blocks.
- Use `cn()` from `src/lib/utils.ts` for conditional classes.
- Tailwind classes sorted by prettier-plugin-tailwindcss.

## Feature Module Structure

```
features/<name>/
├── components/       # Feature-specific components
├── hooks/            # Feature-specific hooks (if any)
├── types.ts          # Feature types
├── index.ts          # Public barrel export
└── data.ts           # Feature static data (if any)
```

## Import Aliases

- `@/components` → `src/components`
- `@/features` → `src/features`
- `@/hooks` → `src/hooks`
- `@/lib` → `src/lib`
- `@/types` → `src/types`
- `@/data` → `src/data`

## General

- TypeScript strict mode. No `any`.
- RSC by default. `"use client"` only when necessary.
- React Compiler enabled — avoid useMemo/useCallback unless compiler can't optimize.
- No `console.log` in production code.
