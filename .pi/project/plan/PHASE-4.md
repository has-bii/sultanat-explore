# Phase 4: Admin Routes + Sidebar

## Goal

Rename admin route folders and update sidebar navigation to match new model names.

## Prerequisites

- [ ] Phase 3 complete (frontend admin features renamed)
- [ ] `features/city/` and `features/destination/` exist with correct exports

## Steps

### 4.1 Rename admin route folders

```
frontend/src/app/admin/dashboard/destination/           → city/
  page.tsx                                                (update imports)
  create/
    page.tsx                                              (update imports)
  [id]/
    edit/
      page.tsx                                            (update imports)
  attraction/                                             → destination/
    page.tsx                                              (update imports)
    create/
      page.tsx                                            (update imports, if exists)
    [id]/
      edit/
        page.tsx                                          (update imports, if exists)
```

Result:
```
frontend/src/app/admin/dashboard/city/
  page.tsx
  create/page.tsx
  [id]/edit/page.tsx
  destination/
    page.tsx
    create/page.tsx (if exists)
    [id]/edit/page.tsx (if exists)
```

### 4.2 Update page imports in route files

Each `page.tsx` in the admin routes imports from features. Update:

```tsx
// Old
import { DestinationListPage } from "@/features/destination/pages/destination-list.page"
// New
import { CityListPage } from "@/features/city/pages/city-list.page"

// Old
import { AttractionListPage } from "@/features/attraction/pages/attraction-list.page"
// New
import { DestinationListPage } from "@/features/destination/pages/destination-list.page"
```

### 4.3 Update sidebar navigation

File: `frontend/src/components/sidebar/app-sidebar.tsx`

Update nav items:
- "Destinations" label → "Kota" (or "Cities")
- Link href: `/admin/dashboard/destination` → `/admin/dashboard/city`
- Icon: likely `MapPin` or similar — keep as-is

File: `frontend/src/components/sidebar/nav-dashboard.tsx`

If attraction has its own nav item:
- "Attractions" label → "Destinations"
- Link href: `/admin/dashboard/destination/attraction` → `/admin/dashboard/city/destination`

### 4.4 Update breadcrumb/header components

File: `frontend/src/components/header.tsx` or `frontend/src/components/main-page.tsx`

If breadcrumbs reference "Destination" or "Attraction", update labels.

### 4.5 Update admin loading.tsx if needed

File: `frontend/src/app/admin/loading.tsx` — likely no changes needed.

## Verification

- [ ] `/admin/dashboard/city/` route works (list page)
- [ ] `/admin/dashboard/city/create` route works
- [ ] `/admin/dashboard/city/[id]/edit` route works
- [ ] `/admin/dashboard/city/destination/` route works (attraction list)
- [ ] Sidebar links point to new routes
- [ ] Sidebar labels updated (Kota, Destinations)
- [ ] No broken imports in admin page files
- [ ] `pnpm typecheck` passes for admin route files

## Notes

- After this phase, admin dashboard should be fully functional with new names.
- Browser test: navigate all admin routes, verify no 404 or import errors.
