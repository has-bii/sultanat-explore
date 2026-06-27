---
date: 2026-06-27
title: OpenTrip Form Ponytail Review Refactor
tags: [open-trip, form, refactor, ponytail]
---

- **Decision:** Inlined `CitySelectWithReset` into `CityEntry` — misleading name promised a "reset" that actually lived in the caller; the single-use wrapper was dead indirection.
- **Decision:** Extracted `InclusionColumn` to collapse the near-identical Include and Exclude blocks (~40 lines each) into one parametrized component used twice.
- **Decision:** Precompute `itemById = new Map(...)` once per InclusionColumn instead of rebuilding the per-entry `items` filter list on every render.
- **Decision:** Dropped the redundant `allInclusions` alias, use `inclusions` directly.
- **Decision:** Kept the `<form.AppForm>` wrapper around `SubmitButton` — verified `SubmitButton` calls `useFormContext()`, so the form provider context is required, not bloat.
- **Reason:** Ponytail-review sweep of `frontend/src/features/open-trip/components/form/index.tsx` flagged 5 over-engineering items; 4 confirmed, 1 (`AppForm`) refuted by reading the form library. Net −10 lines (123 del / 113 ins); typecheck + lint clean. Real win is behavior convergence: Include/Exclude now share one code path.