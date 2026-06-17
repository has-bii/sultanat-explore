---
date: 2026-06-17
title: Category Delete Dialog — Store Refactor
tags: [frontend, refactor, pattern]
---

- **Decision:** Refactored `DeleteCategoryDialog` from prop-based (`useState`) to store-based pattern, using `useDeleteCategoryDialogStore`.
- **Decision:** Moved trigger button (with `Trash2` icon) into the table component, dialog opened via store, consistent with existing `useCategoryDialogStore` pattern.
- **Reason:** Eliminates prop drilling, aligns with existing store-first pattern for dialogs in the category feature, decouples trigger from dialog.
