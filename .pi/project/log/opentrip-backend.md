# OpenTrip Backend Module

**Date:** 2026-06-17
**Domain:** Backend

## Summary

Implemented OpenTrip + InclusionItem backend modules (route, service, schema). Prisma models already existed in schema.

## Files Created

### OpenTrip (`backend/src/modules/open-trip/`)
- `open-trip.schema.ts` — Valibot schemas: create (nested cities/destinations/inclusions), update, query (cursor pagination + filters: status, startAt range, price range, sort)
- `open-trip.service.ts` — Business logic: CRUD with nested writes, date range derivation, order auto-assign, publishedAt lifecycle, soft delete
- `open-trip.route.ts` — Hono routes: public GET (list + slug detail), admin GET/POST/PUT/DELETE

### InclusionItem (`backend/src/modules/inclusion-item/`)
- `inclusion-item.schema.ts` — Valibot schemas: create (label only, slug auto-generated), update, query (cursor pagination + search)
- `inclusion-item.service.ts` — CRUD: slug auto-generated from label via `toSlug()`, referential integrity check on delete (409 if referenced by OpenTripInclusion)
- `inclusion-item.route.ts` — Admin-only Hono routes: GET/POST/PUT/DELETE

## Modified

- `backend/src/app.ts` — registered `/open-trips` and `/inclusion-items` routes

## Key Business Rules

- **Order auto-derived**: cities sorted by `arriveAt`, destinations by `visitAt` → sequential index
- **Date range derivation**: `startAt = min(arriveAt)`, `endAt = max(departAt ?? lastCity.arriveAt)`, admin override allowed
- **publishedAt immutable**: auto-set on `draft→published`, preserved on republish
- **Soft delete**: `DELETE` → `status=archived`
- **Public visibility**: hard-filter `status=published AND publishedAt <= now()`, `status` param ignored
- **Referential integrity**: InclusionItem delete → 409 if referenced by any OpenTripInclusion
- **Nested full-replace**: PUT deletes old children, creates new (idempotent)
- **Duplicate inclusion check**: 400 if same `inclusionItemId` appears twice in payload
- **Slug**: OpenTrip slug admin-set with uniqueness check; InclusionItem slug auto-generated from label

## PRD Deviations

- PRD specified admin-set slug for InclusionItem → changed to auto-generated from label (user decision)
