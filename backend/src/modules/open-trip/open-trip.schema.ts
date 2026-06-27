import * as v from "valibot"

import { cursorPaginationSchema } from "backend/schemas/query.schema"

// ── Nested child schemas ────────────────────────────────────

const openTripDestinationInputSchema = v.object({
  destinationId: v.pipe(v.string(), v.uuid("ID destinasi tidak valid")),
  order: v.pipe(v.number(), v.integer("Order harus bilangan bulat"), v.minValue(0, "Order minimal 0")),
})

const openTripCityInputSchema = v.object({
  cityId: v.pipe(v.string(), v.uuid("ID kota tidak valid")),
  arriveAt: v.pipe(v.string(), v.isoDate("arriveAt harus tanggal (YYYY-MM-DD)")),
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
  startAt: v.pipe(v.string(), v.isoDate("startAt harus tanggal (YYYY-MM-DD)")),
  endAt: v.pipe(v.string(), v.isoDate("endAt harus tanggal (YYYY-MM-DD)")),
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
  startAt: v.optional(v.pipe(v.string(), v.isoDate("startAt harus tanggal (YYYY-MM-DD)"))),
  endAt: v.optional(v.pipe(v.string(), v.isoDate("endAt harus tanggal (YYYY-MM-DD)"))),
  status: v.optional(v.picklist(["draft", "published", "archived"])),
  cities: v.optional(v.array(openTripCityInputSchema)),
  inclusions: v.optional(v.array(openTripInclusionInputSchema)),
})

// ── Query / List ────────────────────────────────────────────

export const openTripQuerySchema = v.object({
  ...cursorPaginationSchema.entries,
  status: v.optional(v.picklist(["draft", "published", "archived"])),
  startAtFrom: v.optional(v.pipe(v.string(), v.isoDate("startAtFrom harus tanggal (YYYY-MM-DD)"))),
  startAtTo: v.optional(v.pipe(v.string(), v.isoDate("startAtTo harus tanggal (YYYY-MM-DD)"))),
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
