import * as v from "valibot"

import { cursorPaginationSchema } from "backend/schemas/query.schema"

// ── Nested child schemas ────────────────────────────────────

const openTripDestinationInputSchema = v.object({
  destinationId: v.pipe(v.string(), v.uuid("ID destinasi tidak valid")),
  visitAt: v.pipe(v.string(), v.isoTimestamp("visitAt harus ISO timestamp")),
})

const openTripCityInputSchema = v.object({
  cityId: v.pipe(v.string(), v.uuid("ID kota tidak valid")),
  arriveAt: v.pipe(v.string(), v.isoTimestamp("arriveAt harus ISO timestamp")),
  departAt: v.optional(v.pipe(v.string(), v.isoTimestamp("departAt harus ISO timestamp"))),
  destinations: v.optional(v.array(openTripDestinationInputSchema), []),
})

const openTripInclusionInputSchema = v.object({
  inclusionItemId: v.pipe(v.string(), v.uuid("ID inclusion item tidak valid")),
  type: v.picklist(["include", "exclude"]),
})

// ── Create / Update ─────────────────────────────────────────

export const createOpenTripSchema = v.object({
  slug: v.pipe(
    v.string(),
    v.minLength(1, "Slug harus diisi"),
    v.maxLength(200, "Slug maksimal 200 karakter"),
    v.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug harus URL-friendly (huruf kecil, angka, dash)"),
  ),
  title: v.pipe(v.string(), v.minLength(1, "Judul harus diisi"), v.maxLength(200, "Judul maksimal 200 karakter")),
  excerpt: v.pipe(v.string(), v.minLength(1, "Ringkasan harus diisi"), v.maxLength(300, "Ringkasan maksimal 300 karakter")),
  description: v.any(), // opaque JSON — frontend owns block shapes
  price: v.pipe(v.number(), v.minValue(1, "Harga harus lebih dari 0")),
  coverImageId: v.pipe(v.string(), v.uuid("ID gambar tidak valid")),
  startAt: v.optional(v.pipe(v.string(), v.isoTimestamp("startAt harus ISO timestamp"))),
  endAt: v.optional(v.pipe(v.string(), v.isoTimestamp("endAt harus ISO timestamp"))),
  status: v.optional(v.picklist(["draft", "published", "archived"]), "draft"),
  cities: v.optional(v.array(openTripCityInputSchema), []),
  inclusions: v.optional(v.array(openTripInclusionInputSchema), []),
})

export const updateOpenTripSchema = v.object({
  slug: v.optional(
    v.pipe(
      v.string(),
      v.minLength(1, "Slug harus diisi"),
      v.maxLength(200, "Slug maksimal 200 karakter"),
      v.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug harus URL-friendly (huruf kecil, angka, dash)"),
    ),
  ),
  title: v.optional(v.pipe(v.string(), v.minLength(1, "Judul harus diisi"), v.maxLength(200, "Judul maksimal 200 karakter"))),
  excerpt: v.optional(v.pipe(v.string(), v.minLength(1, "Ringkasan harus diisi"), v.maxLength(300, "Ringkasan maksimal 300 karakter"))),
  description: v.optional(v.any()),
  price: v.optional(v.pipe(v.number(), v.minValue(1, "Harga harus lebih dari 0"))),
  coverImageId: v.optional(v.pipe(v.string(), v.uuid("ID gambar tidak valid"))),
  startAt: v.optional(v.pipe(v.string(), v.isoTimestamp("startAt harus ISO timestamp"))),
  endAt: v.optional(v.pipe(v.string(), v.isoTimestamp("endAt harus ISO timestamp"))),
  status: v.optional(v.picklist(["draft", "published", "archived"])),
  cities: v.optional(v.array(openTripCityInputSchema)),
  inclusions: v.optional(v.array(openTripInclusionInputSchema)),
})

// ── Query / List ────────────────────────────────────────────

export const openTripQuerySchema = v.object({
  ...cursorPaginationSchema.entries,
  status: v.optional(v.picklist(["draft", "published", "archived"])),
  startAtFrom: v.optional(v.pipe(v.string(), v.isoTimestamp("startAtFrom harus ISO timestamp"))),
  startAtTo: v.optional(v.pipe(v.string(), v.isoTimestamp("startAtTo harus ISO timestamp"))),
  priceMin: v.optional(v.pipe(v.string(), v.toNumber(), v.minValue(0))),
  priceMax: v.optional(v.pipe(v.string(), v.toNumber(), v.minValue(0))),
  sort: v.optional(v.picklist(["startAt", "price", "publishedAt"]), "startAt"),
  order: v.optional(v.picklist(["asc", "desc"]), "asc"),
})

export const openTripSlugParamSchema = v.object({
  slug: v.pipe(v.string(), v.minLength(1, "Slug harus diisi")),
})

// ── Inferred types ──────────────────────────────────────────

export type CreateOpenTripInput = v.InferInput<typeof createOpenTripSchema>
export type CreateOpenTripOutput = v.InferOutput<typeof createOpenTripSchema>
export type UpdateOpenTripInput = v.InferInput<typeof updateOpenTripSchema>
export type OpenTripQueryInput = v.InferInput<typeof openTripQuerySchema>
export type OpenTripQueryOutput = v.InferOutput<typeof openTripQuerySchema>
