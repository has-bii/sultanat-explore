# Article and Category Backend Module

## Context

Articles are currently hardcoded in `frontend/src/features/articles/data.ts`. This plan migrates article data to a Prisma-backed module so the admin dashboard can manage content via the API, and the public site reads from the database.

Two new backend modules are added:
- `article` — public read + admin CRUD for blog articles
- `category` — public read + admin CRUD for article categories (normalized, separate model)

Out of scope: frontend refactor of `data.ts` consumers. Frontend updates happen in a follow-up.

## Decisions Locked (grilled 2026-06-14)

| Decision | Value |
|---|---|
| Author | `authorId` FK to existing `User` model (no new Author model) |
| Content storage | `Json` column, `v.any()` validation (opaque blocks, frontend owns shape) |
| Thumbnail | `imageId` FK to existing `Image` model (mirror dest) |
| Slug | Server auto-gen from `title` via `toSlug`. 409 on collision. Re-derived on title update. Not in body schema. |
| Category slug | Server auto-gen from `name`, same pattern |
| `published` | `Boolean @default(false)`. Public list hardcodes `published = true` |
| `publishedAt` | `DateTime?`. Auto-set on `published` false→true transition (overwrites on each transition) |
| `date` | `DateTime`. Curator-chosen publish-on date (separate concept from `publishedAt`) |
| Category delete | `onDelete: SetNull` on Article.categoryId. Articles survive, become uncategorized |
| Image delete | Mirror dest — no `onDelete` on Article.imageId. Image rows effectively immutable |
| `featured` field | **REMOVED** (no column, no filter, no `getFeaturedArticles()` helper) |
| `readingTime` field | **REMOVED** |
| `metaTitle` / `metaDescription` | **REMOVED** |
| `role` (author) | **REMOVED** (was on hardcoded Author, not on User) |
| Excerpt max length | 500 chars |
| List includes | `image` + `author (id, name, image)` + `category (id, slug, name)` per row |
| Pagination | Cursor (mirror dest via `cursorArgs` + `toPage`) |
| List search | `title` + `excerpt` (case-insensitive `contains`) |
| List sort | `createdAt` \| `publishedAt` (default: `createdAt`) |
| Seed | None (admin will create content via API) |
| Related endpoint | `GET /articles/slug/:slug/related?limit=3` (under `slug/` namespace to avoid `/:id` conflict) |

## Step 1 — Prisma schema

Edit `backend/prisma/schema.prisma`. Three changes:

**1a) Add `Image` back-relation** — append `articles Article[]` to the `Image` model:

```prisma
model Image {
  id        String     @id @db.Uuid @default(uuid(7))
  url       String
  alt       String?
  fileSize  Int
  blurHash  String
  createdAt DateTime   @default(now())

  destinations         Destination[]
  attractions          Attraction[]
  destinationGalleries DestinationImage[]
  articles             Article[]

  @@map("image")
}
```

**1b) Add `User` back-relation** — append `articles Article[]` to the `User` model:

```prisma
model User {
  id            String    @id @db.Uuid @default(uuid(7))
  name          String
  email         String
  emailVerified Boolean   @default(false)
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  sessions      Session[]
  accounts      Account[]
  articles      Article[]

  @@unique([email])
  @@map("user")
}
```

**1c) Append `Article` and `Category` models** at the end of the file:

```prisma
// ─── Category ───────────────────────────────────────────────

model Category {
  id        String   @id @db.Uuid @default(uuid(7))
  slug      String   @unique
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  articles Article[]

  @@map("category")
}

// ─── Article ────────────────────────────────────────────────

model Article {
  id          String    @id @db.Uuid @default(uuid(7))
  slug        String    @unique
  title       String
  excerpt     String
  content     Json
  imageId     String    @db.Uuid
  categoryId  String?   @db.Uuid
  authorId    String    @db.Uuid
  date        DateTime
  published   Boolean   @default(false)
  publishedAt DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  image    Image     @relation(fields: [imageId], references: [id])
  category Category? @relation(fields: [categoryId], references: [id], onDelete: SetNull)
  author   User      @relation(fields: [authorId], references: [id])

  @@index([imageId])
  @@index([categoryId])
  @@index([authorId])
  @@index([published, publishedAt])
  @@map("article")
}
```

Then run from `backend/`:

```bash
pnpm prisma migrate dev --name add_article_and_category
pnpm prisma generate
```

## Step 2 — File structure

Create six files:

```
backend/src/modules/article/article.schema.ts
backend/src/modules/article/article.service.ts
backend/src/modules/article/article.route.ts

backend/src/modules/category/category.schema.ts
backend/src/modules/category/category.service.ts
backend/src/modules/category/category.route.ts
```

## Step 3 — `backend/src/modules/article/article.schema.ts`

Mirror `destination/destination.schema.ts` shape. Valibot only, no Zod.

```ts
import * as v from "valibot"

import { cursorPaginationSchema, orderDirectionSchema } from "backend/schemas/query.schema"

export const createArticleSchema = v.object({
  title: v.pipe(
    v.string(),
    v.minLength(1, "Judul harus diisi"),
    v.maxLength(200, "Judul maksimal 200 karakter"),
  ),
  excerpt: v.pipe(
    v.string(),
    v.minLength(1, "Ringkasan harus diisi"),
    v.maxLength(500, "Ringkasan maksimal 500 karakter"),
  ),
  content: v.any(), // opaque JSON — frontend owns block shapes
  imageId: v.pipe(v.string(), v.uuid("ID gambar tidak valid")),
  categoryId: v.optional(v.pipe(v.string(), v.uuid("ID kategori tidak valid"))),
  authorId: v.pipe(v.string(), v.uuid("ID penulis tidak valid")),
  date: v.pipe(v.string(), v.isoTimestamp("Tanggal tidak valid")),
  published: v.boolean(),
})

export const updateArticleSchema = v.partial(createArticleSchema)

export const articleQuerySchema = v.object({
  ...cursorPaginationSchema.entries,
  search: v.optional(v.string()),
  category: v.optional(v.string()), // category slug
  sort: v.optional(v.picklist(["createdAt", "publishedAt"]), "createdAt"),
  order: orderDirectionSchema,
})

export const articleRelatedQuerySchema = v.object({
  limit: v.optional(v.pipe(v.string(), v.transform(Number), v.number(), v.minValue(1), v.maxValue(20)), "3"),
})

export type CreateArticleInput = v.InferInput<typeof createArticleSchema>
export type CreateArticleOutput = v.InferOutput<typeof createArticleSchema>
export type UpdateArticleInput = v.InferInput<typeof updateArticleSchema>
export type ArticleQueryInput = v.InferInput<typeof articleQuerySchema>
export type ArticleQueryOutput = v.InferOutput<typeof articleQuerySchema>
export type ArticleRelatedQueryInput = v.InferInput<typeof articleRelatedQuerySchema>
```

Note: no `slug` field in any schema. Server auto-derives from `title`. `content: v.any()` per decision (Q16).

If `articleRelatedQuerySchema`'s limit transform syntax doesn't match existing convention, check `backend/schemas/query.schema.ts` for the limit pattern and align.

## Step 4 — `backend/src/modules/article/article.service.ts`

Mirror `destination/destination.service.ts` structure. One exported function per operation.

```ts
import { HTTPException } from "hono/http-exception"

import { Prisma } from "backend/generated/prisma/client"
import { db } from "backend/lib/db"
import { cursorArgs, toPage } from "backend/lib/paginate"
import { imageCardSelect } from "backend/lib/prisma-fragments"
import { toSlug } from "backend/lib/slug"
import { assertImageExists } from "backend/modules/image/image.service"
import type {
  ArticleQueryOutput,
  CreateArticleInput,
  UpdateArticleInput,
} from "backend/modules/article/article.schema"

const authorSelect = {
  id: true,
  name: true,
  image: true,
} as const

const categorySelect = {
  id: true,
  slug: true,
  name: true,
} as const

const includeList = {
  image: { select: imageCardSelect },
  author: { select: authorSelect },
  category: { select: categorySelect },
} as const

// Detail uses same include — content is a column on the row
const includeDetail = includeList

export async function listArticles(params: ArticleQueryOutput) {
  const { cursor, limit, search, category, sort, order } = params

  let categoryId: string | undefined
  if (category) {
    const cat = await db.category.findUnique({ where: { slug: category } })
    if (!cat) {
      return toPage([], limit)
    }
    categoryId = cat.id
  }

  const where: Prisma.ArticleWhereInput = {
    // Public list always filters to published
    published: true,
    ...(categoryId ? { categoryId } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { excerpt: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  }

  const articles = await db.article.findMany({
    ...cursorArgs({ cursor, limit }),
    where,
    orderBy: { [sort]: order },
    include: includeList,
  })

  return toPage(articles, limit)
}

export async function getArticleBySlug(slug: string) {
  const article = await db.article.findUnique({
    where: { slug },
    include: includeDetail,
  })
  if (!article) throw new HTTPException(404, { message: "Artikel tidak ditemukan" })
  return article
}

export async function getArticle(id: string) {
  const article = await db.article.findUnique({
    where: { id },
    include: includeDetail,
  })
  if (!article) throw new HTTPException(404, { message: "Artikel tidak ditemukan" })
  return article
}

export async function getRelatedArticles(slug: string, limit: number) {
  const current = await db.article.findUnique({
    where: { slug },
    select: { id: true, categoryId: true },
  })
  if (!current) throw new HTTPException(404, { message: "Artikel tidak ditemukan" })

  // Same category first (excluding self), then others (excluding self)
  const sameCategory = current.categoryId
    ? await db.article.findMany({
        where: {
          published: true,
          id: { not: current.id },
          categoryId: current.categoryId,
        },
        orderBy: { publishedAt: "desc" },
        take: limit,
        include: includeList,
      })
    : []

  if (sameCategory.length >= limit) {
    return sameCategory.slice(0, limit)
  }

  const remaining = limit - sameCategory.length
  const others = await db.article.findMany({
    where: {
      published: true,
      id: { not: current.id },
      ...(current.categoryId ? { categoryId: { not: current.categoryId } } : {}),
    },
    orderBy: { publishedAt: "desc" },
    take: remaining,
    include: includeList,
  })

  return [...sameCategory, ...others]
}

export async function createArticle(input: CreateArticleInput) {
  const slug = toSlug(input.title)

  const existingSlug = await db.article.findUnique({ where: { slug } })
  if (existingSlug) throw new HTTPException(409, { message: "Slug sudah digunakan" })

  await assertImageExists(input.imageId)

  if (input.categoryId) {
    const category = await db.category.findUnique({ where: { id: input.categoryId } })
    if (!category) throw new HTTPException(400, { message: "Kategori tidak ditemukan" })
  }

  // authorId validation: confirm User exists (FK will also catch, but explicit error is friendlier)
  const author = await db.user.findUnique({ where: { id: input.authorId } })
  if (!author) throw new HTTPException(400, { message: "Penulis tidak ditemukan" })

  return db.article.create({
    data: {
      title: input.title,
      slug,
      excerpt: input.excerpt,
      content: input.content as Prisma.InputJsonValue,
      imageId: input.imageId,
      categoryId: input.categoryId ?? null,
      authorId: input.authorId,
      date: new Date(input.date),
      published: input.published,
      // publishedAt set on first publish below
      publishedAt: input.published ? new Date() : null,
    },
    include: includeList,
  })
}

export async function updateArticle(id: string, input: UpdateArticleInput) {
  const existing = await db.article.findUnique({ where: { id } })
  if (!existing) throw new HTTPException(404, { message: "Artikel tidak ditemukan" })

  const data: Prisma.ArticleUpdateInput = {}

  if (input.title !== undefined) {
    const slug = toSlug(input.title)
    const slugTaken = await db.article.findFirst({
      where: { slug, id: { not: id } },
    })
    if (slugTaken) throw new HTTPException(409, { message: "Slug sudah digunakan" })
    data.title = input.title
    data.slug = slug
  }

  if (input.excerpt !== undefined) data.excerpt = input.excerpt
  if (input.content !== undefined) data.content = input.content as Prisma.InputJsonValue
  if (input.date !== undefined) data.date = new Date(input.date)

  if (input.imageId !== undefined) {
    await assertImageExists(input.imageId)
    data.image = { connect: { id: input.imageId } }
  }

  if (input.categoryId !== undefined) {
    if (input.categoryId === null || input.categoryId === "") {
      data.category = { disconnect: true }
    } else {
      const category = await db.category.findUnique({ where: { id: input.categoryId } })
      if (!category) throw new HTTPException(400, { message: "Kategori tidak ditemukan" })
      data.category = { connect: { id: input.categoryId } }
    }
  }

  if (input.authorId !== undefined) {
    const author = await db.user.findUnique({ where: { id: input.authorId } })
    if (!author) throw new HTTPException(400, { message: "Penulis tidak ditemukan" })
    data.author = { connect: { id: input.authorId } }
  }

  // Publish transition logic: false→true sets publishedAt to now
  if (input.published !== undefined && input.published !== existing.published) {
    data.published = input.published
    if (input.published === true) {
      data.publishedAt = new Date()
    }
  }

  return db.article.update({
    where: { id },
    data,
    include: includeList,
  })
}

export async function deleteArticle(id: string) {
  const existing = await db.article.findUnique({ where: { id } })
  if (!existing) throw new HTTPException(404, { message: "Artikel tidak ditemukan" })

  await db.article.delete({ where: { id } })
}
```

Notes:
- `content` cast to `Prisma.InputJsonValue` for type compatibility (check dest for exact pattern — dest doesn't have Json column; this is the standard Prisma pattern).
- `includeList` includes `author` + `category` for list AND detail. No separate detail include needed.
- `getRelatedArticles`: same-category first up to `limit`, then fill from others.
- Publish transition: only updates `publishedAt` when going false→true (per Q40). Re-publishing after unpublish overwrites the timestamp.
- `categoryId === ""` treated as disconnect (handle frontend sending empty string for "no category").

## Step 5 — `backend/src/modules/article/article.route.ts`

Mirror `destination/destination.route.ts` exactly. Public routes first, then `.use(requireAuth)`, then admin routes. Note related endpoint is under `/slug/:slug/` namespace to avoid `/:id` conflict.

```ts
import { Hono } from "hono"

import { requireAuth } from "backend/middlewares/require-auth"
import { sValidator } from "backend/middlewares/validator-wrapper"
import {
  articleQuerySchema,
  articleRelatedQuerySchema,
  createArticleSchema,
  updateArticleSchema,
} from "backend/modules/article/article.schema"
import {
  createArticle,
  deleteArticle,
  getArticle,
  getArticleBySlug,
  getRelatedArticles,
  listArticles,
  updateArticle,
} from "backend/modules/article/article.service"
import { paramIdSchema } from "backend/schemas/param.schema"
import { successResponse } from "backend/utils/response"

const articleRoute = new Hono()
  // ── Public ──────────────────────────────────────────────
  .get("/", sValidator("query", articleQuerySchema), async (c) => {
    const query = c.req.valid("query")
    const result = await listArticles(query)
    return c.json(successResponse(result, "ok"))
  })
  .get("/slug/:slug", async (c) => {
    const slug = c.req.param("slug")
    const article = await getArticleBySlug(slug)
    return c.json(successResponse(article, "ok"))
  })
  .get("/slug/:slug/related", sValidator("query", articleRelatedQuerySchema), async (c) => {
    const slug = c.req.param("slug")
    const query = c.req.valid("query")
    const related = await getRelatedArticles(slug, query.limit)
    return c.json(successResponse(related, "ok"))
  })
  .get("/:id", sValidator("param", paramIdSchema), async (c) => {
    const param = c.req.valid("param")
    const article = await getArticle(param.id)
    return c.json(successResponse(article, "ok"))
  })

  // ── Protected ───────────────────────────────────────────
  .use(requireAuth)
  .post("/", sValidator("json", createArticleSchema), async (c) => {
    const json = c.req.valid("json")
    const article = await createArticle(json)
    return c.json(successResponse(article, "Artikel berhasil dibuat"), 201)
  })
  .patch(
    "/:id",
    sValidator("param", paramIdSchema),
    sValidator("json", updateArticleSchema),
    async (c) => {
      const param = c.req.valid("param")
      const json = c.req.valid("json")
      const article = await updateArticle(param.id, json)
      return c.json(successResponse(article, "Artikel berhasil diperbarui"))
    },
  )
  .delete("/:id", sValidator("param", paramIdSchema), async (c) => {
    const param = c.req.valid("param")
    await deleteArticle(param.id)
    return c.json(successResponse(null, "Artikel berhasil dihapus"))
  })

export default articleRoute
```

## Step 6 — `backend/src/modules/category/category.schema.ts`

```ts
import * as v from "valibot"

export const createCategorySchema = v.object({
  name: v.pipe(
    v.string(),
    v.minLength(1, "Nama harus diisi"),
    v.maxLength(100, "Nama maksimal 100 karakter"),
  ),
})

export const updateCategorySchema = v.partial(createCategorySchema)

export type CreateCategoryInput = v.InferInput<typeof createCategorySchema>
export type CreateCategoryOutput = v.InferOutput<typeof createCategorySchema>
export type UpdateCategoryInput = v.InferInput<typeof updateCategorySchema>
```

## Step 7 — `backend/src/modules/category/category.service.ts`

```ts
import { HTTPException } from "hono/http-exception"

import { db } from "backend/lib/db"
import { toSlug } from "backend/lib/slug"
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "backend/modules/category/category.schema"

export async function listCategories() {
  return db.category.findMany({
    orderBy: { name: "asc" },
  })
}

export async function getCategory(id: string) {
  const category = await db.category.findUnique({ where: { id } })
  if (!category) throw new HTTPException(404, { message: "Kategori tidak ditemukan" })
  return category
}

export async function getCategoryBySlug(slug: string) {
  const category = await db.category.findUnique({ where: { slug } })
  if (!category) throw new HTTPException(404, { message: "Kategori tidak ditemukan" })
  return category
}

export async function createCategory(input: CreateCategoryInput) {
  const slug = toSlug(input.name)

  const existingSlug = await db.category.findUnique({ where: { slug } })
  if (existingSlug) throw new HTTPException(409, { message: "Slug sudah digunakan" })

  return db.category.create({
    data: {
      name: input.name,
      slug,
    },
  })
}

export async function updateCategory(id: string, input: UpdateCategoryInput) {
  const existing = await db.category.findUnique({ where: { id } })
  if (!existing) throw new HTTPException(404, { message: "Kategori tidak ditemukan" })

  const data: { name?: string; slug?: string } = {}

  if (input.name !== undefined) {
    const slug = toSlug(input.name)
    const slugTaken = await db.category.findFirst({
      where: { slug, id: { not: id } },
    })
    if (slugTaken) throw new HTTPException(409, { message: "Slug sudah digunakan" })
    data.name = input.name
    data.slug = slug
  }

  return db.category.update({
    where: { id },
    data,
  })
}

export async function deleteCategory(id: string) {
  const existing = await db.category.findUnique({ where: { id } })
  if (!existing) throw new HTTPException(404, { message: "Kategori tidak ditemukan" })

  // Article.categoryId SetNull on cascade (Prisma schema handles it)
  await db.category.delete({ where: { id } })
}
```

## Step 8 — `backend/src/modules/category/category.route.ts`

```ts
import { Hono } from "hono"

import { requireAuth } from "backend/middlewares/require-auth"
import { sValidator } from "backend/middlewares/validator-wrapper"
import {
  createCategorySchema,
  updateCategorySchema,
} from "backend/modules/category/category.schema"
import {
  createCategory,
  deleteCategory,
  getCategory,
  getCategoryBySlug,
  listCategories,
  updateCategory,
} from "backend/modules/category/category.service"
import { paramIdSchema } from "backend/schemas/param.schema"
import { successResponse } from "backend/utils/response"

const categoryRoute = new Hono()
  // ── Public ──────────────────────────────────────────────
  .get("/", async (c) => {
    const result = await listCategories()
    return c.json(successResponse(result, "ok"))
  })
  .get("/slug/:slug", async (c) => {
    const slug = c.req.param("slug")
    const category = await getCategoryBySlug(slug)
    return c.json(successResponse(category, "ok"))
  })
  .get("/:id", sValidator("param", paramIdSchema), async (c) => {
    const param = c.req.valid("param")
    const category = await getCategory(param.id)
    return c.json(successResponse(category, "ok"))
  })

  // ── Protected ───────────────────────────────────────────
  .use(requireAuth)
  .post("/", sValidator("json", createCategorySchema), async (c) => {
    const json = c.req.valid("json")
    const category = await createCategory(json)
    return c.json(successResponse(category, "Kategori berhasil dibuat"), 201)
  })
  .patch(
    "/:id",
    sValidator("param", paramIdSchema),
    sValidator("json", updateCategorySchema),
    async (c) => {
      const param = c.req.valid("param")
      const json = c.req.valid("json")
      const category = await updateCategory(param.id, json)
      return c.json(successResponse(category, "Kategori berhasil diperbarui"))
    },
  )
  .delete("/:id", sValidator("param", paramIdSchema), async (c) => {
    const param = c.req.valid("param")
    await deleteCategory(param.id)
    return c.json(successResponse(null, "Kategori berhasil dihapus"))
  })

export default categoryRoute
```

## Step 9 — Mount routes in Hono app

Find the existing route imports + mount calls in `backend/src/app.ts` (or wherever modules are mounted — check how `destinationRoute` is registered). Add the two new modules next to the existing ones.

Pattern will look like:

```ts
import articleRoute from "backend/modules/article/article.route"
import categoryRoute from "backend/modules/category/category.route"

// ... existing mounts
app.route("/articles", articleRoute)
app.route("/categories", categoryRoute)
```

Match the existing import + mount style exactly.

## Step 10 — Verify

From project root:

```bash
pnpm --filter backend typecheck
pnpm --filter backend lint
```

Then start dev server and smoke test:

```bash
pnpm dev
```

Endpoints to hit (replace `localhost:3000` with actual port if proxied):

| Method | Path | Expected |
|---|---|---|
| GET | `/api/articles` | `{ success: true, data: { items: [], nextCursor: null } }` (empty, no seed) |
| GET | `/api/categories` | `{ success: true, data: [] }` |
| POST | `/api/admin/categories` (auth) | 201 + category row |
| GET | `/api/categories` | 200 + the new category |
| POST | `/api/admin/articles` (auth) | 201 + article row, slug auto-derived |
| GET | `/api/articles/slug/<derived-slug>` | 200 + article with image/author/category includes |
| GET | `/api/articles?search=tip` | 200 + filtered by title+excerpt |
| GET | `/api/articles?category=<slug>` | 200 + filtered by category |
| GET | `/api/articles/slug/<slug>/related?limit=3` | 200 + related array |
| PATCH | `/api/admin/articles/:id` (auth, body `{ published: true }`) | 200 + `publishedAt` populated |
| DELETE | `/api/admin/articles/:id` (auth) | 200 + null data |

If any auth route returns 401, confirm session cookie is being sent (Better Auth cookie).

## Out of Scope (Follow-up Tickets)

- Frontend refactor: replace `data.ts` consumers with API calls (`getArticleBySlug`, `getRelatedArticles`, etc.)
- Admin UI for article/category CRUD
- Image upload integration on article create (currently admin uploads image first, passes `imageId`)

## Notes

- `v.isoTimestamp()` for `date` field: client must send ISO 8601 string (`"2025-01-15T00:00:00.000Z"`). Adjust if frontend sends date-only (`"2025-01-15"`) — may need `v.pipe(v.string(), v.transform(...))` to coerce.
- `content: v.any()` — backend trusts frontend block shape. No server-side block validation. If frontend adds new block types, no server change.
- If `cursorArgs` or `toPage` don't accept the same shape as dest (check `backend/lib/paginate.ts`), mirror whatever dest uses.
- If `imageCardSelect` doesn't exist or has different field shape, check `backend/lib/prisma-fragments.ts` and use the same select keys.
- `includeList` doubles as `includeDetail` since content is a column on the row, not a relation.
