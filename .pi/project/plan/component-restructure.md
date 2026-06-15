# PRD: Component Restructure — Drop Prefixes, Group by Concern

## Problem

Feature `components/` folders are flat, redundantly prefixed, and inconsistent:

1. **Redundant prefix** — `features/destination/components/destination-form.tsx` repeats `destination-` when the path already provides context
2. **No grouping** — 7–11 flat files per feature with no subfolder structure
3. **Skeletons scattered** — some in separate files, some inline in pages, some mixed in `index.tsx`
4. **Thin wrapper skeletons** — files that are just `<TableSkeleton rows={5} cols={N} />`, 3 lines each
5. **Dead code** — `destination-skeleton.tsx` unused
6. **Store in component** — `category-dialog.tsx` defines store inline
7. **Gallery skeleton in live component** — `DestinationGallerySkeleton` lives in `gallery/index.tsx`

## Convention

### Folder structure per feature
```
features/<name>/components/
  <concern>/
    index.tsx          ← main component (always)
    skeleton.tsx       ← ONLY if substantial custom skeleton (layout-aware)
    <sub>.tsx          ← supporting pieces (row, view, card, etc.)
  <singular>.tsx       ← only if truly a standalone single file (rare)
  <page>-skeleton.tsx  ← page-level Suspense fallback (edit, create)
```

### Skeleton rules
- **Thin wrapper** (`<TableSkeleton rows={5} cols={N} />`) → **inline at call site**, no separate file
- **Custom skeleton** (form layout, header, gallery grid) → `<concern>/skeleton.tsx`
- **Page-level skeleton** (edit page with header + form) → `components/edit-skeleton.tsx`

### Naming rules
- **Drop feature prefix** inside `features/<name>/components/` — path provides context
- **Subfolder name** = concern noun: `form/`, `table/`, `dialog/`, `filter/`, `gallery/`, `grid/`, `detail-sheet/`, `upload-dialog/`
- **Export names stay PascalCase prefixed** — `DestinationForm`, `DestinationTable` (PascalCase stays)
- **File names lose prefix** — `form/index.tsx` not `destination-form.tsx`

### Store rule
- **Always separate file** in `stores/` — never define stores inside component files

---

## Execution Plan

### Phase 1: Destination

**Delete:**
- `components/destination-skeleton.tsx` (unused spinner)
- `components/destination-table-skeleton.tsx` (thin wrapper → inline)

**Move/Rename:**
| From | To |
|---|---|
| `components/destination-form.tsx` | `components/form/index.tsx` |
| `components/destination-filters.tsx` | `components/filter/index.tsx` |
| `components/destination-table.tsx` | `components/table/index.tsx` |
| `components/destination-table-row.tsx` | `components/table/row.tsx` |
| `components/delete-destination-dialog.tsx` | `components/dialog/delete.tsx` |
| `components/destination-gallery/index.tsx` (extract `DestinationGallerySkeleton`) | `components/gallery/index.tsx` (live component only) |
| `components/destination-gallery/gallery-view.tsx` | `components/gallery/gallery-view.tsx` |
| `components/destination-gallery/image-card.tsx` | `components/gallery/image-card.tsx` |
| `components/destination-gallery/draggable-item.tsx` | `components/gallery/draggable-item.tsx` |

**Create:**
- `components/gallery/skeleton.tsx` — extract `DestinationGallerySkeleton` from `gallery/index.tsx`
- `components/edit-skeleton.tsx` — extract `HeaderSkeleton` + `DetailFormSkeleton` from `pages/edit-destination.page.tsx`

**Inline (replaces thin wrapper files):**
- In `pages/destination-list.page.tsx`: replace `import { DestinationTableSkeleton }` → `<Suspense fallback={<TableSkeleton rowCount={5} columns={6} />}>`
- In `pages/edit-destination.page.tsx`: replace `import { DestinationTableSkeleton }` attraction ref → inline `<TableSkeleton>`

**Update all imports** across:
- `pages/destination-list.page.tsx`
- `pages/edit-destination.page.tsx`
- `pages/create-destination.page.tsx`
- Any cross-feature imports (attraction references in edit page)

---

### Phase 2: Article

**Delete:**
- `components/article-table-skeleton.tsx` (thin wrapper → inline)

**Move/Rename:**
| From | To |
|---|---|
| `components/article-form.tsx` | `components/form/index.tsx` |
| `components/article-table.tsx` | `components/table/index.tsx` |
| `components/article-table-row.tsx` | `components/table/row.tsx` |
| `components/article-filters.tsx` | `components/filter/index.tsx` |
| `components/delete-article-dialog.tsx` | `components/dialog/delete.tsx` |
| `components/edit-article-page-skeleton.tsx` | `components/edit-skeleton.tsx` |

**Inline:**
- In `pages/article-list.page.tsx`: `<TableSkeleton rowCount={5} columns={5} />`

**Update imports** in all article pages.

---

### Phase 3: Category

**Delete:**
- `components/category-table-skeleton.tsx` (thin wrapper → inline)

**Move/Rename:**
| From | To |
|---|---|
| `components/category-dialog.tsx` | `components/dialog/index.tsx` |
| `components/category-table.tsx` | `components/table/index.tsx` |
| `components/delete-category-dialog.tsx` | `components/dialog/delete.tsx` |

**Extract:**
- `useCategoryDialogStore` from `components/dialog/index.tsx` → `stores/category-dialog.store.ts`

**Inline:**
- In `pages/category-list.page.tsx`: `<TableSkeleton rowCount={5} columns={4} />`

**Update imports** in all category pages + cross-feature references (article form references category dialog).

---

### Phase 4: Attraction

**Delete:**
- `components/attraction-table-skeleton.tsx` (thin wrapper → inline)
- `components/attraction-list-table-skeleton.tsx` (thin wrapper → inline)

**Move/Rename:**
| From | To |
|---|---|
| `components/attraction-form.tsx` | `components/form/index.tsx` |
| `components/attraction-form-skeleton.tsx` | `components/form/skeleton.tsx` |
| `components/attraction-table.tsx` | `components/table/index.tsx` |
| `components/attraction-table-row.tsx` | `components/table/row.tsx` |
| `components/attraction-list-table.tsx` | `components/list-table/index.tsx` |
| `components/attraction-filters.tsx` | `components/filter/index.tsx` |
| `components/attraction-list-filters.tsx` | `components/list-filter/index.tsx` |
| `components/attraction-dialog.tsx` | `components/dialog/index.tsx` |
| `components/delete-attraction-dialog.tsx` | `components/dialog/delete.tsx` |

**Inline:**
- In `pages/attraction-list.page.tsx`: `<TableSkeleton rowCount={5} columns={2} />` (for list-table)
- In `pages/edit-destination.page.tsx`: `<TableSkeleton rowCount={5} columns={2} />` (for attraction table)

**Update imports** across all attraction pages + destination edit page.

---

### Phase 5: Image

**Delete:**
- `components/image-grid-skeleton.tsx` → move to `components/grid/skeleton.tsx`

**Move/Rename:**
| From | To |
|---|---|
| `components/image-grid.tsx` | `components/grid/index.tsx` |
| `components/image-grid-skeleton.tsx` | `components/grid/skeleton.tsx` |
| `components/image-grid-with-filters.tsx` | `components/grid/with-filters.tsx` |
| `components/image-detail-sheet/index.tsx` | `components/detail-sheet/index.tsx` (keep) |
| `components/image-detail-sheet/image-update-form.tsx` | `components/detail-sheet/update-form.tsx` |
| `components/image-detail-sheet/image-update-form-skeleton.tsx` | `components/detail-sheet/update-form-skeleton.tsx` |
| `components/upload-images-dialog/index.tsx` | `components/upload-dialog/index.tsx` |
| `components/upload-images-dialog/dnd-images.tsx` | `components/upload-dialog/dnd-images.tsx` |
| `components/upload-images-dialog/file-list.tsx` | `components/upload-dialog/file-list.tsx` |
| `components/upload-images-dialog/file-list-item.tsx` | `components/upload-dialog/file-list-item.tsx` |
| `components/bulk-delete-dialog.tsx` | `components/bulk-delete-dialog.tsx` (flat OK) |
| `components/image-delete-dialog.tsx` | `components/delete-dialog.tsx` |
| `components/image-picker-dialog.tsx` | `components/picker-dialog.tsx` |
| `components/multi-image-picker-dialog.tsx` | `components/multi-picker-dialog.tsx` |
| `components/filters-toolbar.tsx` | `components/filters-toolbar.tsx` (flat OK) |
| `components/image-card.tsx` | `components/image-card.tsx` (flat OK) |
| `components/selection-bar.tsx` | `components/selection-bar.tsx` (flat OK) |

**Update imports** in `pages/images.page.tsx` + cross-feature references (destination gallery, article form, etc.).

---

### Phase 6: Cleanup

1. **Delete empty old folders** — `components/destination-gallery/`, `components/image-detail-sheet/`, `components/upload-images-dialog/`
2. **Update FRONTEND.md** — add the new convention to the "Feature Module Structure" and "Suspense Components" sections
3. **Update CODEBASE-DIRECTORY.md** — run `/sync-directory`
4. **Run `pnpm typecheck`** — verify all imports resolve
5. **Run `pnpm lint`** — verify no unused imports

---

## Import Migration Cheat Sheet

Pattern for every file:

```ts
// Before
import { DestinationForm } from "@/features/destination/components/destination-form"
import { DestinationTableSkeleton } from "@/features/destination/components/destination-table-skeleton"

// After
import { DestinationForm } from "@/features/destination/components/form"
import { TableSkeleton } from "@/components/table-skeleton"
// ↑ thin skeleton inlined at call site, no separate import
```

## Risk & Mitigation

| Risk | Mitigation |
|---|---|
| Breaking imports across features | Global find-replace per feature, `pnpm typecheck` after each phase |
| Cross-feature imports (attraction in destination edit) | Search for `@/features/attraction/components` references in destination, update before testing |
| Store extraction (category dialog) | Move store first, export from `stores/`, update dialog import, then typecheck |
| Barrel exports | No `index.ts` barrel files at `components/` level — direct subfolder imports only |