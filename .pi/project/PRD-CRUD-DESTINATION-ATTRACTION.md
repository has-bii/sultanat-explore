# PRD: Backend CRUD — Destination, Attraction, AttractionCategory

**Version:** 1.0  
**Created:** 2026-06-07  
**Scope:** Backend API only (Hono routes + services + schemas). Frontend implementation separate.

---

## 1. Overview

Implement full CRUD endpoints for 5 models:
- **Destination** — city/region entity
- **DestinationImage** — gallery join table
- **AttractionCategory** — category entity (budaya, alam, pantai, etc.)
- **Attraction** — landmark/activity per destination
- **AttractionImage** — gallery join table

Follows existing Image CRUD module pattern (`backend/src/modules/image/`).

---

## 2. Schema Changes (Applied)

| Change | Detail |
|---|---|
| `AttractionCategory.label` removed | Replaced by `slug` with `@unique` |
| `Attraction.categoryId` made optional | `String? @db.Uuid` — allows `onDelete: SetNull` |
| `Attraction.category` FK updated | `onDelete: SetNull` — deleting category nullifies attractions' categoryId |

---

## 3. Decisions

| Decision | Choice |
|---|---|
| Auth | GETs public, mutations behind `requireAuth` |
| Slug (Destination) | Auto-generated from `name`, even on update |
| Slug (AttractionCategory) | Auto-generated from `name` |
| Highlights | Simple `string[]`, max 20 items |
| Gallery management | Individual add/remove/reorder endpoints |
| Reorder strategy | Full ordered imageId array, backend recalculates `order` |
| Attraction routing | Nested under destination (`/destinations/:destinationId/attractions/...`) |
| Destination update | All fields modifiable except slug (auto-regen from name) |
| Attraction update | All fields except `destinationId` (locked) |
| List response shape | Include relations (image, category, `_count`) |
| Pagination | Cursor-based (same as Image module) |
| Category deletion | `onDelete: SetNull` — attractions lose category |
| Destination deletion | Cascade to attractions + galleries. Hero image stays in Image table |
| List filters | Search by name, filter by featured/categoryId, sort by name/createdAt |
| Category list | Include `_count.attractions` |

---

## 4. Backend Module Structure

```
backend/src/modules/
├── destination/
│   ├── destination.route.ts
│   ├── destination.service.ts
│   └── destination.schema.ts
├── attraction/
│   ├── attraction.route.ts
│   ├── attraction.service.ts
│   └── attraction.schema.ts
└── attraction-category/
    ├── attraction-category.route.ts
    ├── attraction-category.service.ts
    └── attraction-category.schema.ts
```

Route registration in `app.ts`:
```ts
app.route("/destinations", destinationRoute)
app.route("/destinations/:destinationId/attractions", attractionRoute)
app.route("/attraction-categories", attractionCategoryRoute)
```

---

## 5. API Endpoints

### 5.1 Destination

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/destinations` | Public | List with cursor pagination, search, filter (featured), sort |
| `GET` | `/destinations/:id` | Public | Get single with relations |
| `POST` | `/destinations` | Auth | Create (auto slug from name) |
| `PATCH` | `/destinations/:id` | Auth | Update (slug auto-regen from name) |
| `DELETE` | `/destinations/:id` | Auth | Delete (cascade: attractions, galleries. Image stays.) |

#### Create/PATCH body:
```ts
{
  name: string           // 1-100 chars
  tagline: string        // 1-200 chars
  description: string    // 1-5000 chars
  imageId: string        // UUID, references existing Image
  featured?: boolean     // default false
  highlights?: string[]  // 0-20 items, each 1-200 chars
}
```

#### List query params:
```ts
{
  cursor?: string
  limit?: number
  search?: string         // search by name (startsWith, case-insensitive)
  featured?: boolean      // filter
  sort?: "name" | "createdAt"
  order?: "asc" | "desc"
}
```

#### List response includes:
- `image` (id, url, blurHash)
- `_count` (attractions, images)

#### Detail response includes:
- `image` (id, url, blurHash)
- `images` (gallery, ordered) with `image` relation
- `attractions` (basic: id, name, image, category)
- `_count` (attractions, images)

---

### 5.2 Destination Gallery (DestinationImage)

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/destinations/:destinationId/gallery` | Auth | Add image to gallery |
| `DELETE` | `/destinations/:destinationId/gallery/:imageId` | Auth | Remove image from gallery |
| `PUT` | `/destinations/:destinationId/gallery/reorder` | Auth | Reorder gallery |

#### Add body:
```ts
{
  imageId: string  // UUID, references existing Image
  order?: number   // optional, defaults to append (max order + 1)
}
```

#### Reorder body:
```ts
{
  imageIds: string[]  // full ordered array of image UUIDs
}
```

---

### 5.3 Attraction (nested under destination)

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/destinations/:destinationId/attractions` | Public | List with cursor pagination, search, filter (categoryId), sort |
| `GET` | `/destinations/:destinationId/attractions/:id` | Public | Get single with relations |
| `POST` | `/destinations/:destinationId/attractions` | Auth | Create |
| `PATCH` | `/destinations/:destinationId/attractions/:id` | Auth | Update (destinationId locked) |
| `DELETE` | `/destinations/:destinationId/attractions/:id` | Auth | Delete (cascade: galleries) |

#### Create/PATCH body:
```ts
{
  name: string           // 1-100 chars
  description: string    // 1-5000 chars
  imageId: string        // UUID, references existing Image
  categoryId?: string    // UUID, optional, references AttractionCategory
}
```

#### List query params:
```ts
{
  cursor?: string
  limit?: number
  search?: string         // search by name (startsWith, case-insensitive)
  categoryId?: string     // filter by category
  sort?: "name" | "createdAt"
  order?: "asc" | "desc"
}
```

#### List response includes:
- `image` (id, url, blurHash)
- `category` (id, name, slug)
- `_count` (images)

#### Detail response includes:
- `image` (id, url, blurHash)
- `category` (id, name, slug)
- `images` (gallery, ordered) with `image` relation
- `_count` (images)

---

### 5.4 Attraction Gallery (AttractionImage)

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/destinations/:destinationId/attractions/:attractionId/gallery` | Auth | Add image to gallery |
| `DELETE` | `/destinations/:destinationId/attractions/:attractionId/gallery/:imageId` | Auth | Remove image from gallery |
| `PUT` | `/destinations/:destinationId/attractions/:attractionId/gallery/reorder` | Auth | Reorder gallery |

#### Add body:
```ts
{
  imageId: string  // UUID, references existing Image
  order?: number   // optional, defaults to append
}
```

#### Reorder body:
```ts
{
  imageIds: string[]  // full ordered array of image UUIDs
}
```

---

### 5.5 AttractionCategory

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/attraction-categories` | Public | List all, include `_count.attractions` |
| `GET` | `/attraction-categories/:id` | Public | Get single with `_count.attractions` |
| `POST` | `/attraction-categories` | Auth | Create (auto slug from name) |
| `PATCH` | `/attraction-categories/:id` | Auth | Update (slug auto-regen from name) |
| `DELETE` | `/attraction-categories/:id` | Auth | Delete (SetNull on attractions) |

#### Create/PATCH body:
```ts
{
  name: string   // 1-50 chars
  slug: string   // auto-generated, unique
}
```

---

## 6. Validation Schemas

### destination.schema.ts
- `createDestinationSchema` — name (1-100), tagline (1-200), description (1-5000), imageId (uuid), featured (optional bool), highlights (optional, max 20, each 1-200)
- `updateDestinationSchema` — same fields, all optional
- `destinationQuerySchema` — extends shared querySchema with `featured` filter, `sort` limited to name/createdAt

### attraction.schema.ts
- `createAttractionSchema` — name (1-100), description (1-5000), imageId (uuid), categoryId (optional uuid)
- `updateAttractionSchema` — same fields, all optional
- `attractionQuerySchema` — extends shared querySchema with `categoryId` filter, `sort` limited to name/createdAt

### attraction-category.schema.ts
- `createAttractionCategorySchema` — name (1-50)
- `updateAttractionCategorySchema` — name (optional, 1-50)

### gallery.schema.ts (shared for both galleries)
- `addGalleryImageSchema` — imageId (uuid), order (optional int)
- `reorderGallerySchema` — imageIds (array of uuids, min 1)

---

## 7. Phases

### Phase 1: AttractionCategory CRUD
- Backend module: `attraction-category/` (route, service, schema)
- Register in `app.ts`
- Endpoints: list, get, create, update, delete
- Auto-slug from name, `_count.attractions` in responses

### Phase 2: Destination CRUD
- Backend module: `destination/` (route, service, schema)
- Register in `app.ts`
- Endpoints: list (paginated, filtered), get, create, update, delete
- Auto-slug from name, image relation, `_count`

### Phase 3: Destination Gallery
- Add gallery endpoints to `destination.route.ts`
- Endpoints: add image, remove image, reorder
- Validation via shared gallery schema

### Phase 4: Attraction CRUD
- Backend module: `attraction/` (route, service, schema)
- Register in `app.ts` nested under destinations
- Endpoints: list (paginated, filtered), get, create, update, delete
- Nested routing, image + category relations, `_count`

### Phase 5: Attraction Gallery
- Add gallery endpoints to `attraction.route.ts`
- Endpoints: add image, remove image, reorder
- Same pattern as destination gallery

---

## 8. Shared Utilities

Use existing:
- `paramIdSchema` from `backend/src/schemas/param.schema.ts`
- `querySchema` from `backend/src/schemas/query.schema.ts` (cursor, limit)
- `successResponse` / `errorResponse` from `backend/src/utils/response.ts`
- `requireAuth` middleware from `backend/src/middlewares/require-auth.ts`
- `zValidator` wrapper from `backend/src/middlewares/validator-wrapper.ts`

---

## 9. Error Messages (Bahasa Indonesia)

| Scenario | Message |
|---|---|
| Not found | `"[Entity] tidak ditemukan"` |
| Created | `"[Entity] berhasil dibuat"` |
| Updated | `"[Entity] berhasil diperbarui"` |
| Deleted | `"[Entity] berhasil dihapus"` |
| Slug duplicate | `"Slug sudah digunakan"` |
| Gallery image exists | `"Foto sudah ada di galeri"` |
| Gallery image not found | `"Foto tidak ditemukan di galeri"` |
| Invalid destination | `"Destinasi tidak ditemukan"` |
