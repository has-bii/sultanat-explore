---
date: 2026-06-14
title: Dialog Store Factory
tags: [zustand, refactor, pattern]
---

- **Decision:** Created `createDialogStore<TMeta>()` and `createToggleStore()` factories in `@/hooks/create-dialog-store.ts`. Replaced 4 hand-written zustand dialog/sheet stores with one-liner factory calls.
- **Decision:** `onOpen(meta: TMeta | null)` — accepts null to support "create mode" (no entity selected). E.g. `openAttractionDialog(null)` opens dialog for new attraction creation.
- **Decision:** Removed `setTimeout(300ms)` meta-clear behavior from `useImageDetailSheetStore`. `onClose` now sets `meta: null` immediately. Exit animations still work because `open: false` hides content.
- **Decision:** `useImageSelectionStore` left as-is (Set-based selection, not a dialog pattern).
- **Reason:** Establish one canonical dialog state API (`meta`, `onOpen`, `onClose`) across all features. Every new CRUD feature gets a dialog store in one line.