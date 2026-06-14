---
date: 2026-06-14
title: Article and Category Backend Module
---

- **Decision:** Add `Article` and `Category` Prisma models + new `article` and `category` backend modules. Articles move from hardcoded `frontend/src/features/articles/data.ts` to DB-backed API
- **Decision:** Author = `authorId` FK to existing `User` (no new Author model, no `role` field)
- **Decision:** Content stored as opaque `Json` column with `v.any()` validation — frontend owns block shapes
- **Decision:** Thumbnail = `imageId` FK to existing `Image` (mirror destination pattern)
- **Decision:** Slug auto-generated server-side from `title`/`name` via `toSlug`. 409 on collision. Re-derived on title/name update. Not in body schema
- **Decision:** Public article list hardcodes `published = true`. Admin has full filter via separate route
- **Decision:** `publishedAt` auto-set on `published` false→true transition (overwrites on each transition)
- **Decision:** Category delete uses `onDelete: SetNull` on Article.categoryId — articles survive, become uncategorized
- **Decision:** Related endpoint at `GET /articles/slug/:slug/related?limit=3` (under `slug/` namespace to avoid `/:id` route conflict)
- **Decision:** Drop `featured`, `readingTime`, `metaTitle`, `metaDescription`, author `role` from article model
- **Decision:** Two separate modules (`article` + `category`), each with public read + admin CRUD. No seed
- **Reason:** First content module that has a public + admin split. Mirrors destination module conventions exactly
