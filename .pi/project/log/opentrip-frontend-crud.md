# Open Trip Frontend Admin CRUD

**Date:** 2026-06-18
**Domain:** Frontend

## Summary

Built full admin CRUD pages for Open Trip module — list, create, edit with complex nested form (cities → destinations, inclusions, cover image, date ranges, Tiptap description).

## New Feature: Open Trip Admin CRUD

**Pages:**
- `frontend/src/app/admin/dashboard/open-trip/page.tsx` — list
- `frontend/src/app/admin/dashboard/open-trip/create/page.tsx` — create
- `frontend/src/app/admin/dashboard/open-trip/[id]/edit/page.tsx` — edit

**Feature files** under `frontend/src/features/open-trip/`:

| Path | Description |
|---|---|
| `queries/index.ts` | queryKeys factory, infiniteQueryOptions (admin list), queryOptions (detail) |
| `mutations/create-open-trip.mutation.ts` | Create mutation with toast + invalidation |
| `mutations/update-open-trip.mutation.ts` | Update mutation (Option 2, id from hook) |
| `mutations/delete-open-trip.mutation.ts` | Delete mutation (Option 1, id from mutate) |
| `stores/delete-open-trip-dialog.store.ts` | Zustand dialog store (createDialogStore<string>) |
| `hooks/use-open-trip-filters.ts` | nuqs filters: sort, status, order |
| `hooks/use-open-trip-form.ts` | TanStack Form hook with createOpenTripSchema validation |
| `components/filter/index.tsx` | Status + sort selects |
| `components/table/index.tsx` | Suspense infinite table with "Muat lebih banyak" |
| `components/table/row.tsx` | Row with dropdown menu (edit link, delete trigger) |
| `components/dialog/delete.tsx` | Soft-delete AlertDialog |
| `components/form/index.tsx` | Multi-section form: basic info, itinerary (cities/destinations), inclusions, date range |
| `components/form/form-types.ts` | Re-exported Hono response types for cities, destinations, inclusion-items |
| `components/edit-skeleton.tsx` | Page-level Suspense skeleton |
| `pages/open-trip-list.page.tsx` | List page coordinator |
| `pages/create-open-trip.page.tsx` | Create page (loads cities, destinations, inclusion-items) |
| `pages/edit-open-trip.page.tsx` | Edit page (pre-populates form from detail query) |

## Key Decisions

- **No search filter** — backend open-trip query has no `search` field, only status/date/price filters.
- **Nested array fields** — uses `form.Field mode="array"` for cities (with nested destinations array) and inclusions. Manual `Select` components for nested fields since `form.AppField` registered fields only work at top level.
- **Dedicated pages, not dialogs** — form too complex (nested arrays, Tiptap, image picker) for dialog container.
- **Soft delete** — `DELETE` endpoint archives (status → "archived"), not hard delete.
- **Price formatted inline** — `Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" })` in row component.
- **Date range derivation** — backend auto-derives startAt/endAt from cities if not manually set; form shows optional manual override fields.

## Files Changed

```
A  frontend/src/app/admin/dashboard/open-trip/page.tsx
A  frontend/src/app/admin/dashboard/open-trip/create/page.tsx
A  frontend/src/app/admin/dashboard/open-trip/[id]/edit/page.tsx
A  frontend/src/features/open-trip/ (16 files — queries, mutations, stores, hooks, components, pages)
```
