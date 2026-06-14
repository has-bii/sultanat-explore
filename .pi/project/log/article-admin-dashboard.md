---
date: 2026-06-14
title: Article Admin Dashboard
tags: [frontend, admin, article, category, tiptap]
---

- **Decision:** Remove `date` field from Article model — redundant with `createdAt`, `updatedAt`, `publishedAt`
- **Decision:** Server-side `authorId` injection from auth session — client no longer sends it
- **Decision:** Add `published` filter to article query schema for admin list (all/published/draft)
- **Decision:** TipTap (WYSIWYG) for article content editor — stores JSON, render HTML later with `@tiptap/html`
- **Decision:** Separate `features/article/` for admin CRUD — existing `features/articles/` untouched (public static)
- **Decision:** Category dialog (inline) for create/edit — single name field, full page overkill
- **Decision:** Sidebar: new "Artikel" top-level item with Overview + Kategori sub-items
