---
date: 2026-06-28
title: Open Trip Archive & Delete
tags: [frontend, backend, open-trip, archive, delete]
---

- **Decision:** Backend split open trip deletion into two operations — archive (PATCH, soft delete) and delete (DELETE, hard delete)
- **Decision:** Frontend implemented archive & delete UI on both list page (row action menu) and edit page (action buttons) with confirmation dialogs
- **Reason:** Archive provides a reversible soft-delete for hiding trips from public listing without data loss; delete is permanent for cleaning up test/draft data
