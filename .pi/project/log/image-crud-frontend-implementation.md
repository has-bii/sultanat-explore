---
date: 2026-06-05
tags: [image, frontend, admin, crud]
---

- **Decision:** Implement full Image CRUD frontend per `image-crud-frontend-prd.md`
- **Decision:** Add backend delta — `sort`, `order`, `search` query params to `GET /api/images`
- **Decision:** Use `nuqs` for URL state management (search/sort/order/selected/cursor)
- **Decision:** Use `defaultValue` for search input (React Compiler safe) instead of controlled + useEffect sync
- **Reason:** React Compiler flags `setState` in effects and ref access during render — avoided both patterns

## Files created/modified

**Backend:**
- `schemas/query.schema.ts` — new `imageQuerySchema` with sort/order/search
- `modules/image/image.service.ts` — `listImages` accepts full query params, applies `startsWith` filter
- `modules/image/image.route.ts` — uses `imageQuerySchema`

**Frontend:**
- Installed: `nuqs`, `blurhash`, shadcn `dialog`, `alert-dialog`, `select`
- `next.config.ts` — added R2 domain to `remotePatterns`
- `providers/root.tsx` — wrapped with `NuqsAdapter`
- `components/sidebar/app-sidebar.tsx` — added "Foto" nav entry
- `features/image/` — 18 files: DTO, 3 libs, 5 hooks, 8 components, barrel, page
- `app/admin/dashboard/image/page.tsx` — RSC entry
