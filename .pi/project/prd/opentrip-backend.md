# PRD: OpenTrip Model (Backend)

**Audience:** Backend developer
**Scope:** Backend only (Prisma schema + API endpoints + business rules)
**Status:** Ready for implementation

---

## 1. Overview

Travel agency website. Admin CRUD OpenTrip (open/scheduled departure trip). Public can browse published trips. Each OpenTrip = satu keberangkatan konkret dengan timeline itinerary hierarkis: trip → cities → destinations. Plus include/exclude list reusable dari shared catalog.

OpenTrip = product object (bukan inventory). Seats + Booking defer ke slice terpisah.

---

## 2. Data Model

### 2.1 Enums

```prisma
enum OpenTripStatus {
  draft
  published
  archived

  @@map("open_trip_status")
}

enum InclusionType {
  include
  exclude

  @@map("inclusion_type")
}
```

### 2.2 OpenTrip

Concrete departure. Singular timeline. Product object.

```prisma
model OpenTrip {
  id            String          @id @db.Uuid @default(uuid(7))
  slug          String          @unique
  title         String
  excerpt       String          // short, ≤300 chars (app-layer validated)
  description   Json            // rich content (same editor as Article.content)
  price         Int             // IDR whole rupiah, no cents
  coverImageId  String          @db.Uuid
  startAt       DateTime        // UTC. Backend-derived from cities by default, admin override allowed
  endAt         DateTime        // UTC. Backend-derived from cities by default, admin override allowed
  status        OpenTripStatus  @default(draft)
  publishedAt   DateTime?       // UTC. Auto-set on draft→publish, immutable after
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt

  coverImage  Image              @relation(fields: [coverImageId], references: [id])
  cities      OpenTripCity[]
  inclusions  OpenTripInclusion[]

  @@index([coverImageId])
  @@index([status, publishedAt])
  @@index([startAt])
  @@map("open_trip")
}
```

**Field notes:**
- `slug` — admin-set, unique, SEO-friendly. 400 on collision.
- `excerpt` — required, ≤300 chars, app-layer cap (no DB varchar).
- `description` — Json, rich text blocks (reuse Article editor).
- `price` — Int, rupiah whole. `4900000` = Rp4.900.000.
- `startAt`/`endAt` — UTC stored. Backend computes `startAt = min(cities.arriveAt)`, `endAt = max(cities.departAt ?? lastCity.arriveAt)` on save. Admin override allowed (buffer days, marketing span).
- `status` — `draft|published|archived`. Archive = soft delete.
- `publishedAt` — auto on first `draft→published` transition. Immutable after (even on `archived→published` republish, keep original).
- No `maxSeats`/`availableSeats`. No `authorId` (business-owned product, not authored content).

### 2.3 OpenTripCity

Per-trip city stop. References master `City`.

```prisma
model OpenTripCity {
  id          String   @id @db.Uuid @default(uuid(7))
  openTripId  String   @db.Uuid
  cityId      String   @db.Uuid
  arriveAt    DateTime // UTC. Admin enters Turkey local → backend converts
  departAt    DateTime? // UTC. Optional. Null = end of trip (last city)
  order       Int      // auto-derived: sort by arriveAt, assign sequential index
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  openTrip     OpenTrip          @relation(fields: [openTripId], references: [id], onDelete: Cascade)
  city         City              @relation(fields: [cityId], references: [id], onDelete: Restrict)
  destinations OpenTripDestination[]

  @@unique([openTripId, order])
  @@index([openTripId])
  @@index([cityId])
  @@map("open_trip_city")
}
```

**Notes:**
- `cityId` NOT nullable (catalog discipline). Same city may repeat in one trip (return to start city).
- `order` auto-derived from `arriveAt` sort. Unique `(openTripId, order)`.
- `departAt` optional. Nullable for last city / implicit end.
- `onDelete: Cascade` from OpenTrip (delete trip → cities gone).
- `onDelete: Restrict` to City (delete City used by trips → 409).

### 2.4 OpenTripDestination

Per-trip destination visit under a city. References master `Destination`.

```prisma
model OpenTripDestination {
  id             String   @id @db.Uuid @default(uuid(7))
  openTripCityId String   @db.Uuid
  destinationId  String   @db.Uuid
  visitAt        DateTime // UTC. Admin enters Turkey local → backend converts
  order          Int      // auto-derived: sort by visitAt, assign sequential index
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  openTripCity OpenTripCity @relation(fields: [openTripCityId], references: [id], onDelete: Cascade)
  destination  Destination  @relation(fields: [destinationId], references: [id], onDelete: Restrict)

  @@unique([openTripCityId, order])
  @@index([openTripCityId])
  @@index([destinationId])
  @@map("open_trip_destination")
}
```

**Notes:**
- `visitAt` only — no end time. Duration implicit via next destination's `visitAt`.
- Same destination may repeat under same city (morning + evening visit).
- `order` auto-derived from `visitAt` sort. Unique `(openTripCityId, order)`.
- `onDelete: Restrict` to Destination.

### 2.5 InclusionItem

Shared catalog. Admin creates once, reuse across all trips.

```prisma
model InclusionItem {
  id        String   @id @db.Uuid @default(uuid(7))
  slug      String   @unique
  label     String   // display, e.g. "Tiket Pesawat PP"
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  openTripInclusions OpenTripInclusion[]

  @@map("inclusion_item")
}
```

**Notes:**
- No `icon`, no `type` default. Per-trip toggle is source of truth.
- `slug` stable ref even if `label` edited. Admin-set, unique.

### 2.6 OpenTripInclusion

Join table. Binary toggle per trip.

```prisma
model OpenTripInclusion {
  id              String        @id @db.Uuid @default(uuid(7))
  openTripId      String        @db.Uuid
  inclusionItemId String        @db.Uuid
  type            InclusionType // include | exclude
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  openTrip      OpenTrip      @relation(fields: [openTripId], references: [id], onDelete: Cascade)
  inclusionItem InclusionItem @relation(fields: [inclusionItemId], references: [id], onDelete: Restrict)

  @@unique([openTripId, inclusionItemId])
  @@index([openTripId])
  @@index([inclusionItemId])
  @@map("open_trip_inclusion")
}
```

**Notes:**
- NO `order` field. Backend returns inclusions unordered. Frontend sorts/groups (by type + frontend-chosen key).
- Unique `(openTripId, inclusionItemId)` — one item, one type per trip.
- `onDelete: Restrict` to InclusionItem.

### 2.7 Relations to update on existing models

Add reverse relations to existing models:

```prisma
// Image
model Image {
  // ...existing fields...
  openTrips OpenTrip[]   // cover images
}

// City
model City {
  // ...existing fields...
  openTripCities OpenTripCity[]
}

// Destination
model Destination {
  // ...existing fields...
  openTripDestinations OpenTripDestination[]
}
```

---

## 3. Relationship Diagram

```
OpenTrip (1)
├── coverImageId → Image (N:1, required)
├── OpenTripCity (1:N, cascade)
│   ├── cityId → City (N:1, restrict)
│   └── OpenTripDestination (1:N, cascade)
│       └── destinationId → Destination (N:1, restrict)
└── OpenTripInclusion (1:N, cascade)
    └── inclusionItemId → InclusionItem (N:1, restrict)

InclusionItem (standalone master, admin CRUD)
```

---

## 4. API Endpoints

**Routing structure:** flat. `/open-trips` serves both admin + public. GET public, writes require auth via middleware. Handler auth-aware — branches on `req.user?.role`.

**Auth:**
- Writes (POST/PUT/DELETE) → `requireAdmin` middleware (`user.role === 'admin'`).
- Public GET → optional auth (no 401 if anon). Middleware attaches `req.user` or null.

### 4.1 OpenTrip endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/open-trips` | optional | List. Admin: all statuses, honors `status` filter. Public: hard-filters `published AND publishedAt<=now`, ignores `status` param. |
| GET | `/open-trips/:slug` | optional | Detail by slug. Admin: any status. Public: 404 if not published. |
| GET | `/admin/open-trips/:id` | admin | Detail by id, any status. |
| POST | `/open-trips` | admin | Create full nested tree in one transaction. |
| PUT | `/open-trips/:id` | admin | Full-replace nested tree (idempotent). |
| DELETE | `/open-trips/:id` | admin | Soft delete → set `status=archived`. |

**Note:** admin detail-by-id path. Decision Q33 locked flat routes for the shared list+slug path; admin id-detail uses `/admin/open-trips/:id` (separate namespaced admin path) to avoid slug/id collision on `/open-trips/:slug`. `requireAdmin` on `/admin/*` group.

### 4.2 InclusionItem endpoints (admin-only)

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/admin/inclusion-items` | admin | List, cursor-paginated. |
| GET | `/admin/inclusion-items/:id` | admin | Detail. |
| POST | `/admin/inclusion-items` | admin | Create. |
| PUT | `/admin/inclusion-items/:id` | admin | Update. |
| DELETE | `/admin/inclusion-items/:id` | admin | Hard delete. 409 if referenced by any OpenTripInclusion (restrict). |

### 4.3 Query params (list endpoints)

Same filter fields shared admin/public (visibility enforced at query layer, not via user param):

```
cursor      String?   // cursor-based pagination
limit       Int?      // default 20
startAtFrom DateTime? // UTC
startAtTo   DateTime? // UTC
priceMin    Int?
priceMax    Int?
sort        String?   // whitelist: startAt | price | publishedAt. default: startAt asc
status      String?   // ADMIN ONLY. ignored on public.
```

**Public behavior:** `status` param ignored. Where-clause hard-applies `status=published AND publishedAt <= now()`.
**Admin behavior:** `status` honored. Default: all statuses (no status filter).

---

## 5. Request / Response Shapes

### 5.1 Create / Update OpenTrip (POST, PUT)

Full nested tree in single payload. Backend wraps in `$transaction`. Prisma nested writes. PUT = full-replace (children absent in payload = deleted via `set`).

```jsonc
{
  "slug": "cappadocia-open-trip-juli-2026",
  "title": "Cappadocia Open Trip 3D2N",
  "excerpt": "Trip terbuka ke Cappadocia, balon udara + tour destinasi ikonik.",
  "description": { /* rich text blocks, same shape as Article.content */ },
  "price": 4900000,
  "coverImageId": "0123abcd-...",
  "status": "draft",
  "startAt": "2026-07-15T06:00:00Z",   // optional override; if omitted, backend derives from cities
  "endAt": "2026-07-17T20:00:00Z",     // optional override
  "cities": [
    {
      "cityId": "uuid-city-istanbul",
      "arriveAt": "2026-07-15T06:00:00Z",  // admin enters Turkey local; frontend/client converts to UTC before send? — SEE §7 timezone
      "departAt": "2026-07-16T15:00:00Z",
      "destinations": [
        { "destinationId": "uuid-dest-hagia", "visitAt": "2026-07-15T11:00:00Z" },
        { "destinationId": "uuid-dest-bazaar", "visitAt": "2026-07-15T14:00:00Z" }
      ]
    },
    {
      "cityId": "uuid-city-cappadocia",
      "arriveAt": "2026-07-16T08:00:00Z",
      "departAt": null,
      "destinations": [
        { "destinationId": "uuid-dest-goreme", "visitAt": "2026-07-16T10:00:00Z" }
      ]
    }
  ],
  "inclusions": [
    { "inclusionItemId": "uuid-inc-flight", "type": "include" },
    { "inclusionItemId": "uuid-inc-hotel", "type": "include" },
    { "inclusionItemId": "uuid-inc-tips", "type": "exclude" }
  ]
}
```

**Backend on save:**
1. Validate soft rules (§6).
2. Sort `cities` by `arriveAt` asc → assign `order = index`.
3. Within each city, sort `destinations` by `visitAt` asc → assign `order = index`.
4. If `startAt`/`endAt` not in payload → derive: `startAt = min(cities.arriveAt)`, `endAt = max(cities.departAt ?? lastCity.arriveAt)`.
5. If `status` transitions `draft→published` and `publishedAt` is null → set `publishedAt = now()`. If `publishedAt` already set → preserve.
6. Wrap in `$transaction`. Use Prisma nested `create`/`set` for full-replace.
7. Datetimes received as UTC (client converts Turkey-local → UTC before send). Store UTC.

### 5.2 List Response (GET /open-trips)

Scalar fields + coverImage only. No children. No counts.

```jsonc
{
  "data": [
    {
      "id": "uuid",
      "slug": "cappadocia-open-trip-juli-2026",
      "title": "Cappadocia Open Trip 3D2N",
      "excerpt": "Trip terbuka ke Cappadocia...",
      "price": 4900000,
      "startAt": "2026-07-15T06:00:00Z",
      "endAt": "2026-07-17T20:00:00Z",
      "status": "published",          // admin sees; public endpoint always "published" (or omit)
      "publishedAt": "2026-06-01T03:00:00Z",
      "coverImage": { "id": "uuid", "url": "...", "alt": "...", "blurHash": "..." },
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "cursor": "base64-encoded-next-cursor",
  "hasNext": true
}
```

### 5.3 Detail Response (GET /open-trips/:slug, GET /admin/open-trips/:id)

Full tree expanded via Prisma `include`:

```jsonc
{
  "data": {
    "id": "uuid",
    "slug": "...",
    "title": "...",
    "excerpt": "...",
    "description": { /* rich blocks */ },
    "price": 4900000,
    "startAt": "...",
    "endAt": "...",
    "status": "published",
    "publishedAt": "...",
    "coverImage": { "id": "uuid", "url": "...", "alt": "...", "blurHash": "..." },
    "cities": [
      {
        "id": "uuid",
        "cityId": "uuid",
        "arriveAt": "...",
        "departAt": "...",
        "order": 0,
        "city": { "id": "uuid", "slug": "istanbul", "name": "Istanbul", "tagline": "...", "image": { "url": "..." } },
        "destinations": [
          {
            "id": "uuid",
            "destinationId": "uuid",
            "visitAt": "...",
            "order": 0,
            "destination": { "id": "uuid", "name": "Hagia Sophia", "image": { "url": "..." } }
          }
        ]
      }
    ],
    "inclusions": [
      {
        "id": "uuid",
        "type": "include",
        "inclusionItem": { "id": "uuid", "slug": "flight-pp", "label": "Tiket Pesawat PP" }
      },
      {
        "id": "uuid",
        "type": "exclude",
        "inclusionItem": { "id": "uuid", "slug": "tips", "label": "Tip Guide & Driver" }
      }
    ],
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

## 6. Business Rules & Validation

### 6.1 Soft validation (400 on violation)

- `startAt <= endAt`
- `OpenTripCity.arriveAt <= OpenTripCity.departAt` (when `departAt` set)
- `excerpt` length ≤ 300 chars
- `slug` unique → 400 on collision
- `OpenTripInclusion` unique `(openTripId, inclusionItemId)` → 400 on duplicate in payload

### 6.2 NOT enforced (deliberate)

- City `arriveAt` within `[startAt, endAt]` — admin may override trip span beyond city times.
- Destination `visitAt` within parent city `[arriveAt, departAt]` — admin drafts incrementally.
- Cross-city chronology — display order derived from times, mild disorder renders fine.

### 6.3 Auto-derivation

- `OpenTripCity.order` ← sort `arriveAt` asc, assign sequential index.
- `OpenTripDestination.order` ← sort `visitAt` asc within parent city, assign sequential index.
- `OpenTrip.startAt`/`endAt` ← derived from cities unless admin overrides in payload.

### 6.4 Lifecycle

- `DELETE /open-trips/:id` → soft delete. Set `status = archived`. No hard delete. No hard-purge endpoint this slice.
- `publishedAt` auto on `draft→published`, immutable after (preserved on `archived→published` republish).

### 6.5 Referential integrity

- Delete master `City`/`Destination`/`InclusionItem` referenced by any trip → 409 Conflict.
- Admin must unlink from trips (or archive trips) before deleting master catalog row.

---

## 7. Timezone

**Rule: all datetimes stored UTC.**

- Admin enters Turkey local time (+03, no DST — fixed year-round).
- Client/frontend converts Turkey-local → UTC before sending to API.
- Backend stores UTC. Treats input as UTC.
- Frontend converts UTC → Turkey local for display.
- Document this convention in code comments on datetime fields.

**Escape hatch if multi-region trips added later:** revisit w/ per-trip `timezone` field. Not now.

---

## 8. Permissions

| Action | Role |
|---|---|
| Read published OpenTrips | public (anon) |
| Read draft/archived OpenTrips | admin |
| Create/Update/Delete OpenTrip | admin |
| CRUD InclusionItem | admin |

`requireAdmin` middleware: `req.user.role === 'admin'`. Reuse existing User/Session auth.

---

## 9. Pagination

Cursor-based. Same pattern for OpenTrip list + InclusionItem list.

- `limit` default 20.
- `cursor` = opaque base64-encoded pointer (recommend encoded JSON `{sortFieldValue, id}` or Prisma cursor on `id` w/ sort compound).
- Response: `{ data, cursor, hasNext }`.
- Reuse whatever cursor helper convention exists in codebase (check at impl time).

---

## 10. Assumptions & Open Questions

Backend dev — flag if any conflict w/ codebase conventions:

1. **API response format** — assume generic envelope `{ data, error, ... }` per project convention (BACKEND.md). Confirm exact shape at impl.
2. **No audit log** — no `createdBy`/audit trail on OpenTrip. Skip this slice.
3. **No rate limiting** — standard app-level limits apply, nothing special.
4. **No i18n** — content Bahasa Indonesia hardcoded (per AGENTS.md). Slug/label freeform.
5. **Rich text editor** — `description: Json` reuses same editor/blocks as `Article.content`. Confirm block schema compat at impl.
6. **UTC conversion** — assumes client converts Turkey-local→UTC. If client sends Turkey-local naive, backend needs tz-aware parse (Asia/Istanbul). Clarify client contract w/ frontend dev.
7. **Cursor impl** — confirm existing cursor pagination util in codebase, else implement standard Prisma `cursor`/`take`/`skip 1`.
8. **Error codes** — 400 validation, 401 unauth, 403 non-admin, 404 not found / public-non-published, 409 referential conflict, 409 slug uniqueness.

---

## 11. Out of Scope (deferred)

- Seats / capacity / `availableSeats` — lands w/ Booking model slice.
- Booking / Order / payment — separate slice.
- Trip template / recurring departures — concrete departure only this slice.
- Per-trip image gallery — single cover only this slice.
- Hard purge endpoint — archive sufficient; add admin purge tool only if storage grows.
- Search (text search on title/description) — filters + sort sufficient this slice.
- Per-trip inclusion ordering — frontend sorts.
- Multi-region timezone support — Turkey-only assumption.
