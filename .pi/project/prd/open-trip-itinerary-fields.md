# PRD — OpenTrip Itinerary Fields Alignment (Frontend)

**Status:** Draft · **Date:** 2026-06-27 · **Owner:** Frontend
**Tracking:** Backend change logged at [open-trip-model-simplification.md](../log/open-trip-model-simplification.md)

## Background

The backend `OpenTrip` data model was simplified (dev migrations applied). The OpenTrip feature in `frontend/src/features/open-trip/` consumes the Hono RPC client and is now **broken**: `pnpm --filter frontend typecheck` fails in `components/form/index.tsx`, `hooks/use-open-trip-form.ts`, and `pages/edit-open-trip.page.tsx` because they still reference fields that no longer exist.

### Model delta (what changed)

| Model | Removed | Added / Kept |
|---|---|---|
| `OpenTripCity` | `departAt`, `order`, `@@unique([openTripId, order])` | — |
| `OpenTripDestination` | `visitAt` | `order: Int` (required), `@@unique([openTripCityId, order])` restored |

- **City stop** = `cityId` + `arriveAt` only. Order of cities is implied chronologically by `arriveAt`.
- **Destination within a city** = `destinationId` + `order` (integer, unique per city). No visit timestamp.

## Scope

Align the admin OpenTrip form (create + edit) and the edit-page mapping to the new backend types. No public-page changes in this pass — trip-card / trip-list display none of the removed fields today.

### In scope
- `frontend/src/features/open-trip/components/form/index.tsx` — `CityEntry` and `DestinationEntry` subcomponents.
- `frontend/src/features/open-trip/hooks/use-open-trip-form.ts` — default values + submit-time cleaning.
- `frontend/src/features/open-trip/pages/edit-open-trip.page.tsx` — record → form mapping.

### Out of scope
- Public OpenTrip list/detail pages (no `departAt`/`visitAt` usage to fix).
- Backend (already aligned, typechecks clean).

## Requirements

### R1 — City stop: remove departure picker
- Remove the `form.Field name="cities[${cityIndex}].departAt"` block (the "Tanggal Berangkat" datetime input + its "Opsional" description) from `components/form/index.tsx`.
- Remove `departAt` from the `citiesField.pushValue({...})` default object (the "Tambah Kota" button).
- Remove the `departAt: city.departAt || undefined` spread from the submit-time `cleaned` object in `use-open-trip-form.ts`.
- Remove the `departAt` line from the `cities.map(...)` mapper in `pages/edit-open-trip.page.tsx`.
- City ordering must remain surfaced to the operator: cities are ordered by `arriveAt`. Form keeps the existing "Tanggal Tiba" (`arriveAt`) picker per city; no manual order index for cities.

### R2 — Destination within a city: replace visit time with order
- The destination block currently renders a "Waktu Kunjungan" (`visitAt`) datetime picker. It must instead express **order** (integer, unique within the city's destination list).
- **Recommended approach — drag-to-reorder (option R2-b).** Use `@dnd-kit` (already a dependency for gallery management) to reorder destination rows within a city; `order` is derived from array index, so no manual number input is shown. This matches the existing `MultiImagePickerDialog` reorder pattern and the `DestinationImage.order` gallery convention.
  - On any add/remove/reorder, reindex `cities[i].destinations[j].order = j` before submit.
  - Fallback (option R2-a, only if dnd is rejected): a plain numeric "Urutan" input per destination, validated non-negative integer, unique within the city. Cheaper to build but worse UX and easy to leave duplicate gaps.
- Update `pushValue` default for "Tambah Destinasi": `{ destinationId: "", order: 0 }` (order filled by reindex logic / array length).
- Update `pages/edit-open-trip.page.tsx` mapper: `destinations: city.destinations.map((dest, i) => ({ destinationId: dest.destinationId, order: i }))`. (Backend already returns destinations `orderBy: order asc`, so array index == stored order.)

### R3 — Submit shape matches new types
- `cleaned.cities` must map to `{ cityId, arriveAt, destinations: { destinationId, order }[] }` — no `departAt`, no `visitAt`.
- Verify both `create-open-trip.mutation.ts` and `update-open-trip.mutation.ts` need no changes (they pass `value` through to the Hono RPC client; type errors there will resolve once the payload shape is fixed upstream).

## Acceptance Criteria

1. `pnpm --filter frontend typecheck` passes with zero errors.
2. `pnpm --filter frontend build` succeeds.
3. Create Open Trip: can add cities (each with `arriveAt` only), add destinations, reorder them, submit → 201 with trip created and destinations stored with correct `order`.
4. Edit Open Trip: existing record loads, cities show `arriveAt` (no departure field), destinations show in `order` and can be reordered; save persists new order.
5. Submitting two destinations with equal `order` in the same city is prevented client-side (form validation) — backend `validateCities` is the safety net, but the form should not allow it.
6. No `departAt` / `visitAt` string literals remain in `frontend/src/features/open-trip/` (`grep -rn "departAt\|visitAt" frontend/src/features/open-trip/` returns empty).

## Open Decisions

- **R2-a vs R2-b:** numeric input vs drag-to-reorder for destination order. Recommendation is R2-b (dnd-kit). **Needs product sign-off before implementation.**
- Whether to show a read-only "Urutan" badge next to each destination row so the operator sees the resulting index (cheap, helps UX in either option).

## Technical Notes

- Dependencies: `@dnd-kit/core` + `@dnd-kit/sortable` already installed (gallery feature). No new packages.
- Schema is source of truth: `backend/src/modules/open-trip/open-trip.schema.ts` `createOpenTripSchema` / `updateOpenTripSchema` expose `cities[].arriveAt` (no `departAt`) and `cities[].destinations[].order` (no `visitAt`). Form should type against the inferred schema types, not hand-rolled shapes.
- `CreateOpenTripInput` / inferred output are imported from the backend module — rely on them, do not duplicate field lists in the frontend.