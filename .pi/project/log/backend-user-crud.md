---
date: 2026-06-17
title: Backend User CRUD
tags: [backend, auth, users, admin, prisma]
---

- **Decision:** Add admin-only user management API at `/api/users`.
- **Decision:** Public registration stays disabled; only admins create/list/view/update-role/delete users.
- **Decision:** `UserRole` enum with `admin` and `author`; existing users default to `admin`.
- **Decision:** `Article.authorId` becomes optional with `onDelete: SetNull` so deleting a user does not cascade-delete articles.
- **Decision:** Admins supply initial password on create; created users get `emailVerified: true`.
- **Decision:** Block self-delete and deletion of the last admin.
- **Reason:** Need a way to manage admin/author accounts without exposing public sign-up.
