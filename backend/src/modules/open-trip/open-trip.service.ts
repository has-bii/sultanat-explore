import { HTTPException } from "hono/http-exception"

import { Prisma } from "backend/generated/prisma/client"
import { db } from "backend/lib/db"
import { cursorArgs, toPage } from "backend/lib/paginate"
import { imageCardSelect } from "backend/lib/prisma-fragments"
import type {
  CreateOpenTripInput,
  OpenTripQueryOutput,
  UpdateOpenTripInput,
} from "backend/modules/open-trip/open-trip.schema"

// ── Prisma includes ─────────────────────────────────────────

const includeList = {
  coverImage: { select: imageCardSelect },
} as const

const includeDetail = {
  coverImage: { select: imageCardSelect },
  cities: {
    orderBy: { order: "asc" as const },
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

function validateCityDateRanges(cities: { arriveAt: string; departAt?: string }[]) {
  for (const city of cities) {
    if (city.departAt && new Date(city.arriveAt) > new Date(city.departAt)) {
      throw new HTTPException(400, { message: "arriveAt kota harus sebelum departAt" })
    }
  }
}

function buildNestedCreate(
  cities: { cityId: string; arriveAt: string; departAt?: string; destinations?: { destinationId: string; visitAt: string }[] }[],
  inclusions: { inclusionItemId: string; type: "include" | "exclude" }[],
) {
  return {
    cities: {
      create: cities.map((city, cityIndex) => ({
        cityId: city.cityId,
        arriveAt: new Date(city.arriveAt),
        departAt: city.departAt ? new Date(city.departAt) : null,
        order: cityIndex,
        destinations: {
          create: (city.destinations ?? []).map((dest, destIndex) => ({
            destinationId: dest.destinationId,
            visitAt: new Date(dest.visitAt),
            order: destIndex,
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

function deriveDateRange(
  cities: { arriveAt: string; departAt?: string }[],
  overrideStart?: string,
  overrideEnd?: string,
): { startAt: Date; endAt: Date } {
  if (overrideStart && overrideEnd) {
    return { startAt: new Date(overrideStart), endAt: new Date(overrideEnd) }
  }

  if (cities.length === 0) {
    throw new HTTPException(400, { message: "Minimal satu kota harus diisi" })
  }

  const arriveAts = cities.map((c) => new Date(c.arriveAt))

  const minStart = new Date(Math.min(...arriveAts.map((d) => d.getTime())))
  const lastCity = cities[cities.length - 1]
  const maxEnd = lastCity.departAt
    ? new Date(lastCity.departAt)
    : new Date(lastCity.arriveAt)

  return {
    startAt: overrideStart ? new Date(overrideStart) : minStart,
    endAt: overrideEnd ? new Date(overrideEnd) : maxEnd,
  }
}

// ── List (shared admin/public, visibility filtered by caller) ─

export async function listOpenTrips(query: OpenTripQueryOutput, isAdmin: boolean) {
  const { cursor, limit, status, startAtFrom, startAtTo, priceMin, priceMax, sort, order } = query

  const where: Prisma.OpenTripWhereInput = {
    // Public: hard-filter published + publishedAt <= now
    ...(isAdmin
      ? status ? { status } : {}
      : { status: "published", publishedAt: { not: null, lte: new Date() } }),
    ...(startAtFrom || startAtTo
      ? {
          startAt: {
            ...(startAtFrom ? { gte: new Date(startAtFrom) } : {}),
            ...(startAtTo ? { lte: new Date(startAtTo) } : {}),
          },
        }
      : {}),
    ...(priceMin !== undefined || priceMax !== undefined
      ? {
          price: {
            ...(priceMin !== undefined ? { gte: priceMin } : {}),
            ...(priceMax !== undefined ? { lte: priceMax } : {}),
          },
        }
      : {}),
  }

  const orderBy: Prisma.OpenTripOrderByWithRelationInput =
    sort === "price" ? { price: order } : sort === "publishedAt" ? { publishedAt: order } : { startAt: order }

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
  if (openTrip.status !== "published") throw new HTTPException(404, { message: "Open Trip tidak ditemukan" })
  return openTrip
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

  validateCityDateRanges(cities)

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

  // Derive date range
  const { startAt, endAt } = deriveDateRange(cities, input.startAt, input.endAt)

  // Sort cities by arriveAt for order
  const sortedCities = [...cities].sort(
    (a, b) => new Date(a.arriveAt).getTime() - new Date(b.arriveAt).getTime(),
  )

  // Handle publishedAt
  const publishedAt = input.status === "published" ? new Date() : null

  const nested = buildNestedCreate(sortedCities, inclusions)

  return db.openTrip.create({
    data: {
      slug: input.slug,
      title: input.title,
      excerpt: input.excerpt,
      description: input.description as Prisma.InputJsonValue,
      price: input.price,
      coverImageId: input.coverImageId,
      startAt,
      endAt,
      status: input.status,
      publishedAt,
      ...nested,
    },
    include: includeDetail,
  })
}

// ── Update (full-replace) ───────────────────────────────────

export async function updateOpenTrip(id: string, input: UpdateOpenTripInput) {
  const existing = await db.openTrip.findUnique({
    where: { id },
    include: { cities: true, inclusions: true },
  })
  if (!existing) throw new HTTPException(404, { message: "Open Trip tidak ditemukan" })

  // Check slug collision
  if (input.slug) {
    const slugTaken = await db.openTrip.findFirst({ where: { slug: input.slug, id: { not: id } } })
    if (slugTaken) throw new HTTPException(400, { message: "Slug sudah digunakan" })
  }

  // Check cover image exists
  if (input.coverImageId) {
    const image = await db.image.findUnique({ where: { id: input.coverImageId } })
    if (!image) throw new HTTPException(400, { message: "Gambar sampul tidak ditemukan" })
  }

  const cities = input.cities ?? []
  const inclusions = input.inclusions ?? []

  if (input.cities !== undefined) {
    validateCityDateRanges(cities)
    // Check duplicate inclusions
    const inclusionIds = inclusions.map((i) => i.inclusionItemId)
    if (new Set(inclusionIds).size !== inclusionIds.length) {
      throw new HTTPException(400, { message: "Inclusion item tidak boleh duplikat" })
    }
  }

  validateDateRange(input.startAt, input.endAt)

  // Determine date range
  let startAt: Date | undefined
  let endAt: Date | undefined
  if (input.cities !== undefined && cities.length > 0) {
    const derived = deriveDateRange(cities, input.startAt, input.endAt)
    startAt = derived.startAt
    endAt = derived.endAt
  } else if (input.startAt) {
    startAt = new Date(input.startAt)
  } else if (input.endAt) {
    endAt = new Date(input.endAt)
  }

  // publishedAt logic: immutable after first set
  let publishedAt = existing.publishedAt
  if (input.status === "published" && existing.status !== "published" && !existing.publishedAt) {
    publishedAt = new Date()
  }

  // Build update data
  const data: Prisma.OpenTripUpdateInput = {}

  if (input.slug !== undefined) data.slug = input.slug
  if (input.title !== undefined) data.title = input.title
  if (input.excerpt !== undefined) data.excerpt = input.excerpt
  if (input.description !== undefined) data.description = input.description as Prisma.InputJsonValue
  if (input.price !== undefined) data.price = input.price
  if (input.coverImageId !== undefined) data.coverImage = { connect: { id: input.coverImageId } }
  if (startAt) data.startAt = startAt
  if (endAt) data.endAt = endAt
  if (input.status !== undefined) data.status = input.status
  if (publishedAt !== existing.publishedAt) data.publishedAt = publishedAt

  // Full-replace nested: delete old, create new
  if (input.cities !== undefined) {
    const sortedCities = [...cities].sort(
      (a, b) => new Date(a.arriveAt).getTime() - new Date(b.arriveAt).getTime(),
    )

    data.cities = {
      deleteMany: {},
      create: sortedCities.map((city, cityIndex) => ({
        cityId: city.cityId,
        arriveAt: new Date(city.arriveAt),
        departAt: city.departAt ? new Date(city.departAt) : null,
        order: cityIndex,
        destinations: {
          create: (city.destinations ?? []).map((dest, destIndex) => ({
            destinationId: dest.destinationId,
            visitAt: new Date(dest.visitAt),
            order: destIndex,
          })),
        },
      })),
    }
  }

  if (input.inclusions !== undefined) {
    data.inclusions = {
      deleteMany: {},
      create: inclusions.map((inc) => ({
        inclusionItemId: inc.inclusionItemId,
        type: inc.type,
      })),
    }
  }

  return db.openTrip.update({
    where: { id },
    data,
    include: includeDetail,
  })
}

// ── Soft delete ─────────────────────────────────────────────

export async function deleteOpenTrip(id: string) {
  const existing = await db.openTrip.findUnique({ where: { id } })
  if (!existing) throw new HTTPException(404, { message: "Open Trip tidak ditemukan" })

  return db.openTrip.update({
    where: { id },
    data: { status: "archived" },
    select: { id: true, status: true },
  })
}
