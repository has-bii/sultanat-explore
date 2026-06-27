import { HTTPException } from "hono/http-exception"

import { Prisma } from "backend/generated/prisma/client"
import { db } from "backend/lib/db"
import { cursorArgs, toPage } from "backend/lib/paginate"
import { imageCardSelect } from "backend/lib/prisma-fragments"
import type {
  CreateOpenTripInput,
  OpenTripQueryOutput,
} from "backend/modules/open-trip/open-trip.schema"

// ── Prisma includes ─────────────────────────────────────────

const includeList = {
  coverImage: { select: imageCardSelect },
} as const

const includeDetail = {
  coverImage: { select: imageCardSelect },
  cities: {
    orderBy: { arriveAt: "asc" as const },
    include: {
      city: {
        select: {
          id: true,
          slug: true,
          name: true,
          tagline: true,
          image: { select: imageCardSelect },
        },
      },
      destinations: {
        orderBy: { order: "asc" as const },
        include: {
          destination: {
            select: {
              id: true,
              name: true,
              image: { select: imageCardSelect },
            },
          },
        },
      },
    },
  },
  inclusions: {
    include: {
      inclusionItem: {
        select: { id: true, slug: true, label: true },
      },
    },
  },
} as const

// ── Helpers ─────────────────────────────────────────────────

function validateDateRange(startAt?: string, endAt?: string) {
  if (startAt && endAt) {
    if (new Date(startAt) > new Date(endAt)) {
      throw new HTTPException(400, { message: "startAt harus sebelum endAt" })
    }
  }
}

function buildNestedCreate(
  cities: { cityId: string; arriveAt: string; destinations?: { destinationId: string }[] }[],
  inclusions: { inclusionItemId: string; type: "include" | "exclude" }[],
) {
  return {
    cities: {
      create: cities.map((city) => ({
        cityId: city.cityId,
        arriveAt: new Date(city.arriveAt),
        destinations: {
          // ponytail: order derived from array index — client value never reaches the DB unique constraint
          create: (city.destinations ?? []).map((dest, j) => ({
            destinationId: dest.destinationId,
            order: j,
          })),
        },
      })),
    },
    inclusions: {
      create: inclusions.map((inc) => ({
        inclusionItemId: inc.inclusionItemId,
        type: inc.type,
      })),
    },
  }
}

// ── List (shared admin/public, visibility filtered by caller) ─

export async function listOpenTrips(query: OpenTripQueryOutput, isAdmin: boolean) {
  const { cursor, limit, status, sort, order } = query

  const where: Prisma.OpenTripWhereInput = {
    // Public: hard-filter published + publishedAt <= now
    ...(isAdmin
      ? status
        ? { status }
        : {}
      : { status: "published", publishedAt: { not: null, lte: new Date() } }),
  }

  const orderBy: Prisma.OpenTripOrderByWithRelationInput =
    sort === "price"
      ? { price: order }
      : sort === "publishedAt"
        ? { publishedAt: order }
        : { startAt: order }

  const openTrips = await db.openTrip.findMany({
    ...cursorArgs({ cursor, limit }),
    where,
    orderBy,
    include: includeList,
  })

  return toPage(openTrips, limit)
}

// ── Get by slug (public) ────────────────────────────────────

export async function getOpenTripBySlug(slug: string) {
  const openTrip = await db.openTrip.findUnique({
    where: { slug },
    include: includeDetail,
  })
  if (!openTrip) throw new HTTPException(404, { message: "Open Trip tidak ditemukan" })
  if (openTrip.status !== "published")
    throw new HTTPException(404, { message: "Open Trip tidak ditemukan" })
  return openTrip
}

export async function getOpenTripsByCitySlug(citySlug: string) {
  return db.openTrip.findMany({
    where: {
      status: "published",
      publishedAt: { not: null, lte: new Date() },
      cities: { some: { city: { slug: citySlug } } },
    },
    orderBy: { startAt: "asc" },
    select: {
      id: true,
      slug: true,
      title: true,
      price: true,
      startAt: true,
      excerpt: true,
      inclusions: {
        select: {
          inclusionItem: {
            select: {
              label: true,
            },
          },
        },
      },
      coverImage: {
        select: { id: true, url: true, alt: true },
      },
    },
  })
}

// ── Get by id (admin) ───────────────────────────────────────

export async function getOpenTripById(id: string) {
  const openTrip = await db.openTrip.findUnique({
    where: { id },
    include: includeDetail,
  })
  if (!openTrip) throw new HTTPException(404, { message: "Open Trip tidak ditemukan" })
  return openTrip
}

// ── Create ──────────────────────────────────────────────────

export async function createOpenTrip(input: CreateOpenTripInput) {
  validateDateRange(input.startAt, input.endAt)

  const cities = input.cities ?? []
  const inclusions = input.inclusions ?? []

  // Check slug uniqueness
  const slugTaken = await db.openTrip.findUnique({ where: { slug: input.slug } })
  if (slugTaken) throw new HTTPException(400, { message: "Slug sudah digunakan" })

  // Check cover image exists
  const image = await db.image.findUnique({ where: { id: input.coverImageId } })
  if (!image) throw new HTTPException(400, { message: "Gambar sampul tidak ditemukan" })

  // Check duplicate inclusions
  const inclusionIds = inclusions.map((i) => i.inclusionItemId)
  if (new Set(inclusionIds).size !== inclusionIds.length) {
    throw new HTTPException(400, { message: "Inclusion item tidak boleh duplikat" })
  }

  // Handle publishedAt
  const publishedAt = input.status === "published" ? new Date() : null

  const nested = buildNestedCreate(cities, inclusions)

  return db.openTrip.create({
    data: {
      slug: input.slug,
      title: input.title,
      excerpt: input.excerpt,
      description: input.description as Prisma.InputJsonValue,
      price: input.price,
      coverImageId: input.coverImageId,
      startAt: new Date(input.startAt),
      endAt: new Date(input.endAt),
      status: input.status,
      publishedAt,
      ...nested,
    },
    include: includeDetail,
  })
}

// ── Update (full-replace) ───────────────────────────────────

export async function updateOpenTrip(id: string, input: CreateOpenTripInput) {
  const existing = await db.openTrip.findUnique({
    where: { id },
    include: { cities: true, inclusions: true },
  })
  if (!existing) throw new HTTPException(404, { message: "Open Trip tidak ditemukan" })

  // Slug collision (self-excluded → idempotent when slug unchanged)
  const slugTaken = await db.openTrip.findFirst({ where: { slug: input.slug, id: { not: id } } })
  if (slugTaken) throw new HTTPException(400, { message: "Slug sudah digunakan" })

  // Cover image exists
  const image = await db.image.findUnique({ where: { id: input.coverImageId } })
  if (!image) throw new HTTPException(400, { message: "Gambar sampul tidak ditemukan" })

  const cities = input.cities
  const inclusions = input.inclusions

  // Duplicate inclusions
  const inclusionIds = inclusions.map((i) => i.inclusionItemId)
  if (new Set(inclusionIds).size !== inclusionIds.length) {
    throw new HTTPException(400, { message: "Inclusion item tidak boleh duplikat" })
  }

  validateDateRange(input.startAt, input.endAt)

  // publishedAt logic: immutable after first set
  let publishedAt = existing.publishedAt
  if (input.status === "published" && existing.status !== "published" && !existing.publishedAt) {
    publishedAt = new Date()
  }

  const data: Prisma.OpenTripUpdateInput = {
    slug: input.slug,
    title: input.title,
    excerpt: input.excerpt,
    description: input.description as Prisma.InputJsonValue,
    price: input.price,
    coverImage: { connect: { id: input.coverImageId } },
    startAt: new Date(input.startAt),
    endAt: new Date(input.endAt),
    status: input.status,
  }
  if (publishedAt !== existing.publishedAt) data.publishedAt = publishedAt

  // Full-replace nested (unconditional)
  data.cities = {
    deleteMany: {},
    create: cities.map((city) => ({
      cityId: city.cityId,
      arriveAt: new Date(city.arriveAt),
      destinations: {
        // ponytail: order derived from array index — DB @@unique([openTripCityId, order]) satisfied
        create: (city.destinations ?? []).map((dest, j) => ({
          destinationId: dest.destinationId,
          order: j,
        })),
      },
    })),
  }
  data.inclusions = {
    deleteMany: {},
    create: inclusions.map((inc) => ({ inclusionItemId: inc.inclusionItemId, type: inc.type })),
  }

  return db.openTrip.update({
    where: { id },
    data,
    include: includeDetail,
  })
}

// ── Archive (soft delete) ───────────────────────────────────

export async function archiveOpenTrip(id: string) {
  const existing = await db.openTrip.findUnique({ where: { id } })
  if (!existing) throw new HTTPException(404, { message: "Open Trip tidak ditemukan" })

  return db.openTrip.update({
    where: { id },
    data: { status: "archived" },
    select: { id: true, status: true },
  })
}

// ── Hard delete ─────────────────────────────────────────────

export async function hardDeleteOpenTrip(id: string) {
  const existing = await db.openTrip.findUnique({ where: { id } })
  if (!existing) throw new HTTPException(404, { message: "Open Trip tidak ditemukan" })

  return db.openTrip.delete({
    where: { id },
    select: { id: true },
  })
}
