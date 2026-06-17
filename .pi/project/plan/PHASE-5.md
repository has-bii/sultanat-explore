# Phase 5: Public Feature Internal Refs

## Goal

Update internal references in public-facing features to use new model/type names. Folder names and URL paths stay unchanged.

## Prerequisites

- [ ] Phase 4 complete (admin routes + sidebar updated)
- [ ] Backend types (City, Destination) available

## Steps

### 5.1 Update `features/destinations/` (public)

Folder stays as `features/destinations/`. Update internal refs:

Files to update:
- `types.ts` — update type imports from backend
  ```ts
  // Old
  import type { Destination, Attraction } from "backend/..."
  // New
  import type { City, Destination } from "backend/..."
  ```
- `data.ts` — update static data types if they reference old model names
- `components/about-section.tsx` — check for type refs
- `components/destinations-grid.tsx` — check for type refs
- `components/detail-hero.tsx` — check for type refs
- `components/featured-attractions.tsx` — check for type refs (component name stays, internal type changes)
- `components/featured-destinations.tsx` — check for type refs
- `components/gallery-section.tsx` — check for type refs
- `components/hero-section.tsx` — check for type refs
- `components/other-destinations.tsx` — check for type refs
- `components/related-trips.tsx` — check for type refs
- `components/why-turkey.tsx` — check for type refs
- `index.ts` — check for type exports

### 5.2 Update `features/homepage/`

Files to update:
- `components/destinations-section.tsx` — likely imports destination types/data
- `components/open-trip-section.tsx` — check for destination/attraction refs
- `components/private-trip-section.tsx` — check for destination/attraction refs
- `data.ts` — check for type refs

### 5.3 Update `features/about-us/`

Check if any components reference destination/attraction types.

### 5.4 Update `features/open-trip/`

Check `components/trip-card.tsx`, `components/trip-list.tsx` for destination/attraction refs.

### 5.5 Update `features/private-trip/`

Check components for destination/attraction refs.

### 5.6 Update `features/umrah/`

Check components for destination/attraction refs.

### 5.7 Update `features/contact/`

Likely no changes needed. Verify.

### 5.8 Update shared components

- `frontend/src/components/cta-section.tsx` — check for refs
- `frontend/src/components/hero-3.tsx` — check for refs
- `frontend/src/components/testimonials-columns-1.tsx` — check for refs

### 5.9 Update app route pages (public)

Route pages that import from public features:
- `frontend/src/app/(public)/page.tsx` — homepage
- `frontend/src/app/(public)/destinations/page.tsx` — destinations list
- `frontend/src/app/(public)/destinations/[slug]/page.tsx` — destination detail

These pages import from `features/destinations/` — verify type imports use new names.

## Verification

- [ ] `pnpm typecheck` passes
- [ ] Public pages render correctly (manual browser test)
- [ ] No TypeScript errors in public feature files
- [ ] All type imports use new model names (City, Destination instead of Destination, Attraction)

## Notes

- Public folder names (`features/destinations/`) stay unchanged — only internal type/import refs change.
- Component names like `featured-attractions.tsx` stay as-is (they describe the public concept, not the model).
- `grep -r "from.*backend.*Destination\|from.*backend.*Attraction" frontend/src/features/` to find type imports that need updating.
