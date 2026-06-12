# Backend Feature Guide

Step-by-step guide for implementing new CRUD features in `backend/`.

---

## File Structure

Every backend feature follows this pattern:

```
backend/src/
├── modules/<domain>/
│   ├── <domain>.route.ts     # Hono route handlers
│   ├── <domain>.service.ts   # Business logic
│   └── <domain>.schema.ts   # Valibot validation schemas
├── middlewares/               # Shared (require-auth, validator-wrapper)
├── schemas/                  # Shared (param.schema, query.schema)
├── utils/                    # Shared helpers (response.ts)
└── lib/                      # Shared (db, auth, r2, etc.)
```

---

## Step 1: Prisma Schema

Add model to `prisma/schema.prisma`:

```prisma
model <Model> {
  id        String   @id @db.Uuid @default(uuid(7))
  // fields...
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("<model_name>")
}
```

Run migration:

```bash
pnpm --filter backend exec prisma migrate dev --name <migration-name>
pnpm --filter backend db:generate
```

---

## Step 2: Valibot Schemas

Create `backend/src/modules/<domain>/<domain>.schema.ts`:

```ts
import * as v from "valibot"

export const create<Model>Schema = v.object({
  name: v.pipe(v.string(), v.minLength(1)),
  // fields...
})

export const update<Model>Schema = v.object({
  name: v.pipe(v.string(), v.minLength(1)),
  // only fields allowed to update
})

export type Create<Model>Input = v.InferOutput<typeof create<Model>Schema>
export type Update<Model>Input = v.InferOutput<typeof update<Model>Schema>
```

**Rules:**
- Named `<Name>Schema` (PascalCase)
- Export inferred types alongside
- One schema file per feature
- Import as `import * as v from "valibot"`

---

## Step 3: Service

Create `backend/src/modules/<domain>/<domain>.service.ts`:

```ts
import { HTTPException } from "hono/http-exception"
import { db } from "backend/lib/db"
import type { Create<Model>Input, Update<Model>Input } from "backend/modules/<domain>/<domain>.schema"

export async function create<Model>(input: Create<Model>Input) {
  return db.<model>.create({ data: input })
}

export async function list<Model>s(cursor?: string, limit = 20) {
  const take = Math.min(limit, 100) + 1

  const items = await db.<model>.findMany({
    take,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    orderBy: { createdAt: "desc" },
  })

  const data = items.slice(0, Math.min(limit, 100))
  const nextCursor = items.length > Math.min(limit, 100) ? data[data.length - 1].id : null

  return { data, nextCursor }
}

export async function get<Model>(id: string) {
  const item = await db.<model>.findUnique({ where: { id } })
  if (!item) throw new HTTPException(404, { message: "<Model> not found" })
  return item
}

export async function update<Model>(id: string, input: Update<Model>Input) {
  const existing = await db.<model>.findUnique({ where: { id } })
  if (!existing) throw new HTTPException(404, { message: "<Model> not found" })

  return db.<model>.update({ where: { id }, data: input })
}

export async function delete<Model>(id: string) {
  const existing = await db.<model>.findUnique({ where: { id } })
  if (!existing) throw new HTTPException(404, { message: "<Model> not found" })

  await db.<model>.delete({ where: { id } })
}
```

**Rules:**
- One exported function per operation
- Throw `HTTPException` with specific status + message
- Service owns full flow (DB + external ops)
- Cursor pagination: fetch `limit + 1`, slice to determine `nextCursor`

---

## Step 4: Routes

Create `backend/src/modules/<domain>/<domain>.route.ts`:

```ts
import { Hono } from "hono"
import { requireAuth } from "backend/middlewares/require-auth"
import { sValidator } from "backend/middlewares/validator-wrapper"
import { successResponse } from "backend/utils/response"
import { paramIdSchema } from "backend/schemas/param.schema"
import { querySchema } from "backend/schemas/query.schema"
import { create<Model>Schema, update<Model>Schema } from "backend/modules/<domain>/<domain>.schema"
import { create<Model>, list<Model>s, get<Model>, update<Model>, delete<Model> } from "backend/modules/<domain>/<domain>.service"

const <domain>Route = new Hono()
  // Public routes (before requireAuth)
  .get("/", sValidator("query", querySchema), async (c) => {
    const query = c.req.valid("query")
    const result = await list<Model>s(query.cursor, query.limit)
    return c.json(successResponse(result, "<Model>s fetched successfully"))
  })
  .get("/:id", sValidator("param", paramIdSchema), async (c) => {
    const param = c.req.valid("param")
    const item = await get<Model>(param.id)
    return c.json(successResponse(item, "<Model> fetched successfully"))
  })
  // Auth-required routes
  .use(requireAuth)
  .post("/", sValidator("json", create<Model>Schema), async (c) => {
    const body = c.req.valid("json")
    const item = await create<Model>(body)
    return c.json(successResponse(item, "<Model> created successfully"), 201)
  })
  .patch("/:id", sValidator("param", paramIdSchema), sValidator("json", update<Model>Schema), async (c) => {
    const param = c.req.valid("param")
    const body = c.req.valid("json")
    const item = await update<Model>(param.id, body)
    return c.json(successResponse(item, "<Model> updated successfully"))
  })
  .delete("/:id", sValidator("param", paramIdSchema), async (c) => {
    const param = c.req.valid("param")
    await delete<Model>(param.id)
    return c.json(successResponse(null, "<Model> deleted successfully"))
  })

export default <domain>Route
```

**Rules:**
- Chain routes with `.get()`, `.post()`, etc.
- Public routes BEFORE `.use(requireAuth)`
- Auth-required routes AFTER `.use(requireAuth)`
- Use `sValidator(target, schema)` — never manual `safeParse`
- Use `c.req.valid(target)` to get validated data
- Wrap all responses with `successResponse(data, msg)` — never raw `c.json(data)`
- Delete routes return `c.json(successResponse(null, "..."), 200)` to keep envelope uniform

---

## Step 5: Register Route

Add to `backend/src/app.ts`:

```ts
import <domain>Route from "backend/modules/<domain>/<domain>.route"

// After auth middleware, before other routes:
app.route("/", <domain>Route)
```

Route paths are defined in the route file (e.g., `/<domain>`). The `app.route("/", ...)` mounting means the route file's paths are absolute from `/api`.

---

## Step 6: Add Dependencies

If the feature needs external packages:

```bash
pnpm --filter backend add <package>
```

Common additions:
- `sharp` — image processing
- `blurhash` — placeholder generation
- `@aws-sdk/client-s3` — R2/S3 storage
- `valibot` — validation (already installed)

---

## Auth Pattern

Two context types in `backend/src/app.type.ts`:

- **`AppContext`** — nullable `user`/`session`. Use for routes with mixed public/auth.
- **`AppAuthContext`** — guaranteed `user`/`session`. Use for fully protected routes.

`requireAuth` middleware narrows `AppContext` → `AppAuthContext`:

```ts
.use(requireAuth) // after this, c.get("user") is guaranteed non-null
```

---

## Shared Schemas

Reuse from `backend/src/schemas/`:

| Schema | File | Usage |
|---|---|---|
| `paramIdSchema` | `param.schema.ts` | `{ id: v.pipe(v.string(), v.uuid()) }` |
| `querySchema` | `query.schema.ts` | `{ cursor?: uuid, limit: 10-100 }` |

Extend if needed:

```ts
const myParamSchema = v.object({
  ...paramIdSchema.entries,
  slug: v.string(),
})
```

---

## Checklist

- [ ] Prisma schema updated + migration run
- [ ] Valibot schemas created with inferred types
- [ ] Service file with CRUD functions
- [ ] Route file with chained routes
- [ ] Public routes before `requireAuth`
- [ ] Auth routes after `requireAuth`
- [ ] Route registered in `app.ts`
- [ ] All responses wrapped with `successResponse()` — no raw `c.json(data)`
- [ ] `pnpm --filter backend typecheck` passes
- [ ] CORS updated if new HTTP methods needed (PATCH, etc.)
