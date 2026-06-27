---
date: 2026-06-27
title: OpenTrip Form Stable Row Keys & Shared DateField
tags: [open-trip, frontend, form, refactor]
---

- **Decision:** Array rows in `OpenTripForm` (cities, destinations, inclusions) now carry a runtime `_key` used as the React `key`, backfilled at hook init and on every `pushValue`.
- **Decision:** Added a shared `DateField` to `src/lib/form.tsx` (registered in `baseFieldComponents`); replaced the three inline date blocks in `OpenTripForm` (`startAt`, `endAt`, `cities[].arriveAt`) and removed the local `formatDateForInput` helper.
- **Decision:** `InclusionEntry` row container unified with `DestinationEntry` (`bg-muted/50 … rounded-lg p-3`).
- **Decision:** Hook's `validators.onChange` switched from the raw valibot schema to `({ value }) => v.safeParse(schema, value).issues` because the augmented row types (`_key`) no longer match the schema input type.
- **Reason:** `key={index}` on reorderable/removeable arrays caused row state (selects, date inputs) to drift to the wrong row after remove/move — a real layout bug, not cosmetic. `_key` is stripped by valibot's default `v.object()` and by the explicit `onSubmit` clean step, so it never reaches the server. The `DateField` extraction removes ~40 duplicated lines and the bespoke parser; admin pages use plain shadcn (no DESIGN.md), so changes stay within sibling-feature form conventions.