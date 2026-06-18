# PRD: Inclusion Item API Changes

**Date:** 2026-06-18
**Module:** `backend/src/modules/inclusion-item/`
**Status:** Done (backend)

---

## Summary

Simplified the Inclusion Item admin API. Two endpoints removed, one simplified. Frontend admin pages need update.

---

## Changes

### 1. GET `/:id` — REMOVED

Endpoint deleted. No more single-item fetch.

**Frontend impact:**
- Remove any edit/detail page that fetches inclusion item by ID before rendering
- If edit flow exists, load data from the list instead (client-side state)

### 2. GET `/` — No Pagination, No Search

**Before:**
```
GET /api/inclusion-items?cursor=xxx&limit=20&search=hotel
```
Returned paginated response: `{ data: [...], nextCursor, hasMore }`

**After:**
```
GET /api/inclusion-items
```
Returns flat array: `{ data: [...], message: "ok" }`

**Frontend impact:**
- Remove cursor/limit params from fetch call
- Remove search input/filter UI (if any)
- Remove pagination UI (next/prev buttons, infinite scroll, etc.)
- Response is now `data: InclusionItem[]` directly — no `nextCursor`/`hasMore` wrapper
- Record count is small, no performance concern

---

## Remaining Endpoints

| Method | Path | Body | Description |
|---|---|---|---|
| `GET /` | `/inclusion-items` | — | List all items (flat array) |
| `POST /` | `/inclusion-items` | `{ label: string }` | Create item |
| `PUT /:id` | `/inclusion-items/:id` | `{ label?: string }` | Update item |
| `DELETE /:id` | `/inclusion-items/:id` | — | Delete item (409 if in use) |

All routes require admin auth.

---

## Frontend TODO

- [ ] Update `listInclusionItems` API call — remove query params, handle flat array
- [ ] Remove pagination components/logic from inclusion item list page
- [ ] Remove search/filter UI from inclusion item list page
- [ ] Remove detail/edit-by-ID fetch if used — derive from list data
