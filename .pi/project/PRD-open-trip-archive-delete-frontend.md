# PRD: Open Trip Archive & Delete Frontend

## Context

Backend already split open trip deletion into two operations:

| Action | Method | Endpoint | Effect |
|---|---|---|---|
| Archive | `PATCH` | `/api/open-trips/:id/archive` | Soft delete — sets status to `archived` |
| Delete | `DELETE` | `/api/open-trips/:id` | Hard delete — removes from DB permanently |

Frontend currently has no delete/archive UI. This PRD covers implementing both.

## Requirements

### 1. Open Trip List Page (Admin)

Add a row action menu (dropdown or similar) per open trip row with:

- **Arsipkan** — calls `PATCH /api/open-trips/:id/archive`
  - Confirmation dialog: "Arsipkan Open Trip ini? Trip tidak akan tampil di halaman publik."
  - On success: invalidate list query, show toast "Open Trip berhasil diarsipkan"
  
- **Hapus** — calls `DELETE /api/open-trips/:id`
  - Confirmation dialog (destructive): "Hapus Open Trip ini secara permanen? Tindakan ini tidak dapat dibatalkan."
  - On success: invalidate list query, show toast "Open Trip berhasil dihapus"

### 2. Open Trip Edit Page (Admin)

Add action buttons (likely in the header or footer area):

- **Arsipkan** button — same flow as list page
- **Hapus** button — same flow as list page, then redirect to list

### 3. API Client

Add to the open trip API client:

```ts
// Archive (soft delete)
export async function archiveOpenTrip(id: string) {
  const res = await apiClient.openTrips[":id"].archive.$patch({ param: { id } })
  const json = await res.json()
  if (!json.success) throw new Error(json.message)
  return json
}

// Hard delete
export async function deleteOpenTrip(id: string) {
  const res = await apiClient.openTrips[":id"].$delete({ param: { id } })
  const json = await res.json()
  if (!json.success) throw new Error(json.message)
  return json
}
```

### 4. Query Invalidation

Both mutations should invalidate the open trip list query on success (`onSettled` pattern per project convention).

## UX Notes

- **Archive** = reversible (can change status back to draft/published via edit)
- **Delete** = permanent, no undo — use a more alarming confirmation dialog
- Disable delete button for published trips? Optional, but recommended to prevent accidental deletion of live content.
- Archived trips already hidden from public listing (backend handles this). Admin list shows all statuses.

## Files to Touch

| Area | What to find/create |
|---|---|
| API client | Open trip feature's API client file — add `archiveOpenTrip`, `deleteOpenTrip` |
| List page | Open trip admin list — add row actions menu with both actions |
| Edit page | Open trip admin edit — add archive/delete buttons |
| Mutations/hooks | Open trip mutations file — add mutation hooks with query invalidation |
| Confirmation dialog | Reuse existing `AlertDialog` from shadcn/ui |

## Out of Scope

- Bulk archive/delete
- Restore from archive (use edit page to change status)
- Separate "archived" tab/filter in list (existing status filter covers this)
