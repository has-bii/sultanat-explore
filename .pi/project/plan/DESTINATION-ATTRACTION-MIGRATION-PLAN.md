# Destination → City & Attraction → Destination Migration Plan

## Overview

Full-stack rename of two domain models. Execution split into 6 phases, each in a separate session to minimize token cost.

**Renames:**
- `Destination` → `City` (city/region entity)
- `Attraction` → `Destination` (landmark/activity entity)

**Scope:** Backend + Admin dashboard only. Public paths (`/destinations/*`, `/destinations/[slug]`) unchanged. Public feature folder names unchanged.

**Approach:** Layer by layer (Prisma → Backend → Frontend admin → Admin routes → Public refs → Verify). Each phase touches both renames at that layer.

## Key Decisions

| Decision | Choice |
|---|---|
| Migration strategy | Reset migration (dev stage) |
| DB table mapping | Direct rename, no `@@map` |
| FK naming | `destinationId` → `cityId` (new Destination → City) |
| API endpoints | `/api/destinations/*` → `/api/cities/*`, `/api/attractions/*` → `/api/destinations/*` |
| Public paths | Unchanged |
| Public feature folders | Unchanged (internal refs updated) |
| Admin feature folders | Renamed (`destination/` → `city/`, `attraction/` → `destination/`) |

## Phase Breakdown

| Phase | Layer | Doc |
|---|---|---|
| 1 | Prisma schema + migration | [PHASE-1.md](PHASE-1.md) |
| 2 | Backend modules | [PHASE-2.md](PHASE-2.md) |
| 3 | Frontend admin features | [PHASE-3.md](PHASE-3.md) |
| 4 | Admin routes + sidebar | [PHASE-4.md](PHASE-4.md) |
| 5 | Public feature internal refs | [PHASE-5.md](PHASE-5.md) |
| 6 | Verify + fix stragglers | [PHASE-6.md](PHASE-6.md) |

## Checklist

- [x] Phase 1: Prisma schema renamed, migration reset, client generated
- [x] Phase 2: Backend modules renamed, API endpoints updated, app.ts updated
- [x] Phase 3: Frontend admin features renamed, all internal refs updated
- [x] Phase 4: Admin route folders renamed, sidebar nav updated, page imports fixed
- [ ] Phase 5: Public features internal refs updated (API calls, types, shared components)
- [ ] Phase 6: `pnpm typecheck` passes, manual verification

## Naming Map

### Model/Table

| Old | New | DB Table (old → new) |
|---|---|---|
| `Destination` | `City` | `destinations` → `cities` |
| `DestinationImage` | `CityImage` | `destination_images` → `city_images` |
| `Attraction` | `Destination` | `attractions` → `destinations` |

### Fields

| Old Field | New Field | On Model |
|---|---|---|
| `destinationId` | `cityId` | `Destination` (was Attraction) |
| `DestinationImage.destinationId` | `CityImage.cityId` | `CityImage` |

### Backend Modules

| Old Path | New Path |
|---|---|
| `backend/src/modules/destination/` | `backend/src/modules/city/` |
| `backend/src/modules/attraction/` | `backend/src/modules/destination/` |

### API Endpoints

| Old Endpoint | New Endpoint |
|---|---|
| `GET/POST /api/destinations` | `GET/POST /api/cities` |
| `PATCH/DELETE /api/destinations/:id` | `PATCH/DELETE /api/cities/:id` |
| `PUT /api/destinations/:id/gallery` | `PUT /api/cities/:id/gallery` |
| `GET/POST /api/attractions` | `GET/POST /api/destinations` |
| `PATCH/DELETE /api/attractions/:id` | `PATCH/DELETE /api/destinations/:id` |

### Frontend Features (Admin)

| Old Path | New Path |
|---|---|
| `features/destination/` | `features/city/` |
| `features/attraction/` | `features/destination/` |

### Admin Routes

| Old Route | New Route |
|---|---|
| `/admin/dashboard/destination/` | `/admin/dashboard/city/` |
| `/admin/dashboard/destination/attraction/` | `/admin/dashboard/city/destination/` |
