# Phase 1: Prisma Schema + Migration

## Goal

Rename both models in Prisma schema, reset migration, regenerate client.

## Execution Order

**Order matters.** Rename `Destination` → `City` first, then `Attraction` → `Destination`. This avoids name collision since the old `Destination` name is freed before the new `Destination` (from Attraction) takes it.

## Steps

### 1.1 Rename `Destination` → `City`

File: `backend/prisma/schema.prisma`

Changes:
- `model Destination` → `model City`
- `@@map("destinations")` → remove (or change to `@@map("cities")`) — since we're resetting migration, just use `cities` table name directly
- `model DestinationImage` → `model CityImage`
- Update all relations referencing `Destination` → `City`:
  - `Attraction.destination Destination @relation(...)` → `Attraction.destination City @relation(...)`
  - `DestinationImage.destination Destination @relation(...)` → `DestinationImage.city City @relation(...)`
  - `Image.destinationDestinations Image[]` → `Image.cityCities Image[]` (reverse relation, verify exact name)

### 1.2 Update FK field names

- `Attraction.destinationId` → `Attraction.cityId` (with `@map("city_id")`)
- `DestinationImage.destinationId` → `CityImage.cityId` (with `@map("city_id")`)

### 1.3 Rename `Attraction` → `Destination`

- `model Attraction` → `model Destination`
- `@@map("attractions")` → remove or change to `destinations`
- Update all relations referencing `Attraction` → `Destination`:
  - `City.attractions Attraction[]` → `City.destinations Destination[]` (verify relation field name)
  - `Image.attractionAttractions Image[]` → `Image.destinationDestinations Image[]` (reverse relation, verify exact name)

### 1.4 Rename `DestinationImage` → `CityImage`

Already done in 1.1. Verify all references updated.

### 1.5 Verify reverse relations on `Image` model

The `Image` model likely has typed FK reverse relations like:
```
destinationDestinations Destination[]  // hero image for destinations
attractionAttractions Attraction[]     // hero image for attractions
```
These need updating to:
```
cityCities City[]
destinationDestinations Destination[]
```

### 1.6 Reset migration + generate client

```bash
cd backend
rm -rf prisma/migrations
pnpm prisma migrate dev --name init
pnpm prisma generate
```

## Verification

- [ ] Schema has `City`, `CityImage`, `Destination` models (no `Destination`, `DestinationImage`, `Attraction`)
- [ ] All FK fields use new names (`cityId` not `destinationId`)
- [ ] All relations point to correct new model names
- [ ] `prisma generate` succeeds
- [ ] `pnpm typecheck` — expected to fail (backend/frontend refs still old), but Prisma types should be correct

## Notes

- If `pnpm typecheck` shows Prisma-generated type errors, the schema rename was incomplete.
- Save `pnpm typecheck` output for Phase 2 — those errors become the TODO list for backend module renames.
