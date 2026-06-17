# Phase 3: Frontend Admin Features

## Goal

Rename admin feature modules to match new model names. Update all internal refs (components, hooks, mutations, queries, stores).

## Prerequisites

- [ ] Phase 2 complete (backend modules renamed)
- [ ] Backend types (City, CityImage, Destination) available via `backend/*` import

## Steps

### 3.1 Rename `features/destination/` → `features/city/`

Move entire folder:
```
features/destination/ → features/city/
```

Rename all internal files:
```
components/
  dialog/delete.tsx              (update component names)
  edit-skeleton.tsx
  filter/index.tsx
  form/index.tsx                 → update form field refs
  gallery/                       → update gallery types (CityImage)
    draggable-item.tsx
    gallery-view.tsx
    image-card.tsx
    index.tsx
    skeleton.tsx
  table/
    index.tsx
    row.tsx
hooks/
  use-destination-filters.ts     → use-city-filters.ts
  use-destination-form.ts        → use-city-form.ts
mutations/
  create-destination.mutation.ts → create-city.mutation.ts
  delete-destination.mutation.ts → delete-city.mutation.ts
  update-destination.mutation.ts → update-city.mutation.ts
  update-gallery.mutation.ts     → update-gallery.mutation.ts (name stays)
queries/
  index.ts                       → update query keys, API paths
pages/
  create-destination.page.tsx    → create-city.page.tsx
  destination-list.page.tsx      → city-list.page.tsx
  edit-destination.page.tsx      → edit-city.page.tsx
```

Internal renames:
- Component exports: `DestinationForm` → `CityForm`, `DestinationTable` → `CityTable`, etc.
- Hook names: `useDestinationFilters` → `useCityFilters`, `useDestinationForm` → `useCityForm`
- Mutation names: `useCreateDestination` → `useCreateCity`, etc.
- Query keys: `["destinations", ...]` → `["cities", ...]`
- API paths in queries: `/api/destinations` → `/api/cities`
- Import paths: `@/features/destination/` → `@/features/city/`
- Type refs: `Destination` → `City` (from backend types)

### 3.2 Rename `features/attraction/` → `features/destination/`

Move entire folder:
```
features/attraction/ → features/destination/
```

Rename all internal files:
```
components/
  dialog/
    delete.tsx
    index.tsx
  form/
    index.tsx
    skeleton.tsx
  list-filter/
    index.tsx
  table/
    index.tsx
    row.tsx
hooks/
  use-attraction-form.ts          → use-destination-form.ts
  use-attraction-list-filters.ts  → use-destination-list-filters.ts
mutations/
  create-attraction.mutation.ts   → create-destination.mutation.ts
  delete-attraction.mutation.ts   → delete-destination.mutation.ts
  update-attraction.mutation.ts   → update-destination.mutation.ts
queries/
  index.ts                        → update query keys, API paths
pages/
  attraction-list.page.tsx        → destination-list.page.tsx
stores/
  attraction-dialog.store.ts      → destination-dialog.store.ts
  delete-attraction-dialog.store.ts → delete-destination-dialog.store.ts
```

Internal renames:
- Component exports: `AttractionForm` → `DestinationForm`, `AttractionTable` → `DestinationTable`, etc.
- Hook names: `useAttractionForm` → `useDestinationForm`, etc.
- Mutation names: `useCreateAttraction` → `useCreateDestination`, etc.
- Query keys: `["attractions", ...]` → `["destinations", ...]`
- API paths in queries: `/api/attractions` → `/api/destinations`
- Import paths: `@/features/attraction/` → `@/features/destination/`
- Type refs: `Attraction` → `Destination` (from backend types)
- FK refs: `destinationId` → `cityId` (where pointing to old Destination / new City)

### 3.3 Update store files

- `features/city/stores/` — if destination stores existed, rename to city stores
- `features/destination/stores/` — rename attraction stores to destination stores
- Store names: `useDestinationDialogStore` → `useCityDialogStore`, `useAttractionDialogStore` → `useDestinationDialogStore`

### 3.4 Update shared component imports

Check these shared components that may import from old feature paths:
- `frontend/src/components/sidebar/app-sidebar.tsx` — nav links
- `frontend/src/components/sidebar/nav-dashboard.tsx` — admin nav items

## Verification

- [ ] `features/city/` exists with all city (old destination) admin files
- [ ] `features/destination/` exists with all destination (old attraction) admin files
- [ ] No `features/destination/` referencing old Destination model (should be City now)
- [ ] No `features/attraction/` folder remaining
- [ ] All internal imports resolve (check `pnpm typecheck` in frontend)
- [ ] Query keys use new names
- [ ] API paths use new endpoints

## Notes

- Use find-and-replace carefully — "destination" appears in public features too. Scope replacements to admin features only.
- `grep -r "features/destination\|features/attraction" frontend/src/` to find import path refs that need updating.
