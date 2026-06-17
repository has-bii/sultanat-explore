---
date: 2026-06-17
title: Admin User CRUD Frontend
tags: [frontend, admin, user-management]
---

- **Decision:** Implement frontend admin CRUD for user management (components, mutations, queries, hooks, pages, stores)
- **Decision:** Add role-gated NavAdmin sidebar component wired into AppSidebar
- **Decision:** Invalidate auth query on logout so UI state refreshes immediately
- **Reason:** Admin needs to manage users (create, edit, delete, change roles) from dashboard
