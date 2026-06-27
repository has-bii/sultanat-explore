---
date: 2026-06-28
title: Unify Open Trip Create/Update Schema
tags: [open-trip, backend, frontend, schema, api-contract]
---

- **Decision:** Merged `createOpenTripSchema` and `updateOpenTripSchema` into one required-fields schema. `status`/`cities`/`inclusions` are now required on `createOpenTripSchema`; `updateOpenTripSchema` and the `UpdateOpenTripInput` type are deleted.
- **Decision:** PUT `/open-trips/:id` is now full-replace only — it validates against `createOpenTripSchema`. No partial body accepted. The only consumer (`useUpdateOpenTrip` from `edit-open-trip.page.tsx`) always sends a full body; partial-update capability was speculative and unbuilt (YAGNI).
- **Decision:** `updateOpenTrip` service signature changed from `UpdateOpenTripInput` to `CreateOpenTripInput`; optional-input guards collapsed into unconditional assignments; nested cities/inclusions full-replace is now unconditional.
- **Decision:** Removed the runtime `_key` augmentation from `useOpenTripForm` (and `OpenTripFormValues`/`OpenTripInclusionRow`/`nextKey`). Form value type now equals `CreateOpenTripInput` exactly, so the manual `v.safeParse` `onChange` wrapper is replaced with `validators: { onChange: createOpenTripSchema }` — matching every sibling form (`useArticleForm`, etc.).
- **Decision:** React keys in the open-trip form switched from `_key` to array index (`cityIndex`/`destIndex`/`inc._idx`). Safe because row components are path-driven controlled selects with no `useState`/free-text — value correctness is decoupled from DOM reuse. A `ponytail:` comment documents the revisit condition (a free-text field inside a reorderable row).
- **Reason:** Eliminates the only `_key`-tracking surface in the feature and the only form that couldn't pass its schema directly to TanStack Form's `validators.onChange`. Net ~−50 to −60 lines.