# PRD: Destination CRUD — Admin Frontend

**Status:** Not started  
**Last Updated:** June 2026  
**Scope:** Destination CRUD frontend only. Backend already complete.

> **Maintenance:** Update this PRD after each phase is executed. Mark deliverables as done, note deviations, adjust subsequent phases if needed.
>
> **Execution rule:** Follow project docs only. Do not explore existing codebase to infer patterns. All conventions, structures, and patterns are documented in the project docs listed below.

---

## 1. Overview

Implement admin frontend for managing Destinations. Backend CRUD + gallery endpoints already exist. This PRD covers the frontend: list page, create form, edit form with inline gallery management.

**Excluded:** Attraction CRUD, AttractionCategory CRUD (future phases).

---

## 2. Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Scope | Destination only | Attraction/Category deferred |
| List view | Table with thumb+name column | Dense + visual |
| Form layout | Single page | ~6 fields, no need for tabs |
| Gallery | Inline on edit page | One place for all destination editing |
| Image picker | New picker dialog querying Image feature queries | DRY, uses existing image data layer |
| Delete | Confirm dialog, edit page only | Safer, less accidental deletes |
| View page | None — edit = view | Admin CMS pattern |
| Pagination | Cursor + load more button | Table-friendly, backend already cursor-based |
| Highlights field | TanStack Form array mode | Native support, shadcn pattern |
| Hero image UI | Preview area, click to pick | Visual, intuitive |
| Loading state | Skeleton | Better perceived performance |

---

## 3. Routes

| Route | Page | Description |
|---|---|---|
| `/admin/dashboard/destination` | List | Table with search, featured filter, sort |
| `/admin/dashboard/destination/create` | Create | Single page form |
| `/admin/dashboard/destination/[id]/edit` | Edit | Single page form + inline gallery |

---

## 4. List Page

### Table Columns

| Column | Content |
|---|---|
| Nama | Thumbnail (40x40, rounded) + destination name stacked |
| Tagline | Truncated to ~50 chars |
| Featured | Badge "Unggulan" or empty |
| Atraksi | Count |
| Galeri | Count |
| Aksi | Edit button (link to `/[id]/edit`) |

### Filters Toolbar

- **Search input** — by name (prefix match, debounced)
- **Featured toggle** — All / Featured / Not featured (3-state or dropdown)
- **Sort dropdown** — Nama A-Z, Terbaru, Terlama

### Pagination

- Load more button at bottom
- Show "Menampilkan X dari Y" count
- Cursor-based (nextCursor from API)

### Empty State

- Illustration + "Belum ada destinasi" + "Buat Destinasi" button

---

## 5. Create Form

### Fields

| Field | Type | Validation | Notes |
|---|---|---|---|
| Nama | Text input | Required, max 100 | Auto-generates slug on backend |
| Tagline | Text input | Required, max 200 | |
| Deskripsi | Textarea | Required, max 5000 | Tall textarea, resizable |
| Gambar Hero | Image picker | Required | Preview area, click to open Image Library dialog |
| Unggulan | Toggle/Checkbox | Optional, default false | |
| Highlights | Array of text inputs | Max 20 items, each max 200 chars | TanStack Form array mode |

### Image Picker Behavior

- Empty state: dashed border placeholder box with "Pilih Gambar" text
- Selected state: image thumbnail preview + "Ganti" button + "Hapus" button
- Click opens Image Library picker dialog (new component that queries existing images)
- Dialog shows uploaded images with infinite scroll, select one, close dialog
- Uses `getImagesQueryOptions` from `features/image/queries/` for fetching images

### Submit

- Button: "Simpan"
- On success: toast + redirect to list page
- On error: toast error message
- Loading state: button disabled + spinner

### Cancel

- Button: "Batal" — link back to list page

---

## 6. Edit Form

### Data Loading

- Fetch destination by ID (queryOptions factory)
- Skeleton loading state while fetching
- 404 handling: redirect to list or show error

### Fields

Same as create form. Pre-populated with existing data.

### Additional Sections (edit only)

#### Gallery Management

Located below the main form fields, separated by divider.

**Current gallery:** Grid of thumbnails with order numbers. Drag to reorder (optional, can defer). Remove button on each image.

**Add images:** "Tambah Foto" button opens Image Library picker (multi-select). Selected images added to gallery via API.

**Remove:** X button on each gallery image. Confirm or direct remove.

**Reorder:** Drag-and-drop or up/down arrows. Save order via reorder API.

### Actions

- **Save** — update destination fields (PATCH)
- **Hapus Destinasi** — destructive, at bottom. Opens confirm dialog: "Hapus destinasi [name]? Semua atraksi dan galeri akan ikut terhapus." with Batal/Hapus buttons. On delete: toast + redirect to list.

---

## 7. Frontend Structure

```
frontend/src/features/destination/
├── dto/
│   └── destination.schema.ts          # Zod schemas + inferred types (mirror backend)
├── queries/
│   ├── get-destinations.query.ts      # infiniteQueryOptions for list
│   └── get-destination.query.ts       # queryOptions for single destination
├── mutations/
│   ├── create-destination.mutation.ts
│   ├── update-destination.mutation.ts
│   ├── delete-destination.mutation.ts
│   ├── add-gallery-image.mutation.ts
│   ├── remove-gallery-image.mutation.ts
│   └── reorder-gallery.mutation.ts
├── stores/
│   └── image-picker-dialog.store.ts   # Zustand store for image picker dialog state
├── hooks/
│   ├── use-destination-filters.ts     # URL params for search, featured, sort
│   └── use-destination-form.ts        # Form factory hook (create + edit)
├── components/
│   ├── destinations-table.tsx         # Table component
│   ├── destinations-filters.tsx       # Filter toolbar
│   ├── destination-form.tsx           # Shared form component (create + edit)
│   ├── destination-gallery.tsx        # Gallery management section
│   ├── image-picker-dialog.tsx        # Image Library picker dialog
│   ├── delete-destination-dialog.tsx  # Confirm delete dialog
│   └── destination-skeleton.tsx       # Skeleton loading for edit page
└── pages/
    ├── destinations-list.page.tsx     # List page client component
    ├── create-destination.page.tsx    # Create page client component
    └── edit-destination.page.tsx      # Edit page client component
```

### App Router Pages

```
frontend/src/app/admin/dashboard/destination/
├── page.tsx                    # List page (imports DestinationsListPage)
├── create/
│   └── page.tsx               # Create page (imports CreateDestinationPage)
└── [id]/
    └── edit/
        └── page.tsx           # Edit page (imports EditDestinationPage)
```

---

## 8. Phase Breakdown

### Phase 1: Foundation + List Page

**Goal:** Feature structure + working list page with table, filters, pagination.

**Deliverables:**
- [ ] `dto/destination.schema.ts` — Zod schemas mirroring backend
- [ ] `queries/get-destinations.query.ts` — infiniteQueryOptions factory
- [ ] `hooks/use-destination-filters.ts` — URL param hooks for search, featured, sort
- [ ] `stores/image-picker-dialog.store.ts` — zustand store (scaffold, used in Phase 2)
- [ ] `components/destinations-table.tsx` — table with columns
- [ ] `components/destinations-filters.tsx` — search + featured + sort toolbar
- [ ] `pages/destinations-list.page.tsx` — list page client component
- [ ] `app/admin/dashboard/destination/page.tsx` — updated with list page
- [ ] Empty state component
- [ ] Load more pagination

**Dependencies:** None. Backend already complete.

**Estimated scope:** ~6-8 files.

---

### Phase 2: Create Form

**Goal:** Working create form with all fields, image picker, highlights array.

**Deliverables:**
- [ ] `mutations/create-destination.mutation.ts` — mutation hook
- [ ] `components/image-picker-dialog.tsx` — Image Library as picker dialog
- [ ] `components/destination-form.tsx` — shared form (used by create + edit)
- [ ] `hooks/use-destination-form.ts` — form factory with TanStack Form
- [ ] `pages/create-destination.page.tsx` — create page
- [ ] `app/admin/dashboard/destination/create/page.tsx` — route page
- [ ] Highlights array field (TanStack Form array mode)
- [ ] Hero image preview + picker integration
- [ ] Submit → redirect to list with toast

**Dependencies:** Phase 1 (dto, queries structure).

**Estimated scope:** ~6-8 files.

---

### Phase 3: Edit Form + Gallery + Delete

**Goal:** Edit page with data loading, gallery management, delete action.

**Deliverables:**
- [ ] `queries/get-destination.query.ts` — queryOptions for single destination
- [ ] `mutations/update-destination.mutation.ts` — update mutation
- [ ] `mutations/delete-destination.mutation.ts` — delete mutation
- [ ] `mutations/add-gallery-image.mutation.ts` — add gallery image
- [ ] `mutations/remove-gallery-image.mutation.ts` — remove gallery image
- [ ] `mutations/reorder-gallery.mutation.ts` — reorder gallery
- [ ] `components/destination-gallery.tsx` — gallery section (grid + add/remove)
- [ ] `components/delete-destination-dialog.tsx` — confirm delete dialog
- [ ] `components/destination-skeleton.tsx` — skeleton loading
- [ ] `pages/edit-destination.page.tsx` — edit page
- [ ] `app/admin/dashboard/destination/[id]/edit/page.tsx` — route page
- [ ] Pre-populate form with existing data
- [ ] Inline gallery management (add, remove, reorder)
- [ ] Delete with confirm dialog → redirect to list

**Dependencies:** Phase 1 + Phase 2 (form component, image picker).

**Estimated scope:** ~10-12 files.

---

## 9. API Endpoints Used

All already implemented in backend.

| Method | Endpoint | Used in |
|---|---|---|
| GET | `/api/destinations` | List page (query) |
| GET | `/api/destinations/:id` | Edit page (load data) |
| POST | `/api/destinations` | Create form |
| PATCH | `/api/destinations/:id` | Edit form |
| DELETE | `/api/destinations/:id` | Edit page (delete) |
| POST | `/api/destinations/:id/gallery` | Gallery management |
| DELETE | `/api/destinations/:id/gallery/:imageId` | Gallery management |
| PUT | `/api/destinations/:id/gallery/reorder` | Gallery management |

---

## 10. Reference Docs

All patterns, conventions, and structures are defined in project docs. Read these before implementation — do not explore codebase.

| Doc | Path | Covers |
|---|---|---|
| Architecture | `.pi/project/ARCHITECTURE.md` | Stack, patterns, DB models, dependency map, key decisions |
| Convention | `.pi/project/CONVENTION.md` | File naming, component naming, styling rules, feature module structure, form convention, query factory, mutation convention, zustand store, API response format, backend module convention |
| Codebase Directory | `.pi/project/CODEBASE-DIRECTORY.md` | Full folder structure, import aliases, routing layout |
| Design System | `DESIGN.md` | Colors, typography, radius, shadows, component styling |

### Key conventions (from docs, not codebase)

- **Feature module structure** — `features/<name>/` with `dto/`, `queries/`, `mutations/`, `stores/`, `hooks/`, `components/`, `pages/`. See CONVENTION.md §Feature Module Structure.
- **DTO convention** — Schemas in `dto/<name>.schema.ts`, named `<Name>Schema`. Inferred types exported alongside. See CONVENTION.md §DTO convention.
- **Query factory** — `queryOptions` for single fetch, `infiniteQueryOptions` for cursor list. Place in `queries/`. Check `json.success`. Export query key const. See CONVENTION.md §Query Factory Convention.
- **Mutation convention** — Custom hooks in `mutations/`. Check `json.success`, throw on failure. Toast in onSuccess/onError. Invalidate in onSettled. See CONVENTION.md §Mutation Convention.
- **Zustand stores** — Transient UI state only (dialog open/close). Never server data. Place in `stores/`. See CONVENTION.md §Zustand Store Convention.
- **Form convention** — Use `useAppForm()` from `@/lib/form`. Zod validators via `validators: { onSubmit: schema }`. See CONVENTION.md §Form Convention.
- **API response** — All endpoints return `{ success, data, message }`. See CONVENTION.md §API Response Format.
- **Styling** — Tailwind only. Achromatic. Pill buttons. Typography utilities. See CONVENTION.md §Styling + DESIGN.md.
- **RSC by default** — Page files are Server Components. Add `"use client"` only when needed.
- **Language** — Bahasa Indonesia hardcoded. IDR currency. WhatsApp CTA.
- **Backend schemas** — Zod schemas in `backend/src/modules/destination/destination.schema.ts`. Frontend DTO should mirror these.
