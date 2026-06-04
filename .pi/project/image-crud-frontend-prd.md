# PRD: Image CRUD Frontend

**Status:** Draft
**Date:** June 2026
**Depends on:** `image-crud-prd.md` (backend) — must be implemented first + small backend delta (see §3)

---

## 1. Overview

Frontend admin UI for managing image library. Admins upload, browse, search, sort, edit alt text, and delete images. Reusable `<ImagePicker>` component lets other admin forms (Destination, Attraction, Article, Trip) attach images by selecting from the same library.

**Sits beside** existing destination shell pages (`/admin/dashboard/destination/`) and destination's `DestinationImage` join pattern. Centralizes image storage, serves as the source of truth for all image attachments across content types.

---

## 2. Goals

- Single inventory of all uploaded images (no duplication across forms)
- Reusable picker component for any form that needs to attach images
- Fast search + sort over growing library
- Inline edit alt text without leaving the page
- Safe delete (FK constraints block delete-while-in-use, error surfaces to user)
- Consistent UX with existing admin modules (achromatic design, TanStack Form, React Query)

---

## 3. Backend Dependencies

### 3.1 Existing endpoints (from `image-crud-prd.md`)

| Method | Route | Purpose |
|--------|-------|---------|
| POST   | `/api/images`        | Upload single file (multipart) + alt |
| GET    | `/api/images`        | List images (cursor pagination) |
| GET    | `/api/images/:id`    | Get image detail |
| PATCH  | `/api/images/:id`    | Update alt |
| DELETE | `/api/images/:id`    | Hard delete from R2 + DB |

### 3.2 Backend delta required (blocker for §5 toolbar)

Add query params to `GET /api/images`:

| Param  | Type   | Default | Notes |
|--------|--------|---------|-------|
| `sort` | enum   | `createdAt` | v1 = `createdAt` only (future: `fileSize`) |
| `order`| enum   | `desc`  | `asc` \| `desc` |
| `search`| string | `null` | Filter `alt` with `startsWith`, case-insensitive |
| `cursor`| uuid  | `null` | Existing — pagination cursor |
| `limit` | int   | `20`   | Existing — page size, max 100 |

**Why:** Frontend toolbar (Q8) needs these to be server-side. Client-side sort breaks across pagination; client-side search on first page only is useless.

**Backend change scope:** Update `backend/src/schemas/query.schema.ts` (or `image.schema.ts`) + `image.service.ts` `listImages` function. ~10-20 lines. No new endpoints. Prisma `findMany` already supports `where`, `orderBy`.

**Example query:**
```
GET /api/images?sort=createdAt&order=desc&search=cappadocia&cursor=<uuid>&limit=20
```

---

## 4. Routes & Navigation

### 4.1 Admin sidebar

Add new top-level item in "Manajemen" group:

- **Label:** "Foto" (Indonesian for "Photos")
- **Icon:** Lucide `Image`
- **Route:** `/admin/dashboard/image`
- **Group:** "Manajemen" (same as Destinasi, will share group with Artikel, Trip, Gallery later)

### 4.2 Page routes

| Path | Purpose |
|------|---------|
| `/admin/dashboard/image` | Library page (grid + toolbar + load more + upload button) |

No detail route. Sheet is the detail view. No upload route — upload opens as modal.

### 4.3 URL state (full state in URL, refresh-safe)

`/admin/dashboard/image?selected=<imageId>&search=<text>&sort=createdAt&order=desc&cursor=<uuid>`

| Param | Meaning | Example |
|-------|---------|---------|
| `selected` | Open sheet with this image ID | `?selected=01923abc-...` |
| `search` | Active search query (server-side filter) | `?search=cappadocia` |
| `sort` | Sort field | `?sort=createdAt` |
| `order` | Sort direction | `?order=asc` |
| `cursor` | Pagination cursor for "Load more" | `?cursor=01923abc-...` |

**Why full URL state:** Shareable links ("look at this image"), browser back closes sheet + restores prior filter state, refresh-safe.

**Implementation:** Use **nuqs** (typed URL state manager, ~2KB gzipped, App Router native via `NuqsAdapter`). See G4 (resolved) and §15.

---

## 5. Library Page

### 5.1 Layout

```
┌──────────────────────────────────────────────────────────┐
│ Header:  Foto                              [Upload] btn  │
│ Toolbar: [Search input]  [Sort: Newest ▾]                │
│                                                          │
│ Grid (responsive, desktop-only, see §10):                │
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                          │
│ │ img │ │ img │ │ img │ │ img │  ← card w/ blurhash      │
│ │ alt │ │ alt │ │ alt │ │ alt │                          │
│ │ 2MB │ │ 4MB │ │ 1MB │ │ 3MB │                          │
│ │ 2d  │ │ 5d  │ │ 1w  │ │ 3w  │                          │
│ └─────┘ └─────┘ └─────┘ └─────┘                          │
│              ... more cards ...                         │
│                                                          │
│           [Load more] button                             │
└──────────────────────────────────────────────────────────┘
```

### 5.2 Toolbar

**Search input:**
- Placeholder: "Cari berdasar alt..."
- Debounced 300ms, updates `?search=` in URL
- Backend filters `alt` with `startsWith` insensitive (per §3.2)

**Sort dropdown (shadcn `select` or custom):**
- Options:
  - "Terbaru" → `?sort=createdAt&order=desc` (default)
  - "Terlama" → `?sort=createdAt&order=asc`
  - (Future: "Terbesar" / "Terkecil" by fileSize — defer to v2 since `fileSize` is in schema but no sort param yet)
- Updates URL on change

**Upload button:** Top-right, pill style, opens upload modal (§6).

### 5.3 Grid card (per image)

Each card shows:
- **Thumbnail** (200x200, `next/image` with blurhash placeholder)
- **Alt text** (truncated 2 lines, `text-small-heading` font, `line-clamp-2`)
- **fileSize** (formatted: "2.3 MB", `text-caption`)
- **createdAt** (relative: "2 hari lalu", `text-micro`, gray)

**Click anywhere on card** → opens side sheet with that image (§7).

**Hover state:** Subtle border darken + cursor pointer. No elevation change (achromatic design).

**No selection checkbox v1** (bulk ops = v2, see §12).

### 5.4 Pagination — "Load more" button

- Bottom of grid, centered
- Hidden when no `nextCursor`
- Disabled + text "Memuat..." while loading next page
- Appends fetched images to current list (no replace)
- Cursor in URL state — back button works across pages

**Implementation:** TanStack Query `useInfiniteQuery` with `getNextPageParam` returning `lastPage.nextCursor`.

### 5.5 Empty states

Two distinct states:

**Truly empty (no images in DB):**
- Lucide `ImagePlus` icon (large, gray)
- Heading: "Belum ada foto"
- Subtext: "Upload foto pertama untuk mulai membangun library"
- Primary CTA: "Upload foto" → opens upload modal

**Search/filter no results:**
- Lucide `ImageOff` icon (large, gray)
- Heading: "Tidak ada hasil"
- Subtext: `Tidak ada foto yang cocok dengan "<search query>"`
- Secondary CTA: "Hapus pencarian" → clears `?search=` from URL

### 5.6 Loading state

**Initial load:** Skeleton grid — 8 placeholder cards matching G2 layout (gray blocks, no shimmer animation needed beyond Tailwind's default).

**Subsequent page load (Load more):** Button itself shows "Memuat..." with disabled state. Existing cards stay visible (no re-skeleton).

### 5.7 Error state (list query)

- Full-page error message
- Heading: "Gagal memuat foto"
- Subtext: error.message (Indonesian, translated by sonner if needed)
- "Coba lagi" button → refetch

---

## 6. Upload Modal

Opens via header "Upload" button. shadcn `Dialog` (full-screen on mobile, centered modal on desktop).

### 6.1 Layout

```
┌────────────────────────────────────────┐
│  Upload Foto                      [X]  │
│                                        │
│  ┌──────────────────────────────────┐  │
│  │   Drop files here or click       │  │
│  │   JPG, PNG, WebP (max 5MB each)  │  │
│  └──────────────────────────────────┘  │
│                                        │
│  File queue:                           │
│  ┌──────────────────────────────────┐  │
│  │ [thumb] IMG_1234.jpg             │  │
│  │ 2.3 MB                           │  │
│  │ Alt: [_______________]           │  │
│  │ [████████░░] 80%  [Remove]       │  │
│  └──────────────────────────────────┘  │
│  ┌──────────────────────────────────┐  │
│  │ [thumb] beach.png                │  │
│  │ 4.1 MB                           │  │
│  │ Alt: [_______________]           │  │
│  │ Pending                          │  │
│  └──────────────────────────────────┘  │
│                                        │
│            [Cancel]  [Upload all]      │
└────────────────────────────────────────┘
```

### 6.2 Drop zone

- Drag files anywhere in drop zone OR click to open file picker
- Accept: `image/jpeg, image/png, image/webp` (matches backend)
- Reject on drop: show toast "Tipe file tidak didukung: <ext>"
- Client-side size check: >5MB → toast "File terlalu besar (max 5MB)" + don't add to queue
- Added files appear in queue below

### 6.3 File queue item

Per file:
- **Thumbnail** (small preview from `URL.createObjectURL`)
- **Filename** (truncated)
- **fileSize** (formatted)
- **Alt input** (optional, free text)
- **Status:** `pending` | `uploading` (with progress bar) | `done` | `failed`
- **Remove button** (X) — only enabled in `pending` or `failed` states
- **Retry button** — only in `failed` state

**Failed state visual:** red border (gray-tinted red since no color, or use thicker border + warning icon) + error message below + Retry button.

### 6.4 Upload flow

- "Upload all" button enabled when ≥1 file in `pending` or `failed` state
- Click → process queue sequentially (one file at a time)
- Per file: PATCH alt (sent with multipart) → process → upload → POST `/api/images` with progress tracking
- On success per file: remove from queue, show success toast "Berhasil upload: <filename>", invalidate list query
- On failure per file: mark as `failed`, show error toast per file, continue with next
- After all done: close modal if all succeeded; keep open if any failed (admin can retry)

**Progress tracking:** Use raw XHR for progress events (Hono RPC = `fetch` wrapper, no XHR). Bypass `apiClient.api.images.$post` for upload mutation; use custom `xhrUpload()` fn with `xhr.upload.onprogress` + `AbortController` signal. Pattern lives in `frontend/src/features/image/lib/upload.ts`. **G3 resolved — see §11.**

**Abort ownership (G8):** `AbortController` is owned by `useUploadImage` hook via `useRef` (one per active upload). The hook passes `controller.signal` into `xhrUpload()`. On modal cancel (`Dialog.onOpenChange(false)` while any file `uploading`) OR hook unmount → `controller.abort()`. Wire via `useEffect` cleanup in the modal component. TanStack Query v5 will not auto-cancel an in-flight `fetch` here since we bypass it; the controller is the only abort path.

Example signature:
```ts
function xhrUpload(opts: {
  file: File
  alt?: string
  signal: AbortSignal
  onProgress: (pct: number) => void
}): Promise<Image>
```

Implementation:
- `xhr.open("POST", \`${process.env.NEXT_PUBLIC_API_URL}/api/images\`)`
- `xhr.withCredentials = true` (match `apiClient` cookie auth)
- `xhr.upload.onprogress` → `onProgress((loaded / total) * 100)`
- `signal.addEventListener("abort", () => xhr.abort())`
- Resolve on `xhr.status < 300`, reject on error/abort

### 6.5 Cancel behavior

- "Cancel" button: closes modal
- If uploads in progress: confirm "Upload sedang berjalan. Yakin batal?" → if yes, abort in-flight XHR + close
- If no uploads in progress: close immediately

### 6.6 Empty queue state (before any files added)

Just the drop zone + Cancel button. "Upload all" button hidden until ≥1 file queued.

---

## 7. Side Sheet (Edit)

Opens on image card click. shadcn `Sheet` (already installed per CODEBASE-DIRECTORY.md).

### 7.1 Sheet contents (minimal, S1)

```
┌─────────────────────────────────┐
│ Detail Foto              [X]   │
│                                 │
│ ┌─────────────────────────────┐ │
│ │                             │ │
│ │   [Full image preview]      │ │
│ │   (with blurhash placeholder)│ │
│ │                             │ │
│ └─────────────────────────────┘ │
│                                 │
│ Alt:                            │
│ [_____________________________] │
│ (editable, blur or Enter saves) │
│                                 │
│ URL:                            │
│ https://sultanat-explore-img... │
│ [Copy URL]                      │
│                                 │
│ ─────────────────────────────── │
│                                 │
│ [Hapus foto]                    │
└─────────────────────────────────┘
```

### 7.2 Behaviors

- **Image preview:** `next/image` with `width={800}`, `height={600}`, `placeholder="blur"`, `blurDataURL={blurhashToDataUrl(image.blurHash)}` — `next/image` requires a **Data URL** (`data:image/...`), not raw blurhash string. Helper `blurhashToDataUrl(hash: string | null, w = 32, h = 32): string` lives in `frontend/src/features/image/lib/blurhash.ts`, uses `blurhash` npm package's `decode()` to render to a 32x32 off-screen canvas, returns `canvas.toDataURL("image/png")`. Returns 1x1 transparent PNG fallback when `hash` is null (legacy images). See G2 (resolved).
- **Alt input:** PATCH on blur or Enter key. Show inline spinner during save. On success: invalidate detail query (refresh self) + list query (refresh card preview). On failure: revert input value + error toast.
- **Copy URL button:** Writes `image.url` to clipboard, shows toast "URL disalin".
- **Delete button:** Opens shadcn `AlertDialog` confirm: "Hapus foto ini? Tindakan tidak dapat dibatalkan." → DELETE request → on success: close sheet, invalidate list, toast "Foto dihapus". On FK constraint failure (image in use): toast error "Tidak dapat menghapus: foto sedang digunakan" + keep sheet open.

### 7.3 Sheet state in URL

- Open = `?selected=<imageId>` in URL
- Close = remove `?selected` param
- Browser back/forward navigates between selections naturally

---

## 8. ImagePicker Component (Single Mode — v1)

Reusable component for other forms (Destination, Attraction, etc.) to attach an image.

### 8.1 Component API

```ts
type ImagePickerSingleProps = {
  value: string | null  // current image ID
  onChange: (imageId: string | null) => void
  label?: string
  disabled?: boolean
}
```

Renders a trigger area that shows:
- **Empty state:** "Pilih foto" button + helper text "Belum ada foto dipilih"
- **Selected state:** Preview chip — thumbnail + alt + "Ganti" + "Hapus" buttons

### 8.2 Trigger flow

1. Click "Pilih foto" or "Ganti" → opens picker Dialog
2. Picker Dialog = same library page UI but stripped down:
   - Search input (same as library)
   - Sort dropdown (same as library, default newest)
   - Grid (same cards, same blurhash)
   - Load more
   - "Pilih" button on each card (replaces "open sheet" behavior)
3. Click "Pilih" on any card → calls `onChange(imageId)` → closes Dialog
4. Trigger area updates to show selected image chip

### 8.3 Picker Dialog vs Library Sheet

Picker Dialog uses the **same** library grid component but with different click handler:
- Library: click card → open sheet (edit)
- Picker: click "Pilih" button on card → select + close

**Implementation:** Library card accepts a `mode` prop: `"view" | "pick"`. Pick mode renders a "Pilih" button overlay on hover; view mode renders the click-to-open-sheet behavior.

### 8.4 File location

`frontend/src/features/image/components/image-picker-single.tsx`

Other features import via:
```ts
import { ImagePickerSingle } from "@/features/image"
```

Feature barrel (`features/image/index.ts`) exports `ImagePickerSingle`.

---

## 9. React Query Strategy

### 9.1 Queries

| Key | Type | Returns | Stale time |
|-----|------|---------|------------|
| `['images', { search, sort, order, cursor, limit }]` | `useInfiniteQuery` | `{ pages: Image[][], pageParams: (string \| null)[] }` | 30s |
| `['image', id]` | `useQuery` | `Image` | 30s |
| (Picker) `['images', filters]` | `useInfiniteQuery` (same as above) | shared cache | 30s |

**Shared cache:** Library page and ImagePicker Dialog use the same query key shape → same cache. Selecting an image in picker immediately updates library's view (and vice versa) on refetch.

### 9.2 Mutations

| Action | React Query mutation | On success |
|--------|---------------------|------------|
| Upload file | `useMutation` (XHR) | Invalidate `['images']` (any filter combo) |
| Update alt | `useMutation` (fetch) | Invalidate `['image', id]` + `['images']` |
| Delete image | `useMutation` (fetch) | Invalidate `['images']` (any filter combo) + close sheet |

**No optimistic updates.** Wait for server confirm. Simpler, no flicker, no race conditions across pages.

### 9.3 Invalidating list across filter combos

Pattern: use predicate in `invalidateQueries`:
```ts
queryClient.invalidateQueries({
  queryKey: ['images'],
  exact: false,  // matches all filter variations
})
```

This invalidates every list query regardless of current `search`/`sort`/`order` filter.

---

## 10. Mobile Responsive (N1)

**< 768px width:** Library page shows centered message:
- Lucide `Monitor` icon (large, gray)
- Heading: "Admin лучше на десктопе" → "Gunakan desktop"
- Subtext: "Halaman manajemen foto лучше dilihat di desktop. Silakan buka di perangkat dengan layar lebih besar." → "Halaman manajemen foto最佳 di desktop. Silakan buka di perangkat dengan layar lebih besar."

**Final copy (Bahasa Indonesia):**
- Heading: "Gunakan Desktop"
- Subtext: "Manajemen foto optimal di layar desktop. Silakan buka di perangkat dengan layar lebih besar."

Upload modal IS allowed on mobile (full-screen Dialog) — only the library page is desktop-gated. Sheet on mobile = full-screen too (shadcn default).

**No tablet breakpoint optimization.** Mobile admin is rare edge case for v1.

---

## 11. Grey Areas (Research Required Before Implementation)

These need separate research session (use `context7-cli` skill):

| # | Topic | Question to resolve |
|---|-------|---------------------|
| G1 | **next/image with external R2 domain** | Need `images.remotePatterns` config in `next.config.ts`? Or does it work with absolute URLs out of the box? |
| G2 | **blurhash as next/image placeholder** | Does next/image accept blurhash string directly via `blurDataURL`? Or do we need a base64-encoded version? Library: `plaiceholder`? |
| G3 | ~~**XHR upload progress with React Query + Hono RPC**~~ | **RESOLVED (prior):** Hono RPC = `fetch` wrapper, no XHR. Bypass RPC for upload mutation, use raw XHR with `upload.onprogress` + `AbortController` signal. See §6.4 for pattern. |
| G4 | **nuqs vs raw useSearchParams** | Use `nuqs` library for typed URL state? Or raw `useSearchParams` + `router.replace`? Tradeoffs: bundle size, type safety, Next.js App Router compatibility. |
| G5 | **Hono RPC client mutation typing** | How to type `useMutation` with Hono's typed `hc` client. Existing pattern in codebase? Check `frontend/src/lib/api-client.ts`. |
| G6 | **shadcn Dialog + AlertDialog install** | Confirm both not already in `components/ui/`. Add via `npx shadcn@latest add dialog alert-dialog`. |
| G7 | **Debounce library for search input** | `use-debounce` npm package or custom `setTimeout` hook? Bundle size vs. custom impl. |
| G8 | **In-flight XHR abort on modal cancel** | Pattern for aborting in-progress uploads when admin closes modal mid-upload. XHR's `AbortController` integration with React Query mutations. |

---

## 12. Out of Scope (v1)

Deferred to v2 or later:

- **Bulk operations:** Multi-select checkboxes, "Delete selected", "Edit alt for selected"
- **Multi-select picker (`<ImagePickerMultiple>`):** v1.1 — needed for gallery images (DestinationImage, AttractionImage, Trip gallery)
- **Sort by fileSize:** Backend param not added yet; client-side dropdown disabled
- **Filter by "Unused":** Requires backend `?unused=true` param (not in §3.2 delta)
- **Date range / file type filter**
- **Image replacement** (keep ID, swap R2 object)
- **Image cropping / editing**
- **Drag-to-reorder within gallery collections** (Destination gallery order, etc. — handled by per-feature form, not library)
- **Soft delete / trash / undo**
- **Usage display in sheet** (S1 = minimal)
- **Drag-drop files directly onto library grid** (drop only in upload modal drop zone)
- **Tablet/mobile admin layouts** (N1 = desktop-only)
- **Bulk upload optimization** (U2 = sequential only; v2 could parallelize with max 3 concurrent)
- **Tests** (project has no test infrastructure yet per CONVENTION.md)

---

## 13. Acceptance Criteria

### 13.1 Library page

- [ ] `/admin/dashboard/image` renders with achromatic design (no color, no gradients, pill buttons)
- [ ] Sidebar shows "Foto" entry under "Manajemen" group with Lucide `Image` icon
- [ ] Grid shows images with thumbnail (blurhash placeholder), alt (2-line clamp), fileSize, createdAt
- [ ] Search input filters via backend `?search=` (debounced 300ms)
- [ ] Sort dropdown switches between "Terbaru" / "Terlama" via backend `?sort=createdAt&order=...`
- [ ] "Load more" button loads next page, appends to grid, hides when no nextCursor
- [ ] URL state: `?search=`, `?sort=`, `?order=`, `?cursor=`, `?selected=` all work
- [ ] Empty state: shows "Belum ada foto" + upload CTA when zero images
- [ ] Empty state: shows "Tidak ada hasil" + clear button when search returns zero
- [ ] Loading state: skeleton grid on first load, "Memuat..." on Load more
- [ ] Error state: full-page error + retry button on list query failure
- [ ] Mobile (<768px): shows "Gunakan Desktop" message, no library UI

### 13.2 Upload modal

- [ ] "Upload" button in header opens Dialog
- [ ] Drop zone accepts jpg/png/webp via drag or click
- [ ] Files >5MB rejected with toast (no queue add)
- [ ] Unsupported file types rejected with toast
- [ ] File queue shows thumbnail, filename, size, alt input, status
- [ ] "Upload all" processes files sequentially
- [ ] Per-file progress bar during upload
- [ ] Per-file success toast on completion
- [ ] Failed files show error message + Retry button, other files continue
- [ ] Cancel during upload: confirm dialog, then abort XHR + close
- [ ] On all-success: modal auto-closes, list refreshes
- [ ] On partial failure: modal stays open, admin can retry

### 13.3 Side sheet (edit)

- [ ] Click image card → side sheet opens with that image
- [ ] Sheet URL: `?selected=<id>` updated, back button closes sheet
- [ ] Image preview uses blurhash placeholder
- [ ] Alt input edits inline, saves on blur/Enter with PATCH
- [ ] Copy URL button copies to clipboard with toast
- [ ] Delete button opens AlertDialog confirm
- [ ] Delete success: close sheet, list refreshes, toast shown
- [ ] Delete failure (FK constraint): error toast, sheet stays open
- [ ] Sheet on mobile: full-screen
- [ ] Sheet on desktop: side panel (right-side default)

### 13.4 ImagePicker (single mode)

- [ ] `<ImagePickerSingle>` renders "Pilih foto" trigger when value is null
- [ ] Renders preview chip (thumb + alt + "Ganti" + "Hapus") when value is set
- [ ] Click trigger → opens picker Dialog
- [ ] Picker Dialog shows same library UI (search, sort, grid, load more)
- [ ] Click "Pilih" on any card → `onChange(imageId)` fires, Dialog closes
- [ ] Selected image highlighted in picker grid (passes `value` to grid)
- [ ] "Hapus" on preview chip → `onChange(null)`
- [ ] Picker uses same React Query cache as library page (shared `['images']` key)

### 13.5 Backend delta

- [ ] `GET /api/images` accepts `?sort=createdAt&order=asc|desc&search=<string>` (in addition to existing `cursor` + `limit`)
- [ ] `?search=foo` filters results where `alt` starts with `foo` (case-insensitive)
- [ ] `?sort=createdAt&order=asc` returns oldest first
- [ ] `?sort=createdAt&order=desc` returns newest first (default behavior preserved)
- [ ] Invalid `sort` or `order` values → 400 from Zod validator
- [ ] Search and sort compose with existing `cursor` pagination

---

## 14. File Structure

```
frontend/src/
├── app/
│   └── admin/
│       └── dashboard/
│           └── image/
│               └── page.tsx          # Library page (RSC entry, hydrates client component)
│
├── features/
│   └── image/
│       ├── components/
│       │   ├── library-page.tsx      # Main client component (toolbar + grid + load more)
│       │   ├── library-toolbar.tsx   # Search + sort + upload button
│       │   ├── image-card.tsx        # Single card (thumb + alt + size + date)
│       │   ├── image-grid.tsx        # Grid container + empty/loading states
│       │   ├── upload-modal.tsx      # Dialog with drop zone + queue
│       │   ├── upload-queue-item.tsx # Per-file row with progress
│       │   ├── image-sheet.tsx       # Side sheet for edit/delete
│       │   ├── image-picker-single.tsx # Reusable picker (Dialog + grid)
│       │   └── use-image-picker-grid.ts # Hook: grid logic shared by library + picker
│       ├── hooks/
│       │   ├── use-image-list.ts     # useInfiniteQuery wrapper
│       │   ├── use-image-detail.ts   # useQuery wrapper
│       │   ├── use-upload-image.ts   # useMutation (XHR) wrapper
│       │   ├── use-update-alt.ts     # useMutation (fetch) wrapper
│       │   └── use-delete-image.ts   # useMutation (fetch) wrapper
│       ├── dto/
│       │   └── image.schema.ts       # Zod: search/sort query schema + upload form schema
│       ├── lib/
│       │   ├── upload.ts             # XHR upload w/ progress + abort
│       │   └── url-state.ts          # Sync filters to URL params (uses nuqs)
│       └── index.ts                  # Public barrel: exports ImagePickerSingle
│
└── components/
    └── sidebar/
        └── nav-main.tsx              # Add "Foto" entry to "Manajemen" group
```

---

## 15. Dependencies

**New (need install):**
- shadcn components: `dialog`, `alert-dialog` (if not already in `components/ui/`)
- `nuqs` (URL state management) — **pending G4 research**
- `use-debounce` (search input debounce) — **pending G7 research**

**Existing (no install):**
- `@tanstack/react-query` (already in `providers/query-provider.tsx`)
- `@tanstack/react-form` via `@/lib/form` (already in `lib/form.tsx`)
- `sonner` (already in `components/ui/sonner.tsx`)
- `lucide-react` (for icons: `Image`, `ImageOff`, `ImagePlus`, `Monitor`, `Search`, `ArrowUpDown`, `Upload`, `Trash2`, `Copy`, `X`)
- `next/image` (for thumbnails + preview)
- Hono RPC client via `@/lib/api-client` (existing)

---

## 16. Open Questions (None for v1)

All scope decisions resolved. Implementation can start after:
1. Backend delta (§3.2) implemented
2. Grey areas (§11) researched
