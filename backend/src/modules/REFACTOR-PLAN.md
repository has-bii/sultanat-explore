# Refactor Plan — image / destination / attraction modules

Scope: ONLY `backend/src/modules/{image,destination,attraction}/*` + small
shared helpers under `backend/src/{schemas,lib,utils}`. No DB schema changes.
No route path changes (keep `app.ts` mounts intact). Behavior stays the same;
this is structural cleanup + dedup.

---

## 1. Problems found (review)

### A. Duplicated cursor-pagination logic (3x)
`listImages`, `listDestinations`, `listAttractions` each repeat the same block:
```ts
const take = Math.min(limit, 100) + 1
... findMany({ take, ...(cursor ? { cursor:{id:cursor}, skip:1 } : {}), orderBy:{[sort]:order} })
const data = rows.slice(0, Math.min(limit,100))
const nextCursor = rows.length > Math.min(limit,100) ? data.at(-1).id : null
return { data, nextCursor }
```
`Math.min(limit,100)` computed 2–3x per fn. Bug-prone, copy-pasted.

### B. Query schema inconsistency
- `image` + `destination` use shared `querySchema` (limit default `"10"`, **no
  `v.fallback`** → bad query string can 400).
- `attraction` defines its **own inline query schema** with `v.fallback` (more
  robust) but duplicates `cursor`/`limit` fields instead of extending shared.
- Three different shapes for the same concept.

### C. Param schemas defined inside route file (attraction)
`attraction.route.ts` declares `listParamsSchema` + `idParamsSchema` inline and
imports `* as v from "valibot"` → violates BACKEND.md ("schemas live in
`.schema.ts`"). Route file should not import valibot.

### D. Image-exists validation duplicated (4x)
`assertImageExists`-style check (`findUnique` → 400 "Gambar tidak ditemukan")
copy-pasted in: `createDestination`, `updateDestination`, `createAttraction`,
`updateAttraction`.

### E. Image reference-check duplicated (2x)
`deleteImage` and `bulkDeleteImages` both hand-roll the same 3-way
`Promise.all` reference count across `destination` / `attraction` /
`destinationImage`. One source of truth needed.

### F. Gallery query duplicated (2x)
The `destinationImage.findMany({ orderBy:{order:asc}, include:{image:...} })`
block appears in both `getDestinationGallery` and the return of `syncGallery`.

### G. Repeated image-select fragment
`{ select: { id:true, url:true, blurHash:true } }` literal is repeated ~7x
across destination + attraction includes. Should be one shared const.

### H. Inconsistent type-export naming
- `attraction.schema`: `AttractionQueryInput = v.InferOutput<...>` (named
  "Input" but is Output) and missing the matching Output type.
- `image`/`destination` export both Input + Output. attraction is partial.

### I. Inconsistent error handling for R2 deletes
`deleteImage` throws 500 on R2 failure; `bulkDeleteImages` swallows with
`console.error` + `eslint-disable`. Pick one logging strategy.

### J. Formatting drift
`attraction.schema.ts` has long unwrapped lines (not prettier-conform vs the
other two). Run prettier after edits.

---

## 2. Target shared helpers (create these first)

### 2.1 `backend/src/schemas/query.schema.ts` — harden + extend
Replace the legacy `querySchema` with a `fallback`-based version and a builder
so each module composes sort/order/search without re-declaring cursor/limit.

```ts
import * as v from "valibot"

export const cursorPaginationSchema = v.object({
  cursor: v.fallback(v.optional(v.pipe(v.string(), v.uuid("Invalid cursor"))), undefined),
  limit: v.fallback(v.pipe(v.string(), v.toNumber(), v.minValue(10), v.maxValue(100)), 10),
})

export type CursorPaginationOutput = v.InferOutput<typeof cursorPaginationSchema>
```
- **Blast radius confirmed (grep done):** `querySchema` is imported ONLY by
  `image.schema.ts` + `destination.schema.ts` — both in scope. attraction uses
  its own inline schema. → safe to fully replace `querySchema`; no alias needed.
- Note: this makes `limit` a `number` (not string `"10"`) everywhere → drop the
  `Math.min(limit, 100)` re-caps since schema already enforces max 100.

### 2.2 `backend/src/lib/paginate.ts` — cursor-pagination helper
```ts
export interface CursorArgs { cursor?: string; limit: number }

/** Returns prisma findMany args fragment for cursor pagination (fetches limit+1). */
export function cursorArgs({ cursor, limit }: CursorArgs) {
  return {
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  }
}

/** Splits an over-fetched (limit+1) row array into page data + nextCursor. */
export function toPage<T extends { id: string }>(rows: T[], limit: number) {
  const data = rows.slice(0, limit)
  const nextCursor = rows.length > limit ? data[data.length - 1].id : null
  return { data, nextCursor }
}
```
Each `listX` becomes: build `where` → `findMany({ ...cursorArgs(p), where,
orderBy, include })` → `return toPage(rows, p.limit)`.

### 2.3 `backend/src/modules/image/image.refs.ts` (or in image.service)
```ts
/** Returns the set of imageIds (from the given candidates) still referenced
 *  by destination / attraction / destinationImage. */
export async function findReferencedImageIds(ids: string[]): Promise<Set<string>> {
  const [dest, attr, gallery] = await Promise.all([
    db.destination.findMany({ where: { imageId: { in: ids } }, select: { imageId: true } }),
    db.attraction.findMany({ where: { imageId: { in: ids } }, select: { imageId: true } }),
    db.destinationImage.findMany({ where: { imageId: { in: ids } }, select: { imageId: true } }),
  ])
  return new Set([...dest, ...attr, ...gallery].map((r) => r.imageId))
}
```
- `deleteImage`: `const refs = await findReferencedImageIds([id]); if (refs.size) throw 400`.
- `bulkDeleteImages`: `const refs = await findReferencedImageIds(ids)` then filter.

### 2.4 `assertImageExists` helper (in image.service, exported)
```ts
export async function assertImageExists(id: string) {
  const img = await db.image.findUnique({ where: { id }, select: { id: true } })
  if (!img) throw new HTTPException(400, { message: "Gambar tidak ditemukan" })
}
```
Use in destination + attraction create/update.

### 2.5 Shared prisma select fragment
Add `backend/src/lib/prisma-fragments.ts`:
```ts
export const imageCardSelect = { id: true, url: true, blurHash: true } as const
```
Reuse in every `image: { select: imageCardSelect }`.

---

## 3. Per-file changes

### `schemas/query.schema.ts`
- [ ] Add `cursorPaginationSchema` + `CursorPaginationOutput` (§2.1).
- [ ] `grep -rn "querySchema" backend/src` — migrate the 3 in-scope modules; only
      keep legacy alias if an out-of-scope file still imports it.

### `lib/paginate.ts` (new)
- [ ] Add `cursorArgs` + `toPage` (§2.2).

### `lib/prisma-fragments.ts` (new)
- [ ] Add `imageCardSelect` (§2.5).

### image module
- [ ] `image.schema.ts`: build `imageQuerySchema` from `cursorPaginationSchema`
      instead of `querySchema`. Keep `order/sort/search`. Trim unused
      `InferInput`/`InferOutput` pairs to what's actually consumed.
- [ ] `image.service.ts`:
  - [ ] add `assertImageExists` + `findReferencedImageIds` (exported).
  - [ ] `listImages`: use `cursorArgs` + `toPage`; drop `Math.min(limit,100)`.
  - [ ] `deleteImage` + `bulkDeleteImages`: use `findReferencedImageIds`.
  - [ ] Decide R2-failure policy: keep bulk = best-effort (log), single = throw.
        Replace raw `console.error`/eslint-disable with a tiny `lib/logger.ts`
        wrapper OR keep but document why. (Pick logger for consistency.)
  - [ ] `updateImage`: existence check then update — fine, leave.
- [ ] `image.route.ts`: no change needed (already convention-clean). Verify
      handler order (public GET before `requireAuth`) stays.

### destination module
- [ ] `destination.schema.ts`: build `destinationQuerySchema` from
      `cursorPaginationSchema`. Keep `featured` transform, `sort`, `order`,
      `search`.
- [ ] `destination.service.ts`:
  - [ ] `includeDetail`/`includeList`: use `imageCardSelect`.
  - [ ] `listDestinations`: `cursorArgs` + `toPage`; drop re-caps.
  - [ ] `createDestination` + `updateDestination`: replace inline image lookup
        with `assertImageExists(input.imageId)`.
  - [ ] Extract gallery read into local `findGallery(destinationId)` and reuse
        in `getDestinationGallery` + `syncGallery` return (§2.6/F).
- [ ] `destination.route.ts`: no path change. Leave as-is.

### attraction module
- [ ] `attraction.schema.ts`:
  - [ ] Move `listParamsSchema` (`destinationId`) + `idParamsSchema`
        (`destinationId` + `id`) **out of the route file into here**. Name them
        e.g. `attractionListParamSchema` / `attractionIdParamSchema`.
  - [ ] Rebuild `attractionQuerySchema` from `cursorPaginationSchema` (removes
        the duplicated cursor/limit fallback fields).
  - [ ] Fix type exports: `AttractionQueryOutput = v.InferOutput<...>`; keep
        `...Input` as `InferInput`. Update service import accordingly.
  - [ ] Reflow long lines (prettier).
- [ ] `attraction.route.ts`:
  - [ ] Remove `import * as v from "valibot"` and the two inline param schemas;
        import them from `attraction.schema`.
  - [ ] Handlers otherwise unchanged.
- [ ] `attraction.service.ts`:
  - [ ] `include`: use `imageCardSelect`.
  - [ ] `listAttractions`: `cursorArgs` + `toPage`; drop `pageSize`/`Math.min`.
  - [ ] `createAttraction` + `updateAttraction`: use `assertImageExists`.
  - [ ] Param type `AttractionQueryInput` → `AttractionQueryOutput`.

---

## 4. Execution order (do in this sequence)

1. Create shared helpers: `lib/paginate.ts`, `lib/prisma-fragments.ts`,
   harden `schemas/query.schema.ts`, optional `lib/logger.ts`.
2. `grep -rn "querySchema\b" backend/src` → confirm blast radius before edits.
3. image module (schema → service → route).
4. destination module.
5. attraction module.
6. Add image-service exports (`assertImageExists`, `findReferencedImageIds`)
   before wiring destination/attraction to them (import direction:
   destination/attraction → image is allowed; image must NOT import them).
7. `npx tsc --noEmit` (from backend workspace).
8. `pnpm lint` + `npx prettier --write backend/src/modules`.

---

## 5. Guardrails / non-goals

- DO NOT change route paths, HTTP methods, response envelope, or Indonesian
  messages — pure refactor, API contract identical.
- DO NOT touch `prisma/schema.prisma` or run migrations.
- DO NOT add new endpoints.
- Keep `successResponse`/`errorResponse` usage.
- Watch import cycles: `image.service` is the lowest layer (no imports from
  destination/attraction). destination/attraction MAY import image helpers.
- After migrating `querySchema`, ensure no out-of-scope module breaks (grep).

## 6. Verification checklist

- [ ] `npx tsc --noEmit` clean.
- [ ] `pnpm lint` clean (no eslint-disable left unless justified).
- [ ] Pagination: limit+1 fetch, slice, nextCursor identical behavior.
- [ ] Reference-protected delete still 400s when image in use.
- [ ] Gallery sync still full-replace in a transaction.
- [ ] Manual: list/get/create/update/delete each module returns same shapes.
