# PRD — Frontend: Process Existing Image

> Status: ready to implement. Backend endpoint already shipped this session:
> `POST /image/:id/process` in `backend/src/modules/image/image.*`.

## Context

Legacy `Image` rows created during the no-processing window have
`blurHash = null`. A new backend endpoint re-encodes the R2 asset to webp and
writes a blurhash, updating the row in place. This PRD covers the admin-UI
surface to trigger that operation from the existing image detail sheet.

The endpoint is a **maintenance / backfill** tool — admin-only, manual,
one image at a time. It is NOT part of the upload flow (`presign` + `confirm`
already do this for new uploads). Surface it minimally; don't build bulk UX.

## Endpoint contract (already implemented, do not re-derive)

- **Route:** `POST /image/:id/process` (admin-only, behind `requireAuth`)
- **Path param:** `id` — the image UUID (`paramIdSchema`)
- **Request body:** none
- **Success (200):** `{ success: true, data: Image, message: "Foto berhasil diproses" }`
  - `data` is the full updated `Image` row — **the `url` changes** (fresh
    `images/YYYY/MM/<new-uuid>.webp` key), and `fileSize` + `blurHash` are now
    populated.
- **Errors (all surface `{ success: false, message }`):**
  - `409` `"Foto sudah diproses"` — idempotency guard; `blurHash` already set.
  - `404` `"Foto tidak ditemukan"` — idempotent race with a delete.
  - `400` `"File rusak atau tidak didukung"` — sharp failed on the stored bytes (corrupt original).
  - `500` `"Gagal menyimpan foto"` — R2 upload failure during processing.
- **Latency:** ~1.5s in-request (sharp re-encode). Plan the UI around a visible
  pending state of 1–2s, not instant.

The endpoint reads the old object from R2, re-encodes, uploads a **fresh**
webp key, updates the DB row, then deletes the original — so the returned
`url` is a new path. Any cached client state keyed on the old URL is stale.

## Scope (in)

1. One TanStack Query mutation hook: `useProcessImageMutation`.
2. One trigger in the image detail sheet (`features/image/components/detail-sheet/`),
   visible only when `image.blurHash` is null.
3. A lightweight confirm dialog before the destructive re-encode.
4. Toast feedback for success + each error code.
5. Query invalidation so the detail sheet + grid reflect the new url/blurhash.

## Scope (out) — explicitly skip

- **No bulk process button / multi-select process.** Single image only. The
  backend is single-id by design (this session's decision). Bulk is YAGNI until
  an admin asks for a one-click backfill-all.
- **No "show only unprocessed" filter on the images grid.** The grid already
  renders a blur placeholder for `blurHash == null`, so unprocessed images are
  visually distinguishable; scrolling is enough for now.
- **No optimistic update.** The URL changes server-side; optimistic patching of
  a URL we don't yet know is more bugs than win. Await + invalidate.
- **No new page or route.** Reuse the existing detail sheet.
- **No new shadcn component installs.** Reuse the existing `AlertDialog` +
  `Button` primitives already in the repo.

## Implementation spec

### 1. Mutation hook — `features/image/mutations/process-image.mutation.ts`

Follow the exact pattern of the sibling mutation files (e.g.
`update-image.mutation.ts`, `delete-image.mutation.ts`). Conventions:

- Export a `useProcessImageMutation()` hook using `useMutation` from
  `@tanstack/react-query`.
- Call the Hono RPC client (`frontend/src/lib/api-client.ts`) — the endpoint
  is auto-typed from the route. Match how sibling mutations invoke the client;
  do not hand-type the URL or body.
- `onSuccess`: invalidate the image **detail** query (the one the detail sheet
  reads — match the query key used in `features/image/queries/`) AND the image
  **list** query (the grid's key). Both must refetch so the new `url` /
  `blurHash` land in the UI without a manual reload.
- `onError`: do NOT throw here — map the HTTP status to a toast and let the
  mutation settle. Specifically:
  - `409` → `toast.error("Foto sudah diproses")` and **also invalidate the
    detail query** (our local copy may predate the server's `blurHash`).
  - `404` → `toast.error("Foto tidak ditemukan")` then invalidate the list
    query (the image may have been deleted elsewhere → grid should drop it).
  - `400` → `toast.error("File rusak atau tidak didukung")`
  - `500` / other → `toast.error("Gagal memproses foto")`
- Return type: the hook returns the standard mutation; components read
  `isPending` for button state.

### 2. Detail sheet trigger — `features/image/components/detail-sheet/`

Add the affordance to the **existing detail sheet** (the per-image admin panel
with the alt-text update form). Concretely:

- **Render only when** `image.blurHash == null`. If `blurHash` is set, render
  nothing — the image is already processed. This is the single source of truth
  for "needs processing", matching the backend's own gate.
- **Label:** `"Proses foto"` (Bahasa Indonesia, site convention).
- **Helper text** (one line, under or beside the button): something like
  `"Kompres ke webp + buat blurhash"` so the admin knows what the button does.
  Keep it to one short phrase — no paragraphs.
- **Pending state:** while `isPending`, button shows the existing loading
  affordance (`ButtonLoading` component exists at
  `components/button-loading.tsx` — reuse it; don't hand-roll a spinner) and
  is disabled. Disable the confirm dialog's action button too while pending.
- **Disabled state** is only the `isPending` case — never pre-disable based on
  blurhash (the whole point is to enable it when blurhash is null).

### 3. Confirm dialog

Processing re-encodes and replaces the R2 asset; the stored `url` changes
irreversibly. A misclick cost is low (the result is a strictly-better webp) but
not zero, and the operation takes visible time. Wrap the trigger in the
existing `AlertDialog` primitive:

- Title: `"Proses foto ini?"`
- Body: one line — `"Foto akan dikompres ke webp dan blurhash dibuat. Tindakan ini tidak dapat dibatalkan."`
- Confirm button: `"Proses"` (destructive variant is NOT needed — this isn't
  deletion; use the default/primary variant), calls the mutation.
- Cancel: `"Batal"`.
- Closing the dialog while the mutation is pending should NOT cancel the
  request — it's already in-flight server-side; just hide the dialog and let
  the toast resolve it. Simplest: keep the dialog open (action button
  disabled) until the mutation settles.

### 4. Post-success UX

- On success: the mutation's `onSuccess` invalidates the detail + list queries.
  The detail sheet will re-render with the new `blurHash` (so the trigger
  disappears — the image is now processed) and the new `url` (the preview
  image swaps). No manual local state patching needed.
- Toast: `toast.success("Foto berhasil diproses")` in the component's
  `onSuccess` handler (not in the hook — keep the hook's `onSuccess` purely
  about cache, let the component own user-facing success text, matching the
  pattern in sibling mutation consumers if that's how they do it; if siblings
  toast in the hook, do it there instead — match the existing convention).
- The confirm dialog closes on success.

## Acceptance criteria

1. An unprocessed image (`blurHash == null`) shows a `"Proses foto"` button in
   its detail sheet; a processed image shows no such button.
2. Clicking the button opens a confirm dialog; confirming fires the mutation.
3. While pending, the button + confirm action are disabled and show a loader.
4. Success: detail sheet + grid refetch and reflect the new webp `url` and a
   real `blurHash`; the `"Proses foto"` button disappears; a success toast fires.
5. `409` from the backend: shows `"Foto sudah diproses"` toast and the local
   detail query invalidates (button disappears without a manual reload).
6. `404` / `400` / `500`: shows the corresponding Indonesian error toast; no
   crash, no unhandled promise.
7. `pnpm typecheck` passes; `pnpm lint` passes.

## Open questions to resolve in the implementation session

- Whether sibling mutation hooks toast in the hook or in the component —
  **match that convention** rather than introducing a new one. The PRD above
  leaves success-toast placement slightly conditional on purpose.
- Exact query-keys for the image detail + list queries — read
  `features/image/queries/index.ts` at implement time and invalidate exactly
  those keys (don't invent new ones).
- If the detail sheet today is read from a `useQuery` keyed by image id, the
  invalidation target is that key. If it's read from a store / router state,
  prefer invalidating the list query and forcing a refetch over manual
  local patching.