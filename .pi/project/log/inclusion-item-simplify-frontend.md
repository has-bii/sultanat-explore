# InclusionItem API Simplify + Frontend CRUD Pages

**Date:** 2026-06-18
**Domain:** Full Stack

## Summary

Simplified InclusionItem backend API (removed pagination, search, single-item fetch) and built the full frontend admin CRUD pages with sidebar navigation.

## Backend Changes

**File:** `backend/src/modules/inclusion-item/`

- **`inclusion-item.route.ts`** — Removed `GET /:id` endpoint. Simplified `GET /` to return flat array (no cursor pagination, no search query, no `sValidator`).
- **`inclusion-item.schema.ts`** — Removed `inclusionItemQuerySchema` and its types (`InclusionItemQueryInput`, `InclusionItemQueryOutput`). Removed `cursorPaginationSchema` import.
- **`inclusion-item.service.ts`** — Simplified `listInclusionItems()` to return all items (no `cursorArgs`/`toPage`). Removed `getInclusionItem()` (single fetch) and `HTTPException` import for that fn.

## Frontend Changes

### New Feature: InclusionItem Admin CRUD

**Page:** `frontend/src/app/admin/dashboard/inclusion-item/page.tsx`

**Feature files** under `frontend/src/features/inclusion-item/`:

| Path | Description |
|---|---|
| `pages/inclusion-item-list.page.tsx` | List page with create/edit/delete dialogs |
| `components/dialog/` | Create/edit dialog (`index.tsx`) and delete confirmation dialog (`delete.tsx`) |
| `components/form/index.tsx` | Inclusion item form (label field) |
| `components/table/` | Data table (`index.tsx`) and row component (`row.tsx`) |
| `hooks/use-inclusion-item-form.ts` | Form state management |
| `mutations/` | Create, update, delete mutations (TanStack Query) |
| `queries/index.ts` | Query hooks for fetching inclusion items |
| `stores/` | Zustand stores for dialog open/close state |

### Sidebar Update

**File:** `frontend/src/components/sidebar/app-sidebar.tsx`

Added "Open Trip" nav section with two sub-items:
- Overview → `/admin/dashboard/open-trip`
- Inclusion Item → `/admin/dashboard/inclusion-item`

## Files Changed

```
M  backend/src/modules/inclusion-item/inclusion-item.route.ts   (+3 -11)
M  backend/src/modules/inclusion-item/inclusion-item.schema.ts   (+0 -9)
M  backend/src/modules/inclusion-item/inclusion-item.service.ts  (+2 -25)
M  frontend/src/components/sidebar/app-sidebar.tsx               (+16 -1)

A  frontend/src/app/admin/dashboard/inclusion-item/page.tsx
A  frontend/src/features/inclusion-item/ (13 files — components, hooks, mutations, queries, stores)
```

## PRD Reference

Changes follow [inclusion-item-api-changes.md](../prd/inclusion-item-api-changes.md).
