# PRD: Add City Category

Implement categorized cities. New `CityCategory` entity (M2M with `City` via implicit join), full CRUD module, and inline category assignment on city mutations.

Inline `categoryIds` array on City create/update (Prisma `set`). No separate sync endpoint, no link ordering, no city count on category list.

---

## Decisions (locked)

| # | Decision | Choice |
|---|---|---|
| 1 | Reuse article `Category` or new model | **New `CityCategory` model** — separate from article Category |
| 2 | Cardinality | **Many-to-many** — one city can have multiple categories |
| 3 | Join shape | **Implicit M2M** (no join model, no link fields) |
| 4 | Endpoints | **6 endpoints** mirroring article `category` module: list / slug / id / post / patch / delete |
| 5a | Delete semantics | **Unrestricted** — allow always; Prisma drops links, cities kept |
| 5b | Uniqueness | **Only `slug`** — name not unique |
| 6 | Attach pattern | **Inline `categoryIds`** on City create/update (no separate sync endpoint) |
| 6a | Update `[]` vs omit | **Distinguishable** — `[]` unlinks all; omitted leaves untouched |

### Out of scope

- No `_count.cities` on category list response (do not include city count).
- No pagination on `GET /api/city-categories` (small set, return full list).
- No slug GET-by-slug special handling beyond mirror.
- No frontend work (backend-only PRD).

---

## Files

### 1. `backend/prisma/schema.prisma`

Add new model after `City` model section:

```prisma
model CityCategory {
  id        String   @id @default(uuid(7)) @db.Uuid
  slug      String   @unique
  name      String
  cities    City[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("city_category")
}
```

Add relation field on `City` model (alongside `categories`-related fields):

```prisma
categories CityCategory[]
```

### 2. `backend/src/modules/city-category/city-category.schema.ts`

```ts
import * as v from "valibot"

export const createCityCategorySchema = v.object({
  name: v.pipe(
    v.string(),
    v.minLength(1, "Nama harus diisi"),
    v.maxLength(100, "Nama maksimal 100 karakter"),
  ),
})

export const updateCityCategorySchema = v.partial(createCityCategorySchema)

export type CreateCityCategoryInput = v.InferInput<typeof createCityCategorySchema>
export type CreateCityCategoryOutput = v.InferOutput<typeof createCityCategorySchema>
export type UpdateCityCategoryInput = v.InferInput<typeof updateCityCategorySchema>
```

### 3. `backend/src/modules/city-category/city-category.service.ts`

Mirror `backend/src/modules/category/category.service.ts` exactly, swapping model `category` → `cityCategory` and type imports. Use `toSlug` from `backend/lib/slug`.

Functions:
- `listCityCategories()` → `db.cityCategory.findMany({ orderBy: { name: "asc" } })`. **No `_count` include.**
- `getCityCategory(id)` → findUnique by id, 404 `"Kategori kota tidak ditemukan"`.
- `getCityCategoryBySlug(slug)` → findUnique by slug, 404 same message.
- `createCityCategory(input)` → `slug = toSlug(input.name)`, check existing slug (409 `"Slug sudah digunakan"`), `db.cityCategory.create({ data: { name, slug } })`.
- `updateCityCategory(id, input)` → confirm existing (404); if `input.name !== undefined`, re-derive slug, check not taken by other id (409), set `name`+`slug`. Return `db.cityCategory.update`.
- `deleteCityCategory(id)` → confirm existing (404), `db.cityCategory.delete`. **No guard on linked cities.**

### 4. `backend/src/modules/city-category/city-category.route.ts`

Mirror `backend/src/modules/category/category.route.ts`. Indonesian messages:

- `GET /` public → `listCityCategories()` → `successResponse(result, "ok")`
- `GET /slug/:slug` public → `getCityCategoryBySlug` → `successResponse(..., "ok")`
- `GET /:id` public, `sValidator("param", paramIdSchema)` → `getCityCategory` → `successResponse(..., "ok")`
- `use(requireAuth)`
- `POST /` `sValidator("json", createCityCategorySchema)` → 201 `"Kategori kota berhasil dibuat"`
- `PATCH /:id` param + json validate → `updateCityCategory` → `"Kategori kota berhasil diperbarui"`
- `DELETE /:id` param validate → `deleteCityCategory` → `"Kategori kota berhasil dihapus"`

Import `paramIdSchema` from `backend/schemas/param.schema`, `requireAuth` from `backend/middlewares/require-auth`, `sValidator` from `backend/middlewares/validator-wrapper`, `successResponse` from `backend/utils/response`.

### 5. `backend/src/modules/city/city.schema.ts`

Add `categoryIds` to `createCitySchema`:

```ts
categoryIds: v.optional(
  v.pipe(
    v.array(v.pipe(v.string(), v.uuid("ID kategori tidak valid"))),
    v.maxLength(10, "Maksimal 10 kategori"),
  ),
),
```

`updateCitySchema = v.partial(createCitySchema)` inherits `categoryIds` as optional automatically — no change needed there.

Add exports:

```ts
export type CreateCityInput = v.InferInput<typeof createCitySchema>
// (UpdateCityInput / others already present — keep)
```

### 6. `backend/src/modules/city/city.service.ts`

**Selects** — add `categories` (and `_count.cities` already exists, keep it) to `includeList` and `includeDetail`:

```ts
const includeList = {
  image: { select: imageCardSelect },
  categories: { select: { id: true, name: true, slug: true } },
  _count: { select: { destinations: true, images: true } },
} as const

const includeDetail = {
  image: { select: imageCardSelect },
  categories: { select: { id: true, name: true, slug: true } },
  destinations: {
    select: { id: true, name: true, image: { select: imageCardSelect } },
  },
  _count: { select: { destinations: true, images: true } },
} as const
```

**`createCity`** — after `assertImageExists(input.imageId)`, if `input.categoryIds` is non-empty, add to create `data`:

```ts
...(input.categoryIds && input.categoryIds.length > 0
  ? { categories: { connect: input.categoryIds.map((id) => ({ id })) } }
  : {}),
```

Add a validation helper inline (or before create): if `input.categoryIds?.length`, count existing categories matching those IDs; mismatch → throw `HTTPException(400, { message: "Beberapa kategori tidak ditemukan" })`.

**`updateCity`** — handle `categoryIds` like `highlights` (presence check, not truthy). After other field branches:

```ts
if (input.categoryIds !== undefined) {
  if (input.categoryIds.length > 0) {
    const categories = await db.cityCategory.findMany({
      where: { id: { in: input.categoryIds } },
      select: { id: true },
    })
    if (categories.length !== input.categoryIds.length) {
      throw new HTTPException(400, { message: "Beberapa kategori tidak ditemukan" })
    }
  }
  data.categories = { set: input.categoryIds.map((id) => ({ id })) }
}
```

`set` with empty array unlinks all; `set` with IDs full-replaces. Omitting `categoryIds` (undefined) skips the block — leaves relation untouched.

### 7. `backend/src/app.ts`

Add import (alphabetical-ish, after `categoryRoute` import line):

```ts
import cityCategoryRoute from "backend/modules/city-category/city-category.route"
```

Add mount (after `/categories` route):

```ts
.route("/city-categories", cityCategoryRoute)
```

---

## Migration & Generate

From `backend/` directory:

```bash
pnpm dlx prisma migrate dev --name add_city_category
pnpm db:generate
```

Migration creates table `city_category` + implicit join table `_CityToCityCategory`.

## Typecheck & Lint

```bash
pnpm typecheck
pnpm lint
```

## Verification

After implementing:

1. `GET /api/city-categories` returns `[]` (200, `success: true`).
2. `POST /api/city-categories` (auth) with `{ "name": "Pantai" }` → 201, slug `"pantai"`.
3. `GET /api/city-categories/slug/pantai` → 200.
4. `PATCH` rename → slug updates, 409 if taken by another.
5. `DELETE` → 200, links on cities drop silently.
6. `POST /api/cities` with `categoryIds: ["<id>"]` → city created linked.
7. `PATCH /api/cities/:id` with `categoryIds: []` → unlinks all; omitted → unchanged.
8. `GET /api/cities/:id` response includes `categories: [{id,name,slug}]`.
9. Invalid `categoryIds` (non-existent) → 400 `"Beberapa kategori tidak ditemukan"`.