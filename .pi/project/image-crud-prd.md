# PRD: Image CRUD Backend

**Status:** Updated Draft  
**Date:** June 2026  
**Research:** ctx7 completed 2026-06-04

---

## Overview

Backend implementation for image upload, processing, and management. Images stored in Cloudflare R2, processed to WebP, served via custom domain.

---

## Current Backend State

- **Runtime:** Hono 4.x (ESM, `"type": "module"`)
- **Auth:** better-auth, all routes behind auth middleware (except `/auth/*`)
- **DB:** Prisma + Neon (Postgres), adapter `@prisma/adapter-neon`
- **Image model exists in Prisma** but missing `fileSize` + `blurHash` fields
- **No `modules/` dir yet** — only `lib/` with `auth.ts`, `db.ts`, `resend.ts`
- **Deps NOT installed:** `sharp`, `blurhash`, `@aws-sdk/client-s3`
- **Path alias:** `backend/*` → `./src/*`

---

## Research Results

### Sharp — resize + WebP

**Library ID:** `/lovell/sharp`

```ts
// Resize (maintain aspect ratio) + WebP
const buffer = await sharp(input)
  .resize({ width: 1920, withoutEnlargement: true, fit: 'inside' })
  .webp({ quality: 75, force: true })
  .toBuffer()

// Get metadata (for blurHash dimensions)
const meta = await sharp(input).metadata()
// { width, height, format, ... }

// Get raw RGBA pixels (for blurHash)
const { data, info } = await sharp(input)
  .resize({ width: 64, height: 64, fit: 'inside' })
  .raw()
  .toBuffer({ resolveWithObject: true })
// data: Buffer of RGBA pixels, info: { width, height, channels }
```

Key: `fit: 'inside'` prevents upscale + ensures no cropping. Default `fit` is `'cover'` (crops).

### BlurHash — encode from sharp RGBA buffer

**Library ID:** `/woltapp/blurhash`

```ts
import { encode } from 'blurhash'

// encode(pixels: Uint8ClampedArray, width: number, height: number, componentX: number, componentY: number): string
const hash = encode(
  new Uint8ClampedArray(rawData),
  info.width,
  info.height,
  4,  // componentX — more = more detail
  4,  // componentY
)
```

Pipeline: Resize tiny thumbnail (64×64) → `.raw()` → `new Uint8ClampedArray(buffer)` → `encode()` → store string.

### Hono — multipart file upload

**Library ID:** `/honojs/hono`

```ts
// parseBody returns FormData for multipart/form-data
const body = await c.req.parseBody<{ file: File }>()
const file = body['file']

// File is native Web API File (works in Bun/Node 20+)
const arrayBuffer = await file.arrayBuffer()
const buffer = Buffer.from(arrayBuffer)
```

No special middleware needed. `c.req.parseBody()` is the correct method for `multipart/form-data`.

### @aws-sdk/client-s3 — R2 upload/delete

**Library ID:** `/aws/aws-sdk-js-v3`

```ts
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

const client = new S3Client({
  region: 'auto',
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

// Upload
const upload = await client.send(new PutObjectCommand({
  Bucket: process.env.R2_BUCKET_NAME!,
  Key: 'images/2026/06/uuid.webp',
  Body: webpBuffer,
  ContentType: 'image/webp',
}))

// Delete
await client.send(new DeleteObjectCommand({
  Bucket: process.env.R2_BUCKET_NAME!,
  Key: 'images/2026/06/uuid.webp',
}))
```

S3Client config: `region: 'auto'` + `endpoint` with `R2_ACCOUNT_ID`. No bucket config in client.

### Zod — file validation

**Library ID:** `/colinhacks/zod`

```ts
import { z } from 'zod'

// Hono File is native File — use instanceof
const imageSchema = z.object({
  file: z.instanceof(File).refine(
    (f) => ['image/jpeg', 'image/png', 'image/webp'].includes(f.type),
    'Unsupported file type'
  ).refine(
    (f) => f.size <= 5 * 1024 * 1024,
    'File too large (max 5MB)'
  ),
})

// Or accept text fields alongside:
const bodySchema = z.object({
  alt: z.string().optional(),
})
```

---

## Dependencies to Install

```bash
pnpm add --filter backend sharp blurhash @aws-sdk/client-s3
```

---

## Tech Stack

- **Runtime:** Hono 4.x (existing)
- **Storage:** Cloudflare R2 via `@aws-sdk/client-s3`
- **Image Processing:** Sharp
- **BlurHash:** `blurhash`
- **DB:** Prisma + PostgreSQL (existing)
- **Validation:** Zod (existing in project?)

---

## Prisma Schema — Image Model Migration

**Current** (in `schema.prisma`):

```prisma
model Image {
  id        String   @id @db.Uuid @default(uuid(7))
  url       String
  alt       String?
  createdAt DateTime @default(now())
  // ...relations...
}
```

**Add 2 fields:**

```prisma
model Image {
  id        String     @id @db.Uuid @default(uuid(7))
  url       String
  alt       String?
  fileSize  Int        // bytes after reduction, required (no legacy rows)
  blurHash  String?
  createdAt DateTime   @default(now())

  destinations         Destination[]
  attractions          Attraction[]
  destinationGalleries DestinationImage[]
  attractionGalleries  AttractionImage[]

  @@map("image")
}
```

**Migration:**
```bash
pnpm --filter backend db:generate
npx prisma migrate dev --name add-image-fields
```

---

## Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/images` | Yes | Upload + create record |
| GET | `/api/images` | Yes | List images (cursor pagination) |
| GET | `/api/images/:id` | Yes | Get image detail |
| PATCH | `/api/images/:id` | Yes | Update `alt` |
| DELETE | `/api/images/:id` | Yes | Delete from R2 + DB |

---

## Upload Flow (Detailed)

1. Client sends `multipart/form-data`:
   - Field `file` — image file (required)
   - Field `alt` — alt text (optional)

2. Validate with Zod:
   - `file` must exist → 400 "No file provided"
   - `file.type` in `image/jpeg, image/png, image/webp` → 415 "Unsupported file type"
   - `file.size` ≤ 5MB → 413 "File too large"

3. Process with Sharp:
   ```ts
   const buffer = Buffer.from(await file.arrayBuffer())
   const processed = await sharp(buffer)
     .resize({ width: 1920, withoutEnlargement: true, fit: 'inside' })
     .webp({ quality: 75, force: true })
     .toBuffer()
   ```

4. Generate blurHash:
   ```ts
   const { data, info } = await sharp(buffer)
     .resize({ width: 64, height: 64, fit: 'inside' })
     .raw()
     .toBuffer({ resolveWithObject: true })
   const blurHash = encode(new Uint8ClampedArray(data), info.width, info.height, 4, 4)
   ```

5. Upload processed buffer to R2:
   - Key: `images/{year}/{month}/{uuid}.webp`
   - Content-Type: `image/webp`
   - Body: processed buffer

6. Create DB record:
   ```ts
   await db.image.create({
     data: { url, alt, fileSize: processed.length, blurHash }
   })
   ```

7. Return created image object (201)

---

## Response Format

### Create/Get Image

```json
{
  "id": "uuid",
  "url": "https://sultanat-explore-img.hasbii.online/images/2026/06/uuid.webp",
  "alt": "optional alt text",
  "fileSize": 123456,
  "blurHash": "LEHV6nWB2yk8pyo0adR*.7kCMdnj",
  "createdAt": "2026-06-04T12:00:00.000Z"
}
```

### List Images (Cursor Pagination)

```json
{
  "data": [...],
  "nextCursor": "uuid-or-null"
}
```

Query params: `?limit=20&cursor={id}`

---

## Error Handling

Use `HTTPException` (existing pattern in `app.ts`):

```ts
import { HTTPException } from 'hono/http-exception'

throw new HTTPException(400, { message: 'No file provided' })
```

| Condition | Status | Message |
|-----------|--------|---------|
| No file | 400 | "No file provided" |
| File > 5MB | 413 | "File too large" |
| Invalid type | 415 | "Unsupported file type" |
| Sharp processing fail | 500 | "Image processing failed" |
| R2 upload fail | 500 | "Upload failed" |
| R2 delete fail | 500 | "Delete failed" |
| Not found | 404 | "Image not found" |

All errors thrown via `HttpException` — `app.onError` handler in `app.ts` already catches these.

---

## R2 Config (Env Vars)

```
R2_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret
R2_BUCKET_NAME=sultanat-images
R2_PUBLIC_DOMAIN=sultanat-explore-img.hasbii.online
```

**S3Client init:**

```ts
new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})
```

---

## Auth Middleware Pattern

Existing `app.ts` wraps all routes (except `/auth/*`) with:

```ts
app.use('*', async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers })
  if (!session) throw new HTTPException(401, { message: 'Unauthorized' })
  c.set('user', session.user)
  c.set('session', session.session)
  await next()
})
```

Image routes declared after this middleware — no per-route auth needed.

---

## File Structure (Proposed)

```
backend/src/
├── lib/
│   ├── r2.ts              # S3Client init + upload/delete wrappers
│   └── image-processing.ts # Sharp resize + blurHash pipeline
├── modules/
│   └── image/
│       ├── image.route.ts   # Route handlers (Hono routes)
│       ├── image.service.ts # Business logic (R2 + DB ops)
│       └── image.schema.ts  # Zod schemas for validation
└── app.ts                 # Existing — register image routes here
```

**Registration in `app.ts`:**

```ts
import imageRoute from 'backend/modules/image/image.route'
app.route('/', imageRoute)
```

---

## Route Implementation Notes

### POST /api/images

- `c.req.parseBody<{ file: File }>()` for multipart
- Validate with Zod
- Process: sharp.resize → .webp → buffer
- blurHash: sharp.resize(64) → .raw() → encode
- Upload processed buffer to R2
- Create DB record
- Return 201 + image JSON

### GET /api/images (cursor pagination)

```ts
const cursor = c.req.query('cursor')
const limit = Math.min(Number(c.req.query('limit') ?? '20'), 100)

const images = await db.image.findMany({
  take: limit + 1,
  ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  orderBy: { createdAt: 'desc' },
})

const data = images.slice(0, limit)
const nextCursor = images.length > limit ? data[data.length - 1].id : null

return c.json({ data, nextCursor })
```

### GET /api/images/:id

- `c.req.param('id')`
- `db.image.findUnique({ where: { id } })`
- 404 if not found

### PATCH /api/images/:id

- `c.req.json<{ alt?: string }>()`
- Only `alt` field allowed to update
- 404 if not found

### DELETE /api/images/:id

- Fetch record → 404 if missing
- Parse `url` to extract R2 key
- `DeleteObjectCommand` on R2
- `db.image.delete({ where: { id } })`
- Return 204

**URL → key extraction:**

```ts
const url = new URL(image.url)
const key = url.pathname.replace(/^\//, '')  // "images/2026/06/uuid.webp"
```

---

## Dependencies to Install

```bash
pnpm add --filter backend sharp blurhash @aws-sdk/client-s3
```

---

## Acceptance Criteria

- [ ] Upload accepts jpg, jpeg, png, webp only
- [ ] Files > 5MB rejected with 413
- [ ] Images resized to max 1920px width (`fit: 'inside'`, no crop, no upscale)
- [ ] All uploads converted to WebP (quality 75)
- [ ] Original file discarded after conversion
- [ ] Files stored at `images/{year}/{month}/{uuid}.webp`
- [ ] blurHash generated for each upload (64×64 thumbnail → encode)
- [ ] fileSize reflects reduced size
- [ ] DELETE removes file from R2 + DB record
- [ ] DELETE returns 204, not 200
- [ ] PATCH only allows updating `alt` field
- [ ] PATCH rejects unknown fields
- [ ] GET /api/images returns cursor-paginated results (default 20, max 100)
- [ ] GET /api/images/:id returns 404 for missing
- [ ] All routes require authentication (inherited from app.ts middleware)
- [ ] All errors use HTTPException (existing error handler pattern)
- [ ] Prisma migration adds `fileSize` (Int?) + `blurHash` (String?) fields

---

## Resolved Decisions

- **Image URL domain:** `sultanat-explore-img.hasbii.online`
- **fileSize:** `Int` (required) — no legacy rows exist
