---
date: 2026-06-17
title: Table Conventions
tags: [frontend, convention, table]
---

- **Decision:** Create `frontend/TABLE.md` governing admin CRUD list tables.
- **Decision:** Admin table component lives at `features/<name>/components/table/index.tsx`; row always split to `features/<name>/components/table/row.tsx`.
- **Decision:** Table is a Suspense component consuming query options from `features/<name>/queries/`, wrapped in `<Suspense>` on the client coordinator list page.
- **Decision:** Loading handled by shared `<TableSkeleton />` fallback; empty state uses `<Empty />`; errors bubble to route-level `error.tsx`.
- **Decision:** Row owns row-level actions and triggers dialog stores; delete/edit dialogs rendered once on the page.
- **Decision:** Sorting lives in filter toolbar, not table headers. Cursor pagination uses a "Muat lebih banyak" button below the table wrapper.
- **Decision:** Row selection / bulk actions are opt-in via a dedicated selection store.
