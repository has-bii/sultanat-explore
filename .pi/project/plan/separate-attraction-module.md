# Plan: Separate Attraction Module from Destination

## Goal
Move attraction routes from nested under destination to top-level.

**Before:** `/destinations/:destinationId/attractions`
**After:** `/attractions`

---

## File Changes

### 1. `backend/src/app.ts`
- Line ~53: Change `.route("/destinations/:destinationId/attractions", attractionRoute)` → `.route("/attractions", attractionRoute)`

---

### 2. `backend/src/modules/attraction/attraction.schema.ts`

**Remove:**
- `attractionListParamSchema` (no longer need URL param)
- `destinationId` from `attractionIdParamSchema` → only `{ id }`

**Modify:**
- `attractionIdParamSchema` → only `{ id: v.pipe(v.string(), v.uuid("Invalid id")) }`

**Add:**
- `destinationId` to `createAttractionSchema`:
  ```ts
  destinationId: v.pipe(v.string(), v.uuid("ID destinasi tidak valid")),
  ```
- `destinationId` optional query param to `attractionQuerySchema`:
  ```ts
  destinationId: v.optional(v.pipe(v.string(), v.uuid("ID destinasi tidak valid"))),
  ```

**Update types:**
- `CreateAttractionInput` will now include `destinationId`
- `AttractionQueryOutput` will now include optional `destinationId`

---

### 3. `backend/src/modules/attraction/attraction.route.ts`

**Remove:**
- Import `attractionListParamSchema`
- All `sValidator("param", attractionListParamSchema)` calls

**Modify:**

#### List (`GET /`)
```ts
.get(
  "/",
  sValidator("query", attractionQuerySchema),
  async (c) => {
    const query = c.req.valid("query")
    const result = await listAttractions(query)
    return c.json(successResponse(result, "ok"))
  },
)
```

#### Get single (`GET /:id`)
```ts
.get("/:id", sValidator("param", attractionIdParamSchema), async (c) => {
  const { id } = c.req.valid("param")
  const attraction = await getAttraction(id)
  return c.json(successResponse(attraction, "ok"))
})
```

#### Create (`POST /`)
```ts
.post(
  "/",
  sValidator("json", createAttractionSchema),
  async (c) => {
    const json = c.req.valid("json")
    const attraction = await createAttraction(json)
    return c.json(successResponse(attraction, "Atraksi berhasil dibuat"), 201)
  },
)
```

#### Update (`PATCH /:id`)
```ts
.patch(
  "/:id",
  sValidator("param", attractionIdParamSchema),
  sValidator("json", updateAttractionSchema),
  async (c) => {
    const { id } = c.req.valid("param")
    const json = c.req.valid("json")
    const attraction = await updateAttraction(id, json)
    return c.json(successResponse(attraction, "Atraksi berhasil diperbarui"))
  },
)
```

#### Delete (`DELETE /:id`)
```ts
.delete("/:id", sValidator("param", attractionIdParamSchema), async (c) => {
  const { id } = c.req.valid("param")
  await deleteAttraction(id)
  return c.json(successResponse(null, "Atraksi berhasil dihapus"))
})
```

---

### 4. `backend/src/modules/attraction/attraction.service.ts`

#### `listAttractions`
```ts
export async function listAttractions(params: AttractionQueryOutput) {
  const { cursor, limit, search, sort, order, destinationId } = params

  const where = {
    ...(destinationId ? { destinationId } : {}),
    ...(search ? { name: { startsWith: search, mode: "insensitive" as const } } : {}),
  }
  // ... rest same
}
```

#### `getAttraction`
```ts
export async function getAttraction(id: string) {
  const attraction = await db.attraction.findFirst({
    where: { id },
    include,
  })
  if (!attraction) throw new HTTPException(404, { message: "Atraksi tidak ditemukan" })
  return attraction
}
```

#### `createAttraction`
```ts
export async function createAttraction(input: CreateAttractionInput) {
  const destination = await db.destination.findUnique({
    where: { id: input.destinationId },
  })
  if (!destination) throw new HTTPException(404, { message: "Destinasi tidak ditemukan" })

  await assertImageExists(input.imageId)

  return db.attraction.create({
    data: {
      name: input.name,
      description: input.description,
      imageId: input.imageId,
      destinationId: input.destinationId,
    },
    include,
  })
}
```

#### `updateAttraction`
```ts
export async function updateAttraction(id: string, input: UpdateAttractionInput) {
  const existing = await db.attraction.findFirst({
    where: { id },
  })
  if (!existing) throw new HTTPException(404, { message: "Atraksi tidak ditemukan" })

  if (input.imageId) {
    await assertImageExists(input.imageId)
  }

  return db.attraction.update({
    where: { id },
    data: {
      name: input.name,
      description: input.description,
      ...(input.imageId && { imageId: input.imageId }),
    },
    include,
  })
}
```

#### `deleteAttraction`
```ts
export async function deleteAttraction(id: string) {
  const existing = await db.attraction.findFirst({
    where: { id },
  })
  if (!existing) throw new HTTPException(404, { message: "Atraksi tidak ditemukan" })

  return db.attraction.delete({ where: { id } })
}
```

---

## API Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/attractions` | List all (optional `?destinationId=xxx` filter) |
| GET | `/api/attractions/:id` | Get single |
| POST | `/api/attractions` | Create (destinationId in body) |
| PATCH | `/api/attractions/:id` | Update |
| DELETE | `/api/attractions/:id` | Delete |

---

## Notes
- No frontend changes needed (user requirement)
- No DB schema changes needed (Prisma model stays same)
- `destinationId` still required for creation, just moves from URL param to request body
- Listing supports optional `destinationId` query filter for backwards compat
