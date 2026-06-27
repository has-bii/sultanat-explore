---
date: 2026-06-27
title: Inclusion & Exclusion Two-Column Layout
tags: [open-trip, form, ui]
---

- **Decision:** Split Inclusion & Exclusion into two columns (left = Include, right = Exclude) instead of single list with type selector.
- **Decision:** Filter select options to prevent duplicate selections (exclude already-used items).
- **Decision:** Disable select and "Tambah" button when all inclusion items are exhausted.
- **Decision:** Fetch inclusion items in `InclusionSection` wrapper and pass down — select field no longer fetches independently.
- **Decision:** Use `form.Subscribe` with `selector(state => state.values.inclusions)` to optimize re-renders — only inclusion section updates when values change.
