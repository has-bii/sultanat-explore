---
date: 2026-06-07
title: Destination Create Form — Phase 2 Complete
tags: [destination, crud, frontend, form]
---

- **Decision:** Destination CRUD Phase 2 (Create Form) implemented
- **Decision:** Added `TextareaField` to shared `@/lib/form` for reuse across features
- **Decision:** Zod schema uses `.boolean()` / `.array()` without `.default()` — defaults in form `defaultValues` to avoid StandardSchemaV1 type mismatch with TanStack Form
- **Decision:** `ImagePickerDialog` tracks selected image in local `useState`; form only stores `imageId` string
