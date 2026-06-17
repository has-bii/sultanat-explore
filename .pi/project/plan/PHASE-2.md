# Phase 2: Backend Modules

## Goal

Rename backend modules to match new Prisma models. Update API endpoints, app.ts registration, shared lib refs.

## Prerequisites

- [ ] Phase 1 complete (Prisma schema renamed, client generated)
- [ ] `pnpm typecheck` output available as reference for broken refs

## Steps

### 2.1 Rename `modules/destination/` → `modules/city/`

```
backend/src/modules/destination/
  destination.route.ts  → city.route.ts
  destination.service.ts → city.service.ts
  destination.schema.ts → city.schema.ts
```

Rename all files. Update contents:
- Replace `Destination` with `City` in types, schema names, function names
- Replace `destination` with `city` in route paths, variable names
- Update Prisma calls: `prisma.destination` → `prisma.city`, `prisma.destinationImage` → `prisma.cityImage`
- Update slug utils if they reference destination

### 2.2 Rename `modules/attraction/` → `modules/destination/`

```
backend/src/modules/attraction/
  attraction.route.ts  → destination.route.ts
  attraction.service.ts → destination.service.ts
  attraction.schema.ts → destination.schema.ts
```

Rename all files. Update contents:
- Replace `Attraction` with `Destination` in types, schema names, function names
- Replace `attraction` with `destination` in route paths, variable names
- Update Prisma calls: `prisma.attraction` → `prisma.destination`
- Update FK refs: `destinationId` → `cityId` (where pointing to old Destination / new City)

### 2.3 Update `app.ts`

File: `backend/src/app.ts`

- Update module imports:
  ```ts
  import { destinationRoutes } from "./modules/destination/destination.route"
  // →
  import { cityRoutes } from "./modules/city/city.route"
  import { attractionRoutes } from "./modules/attraction/attraction.route"
  // →
  import { destinationRoutes } from "./modules/destination/destination.route"
  ```
- Update route registration:
  ```ts
  app.route("/api/destinations", destinationRoutes)
  // →
  app.route("/api/cities", cityRoutes)
  app.route("/api/attractions", attractionRoutes)
  // →
  app.route("/api/destinations", destinationRoutes)
  ```

### 2.4 Update `app.type.ts`

File: `backend/src/app.type.ts`

- If it imports/references `Destination` or `Attraction` types, update to new names.

### 2.5 Update shared libs

Files to check:
- `backend/src/lib/prisma-fragments.ts` — likely has select fragments for `destination` and `attraction` Prisma models
- `backend/src/lib/slug.ts` — if it has destination/attraction specific slug logic

Update model references from old to new names.

### 2.6 Update shared schemas

Files:
- `backend/src/schemas/param.schema.ts` — check for destination/attraction param schemas
- `backend/src/schemas/query.schema.ts` — check for related query schemas

### 2.7 Update middleware if needed

- `backend/src/middlewares/require-admin.ts` — likely no changes needed
- `backend/src/middlewares/require-auth.ts` — likely no changes needed

## Verification

- [ ] `pnpm typecheck` in backend passes (or significantly fewer errors)
- [ ] Backend-specific types (City, CityImage, Destination) import correctly
- [ ] API endpoints registered: `/api/cities/*`, `/api/destinations/*`
- [ ] No references to old model names (`Destination` as city, `Attraction`) in backend src

## Notes

- Use `pnpm typecheck` output from Phase 1 as guide — each error points to a file that needs updating.
- Run `grep -r "Destination\|Attraction" backend/src/` after changes to find stragglers (exclude node_modules/generated).
