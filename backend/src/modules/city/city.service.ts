import { HTTPException } from "hono/http-exception"

import { Prisma } from "backend/generated/prisma/client"
import { db } from "backend/lib/db"
import { cursorArgs, toPage } from "backend/lib/paginate"
import { imageCardSelect } from "backend/lib/prisma-fragments"
import { toSlug } from "backend/lib/slug"
import type {
  CityQueryOutput,
  CreateCityInput,
  SyncGalleryInput,
  UpdateCityInput,
} from "backend/modules/city/city.schema"
import { assertImageExists } from "backend/modules/image/image.service"

const includeDetail = {
  image: { select: imageCardSelect },
  destinations: {
    select: {
      id: true,
      name: true,
      image: { select: imageCardSelect },
    },
  },
  _count: { select: { destinations: true, images: true } },
} as const

const includeList = {
  image: { select: imageCardSelect },
  _count: { select: { destinations: true, images: true } },
} as const

const galleryImageSelect = { image: { select: imageCardSelect } } as const

async function findGallery(cityId: string) {
  return db.cityImage.findMany({
    where: { cityId },
    orderBy: { order: "asc" },
    include: galleryImageSelect,
  })
}

export async function listCities(params: CityQueryOutput) {
  const { cursor, limit, search, featured, sort, order } = params

  const where = {
    ...(search ? { name: { startsWith: search, mode: "insensitive" as const } } : {}),
    ...(featured !== undefined ? { featured } : {}),
  }

  const cities = await db.city.findMany({
    ...cursorArgs({ cursor, limit }),
    where,
    orderBy: { [sort]: order },
    include: includeList,
  })

  return toPage(cities, limit)
}

export async function getCity(id: string) {
  const city = await db.city.findUnique({
    where: { id },
    include: includeDetail,
  })
  if (!city) throw new HTTPException(404, { message: "Kota tidak ditemukan" })
  return city
}

export async function getCityBySlug(slug: string) {
  const city = await db.city.findUnique({
    where: { slug },
    include: includeDetail,
  })
  if (!city) throw new HTTPException(404, { message: "Kota tidak ditemukan" })
  return city
}

export async function createCity(input: CreateCityInput) {
  const slug = toSlug(input.name)

  const existingSlug = await db.city.findUnique({ where: { slug } })
  if (existingSlug) throw new HTTPException(409, { message: "Slug sudah digunakan" })

  await assertImageExists(input.imageId)

  return db.city.create({
    data: {
      name: input.name,
      slug,
      tagline: input.tagline,
      description: input.description,
      imageId: input.imageId,
      featured: input.featured,
      highlights: input.highlights,
    },
    include: includeList,
  })
}

export async function updateCity(id: string, input: UpdateCityInput) {
  const existing = await db.city.findUnique({ where: { id } })
  if (!existing) throw new HTTPException(404, { message: "Kota tidak ditemukan" })

  const data: Prisma.CityUpdateInput = {}

  if (input.name !== undefined) {
    const slug = toSlug(input.name)
    const slugTaken = await db.city.findFirst({
      where: { slug, id: { not: id } },
    })
    if (slugTaken) throw new HTTPException(409, { message: "Slug sudah digunakan" })
    data.name = input.name
    data.slug = slug
  }
  if (input.tagline !== undefined) data.tagline = input.tagline
  if (input.description !== undefined) data.description = input.description
  if (input.imageId !== undefined) {
    await assertImageExists(input.imageId)
    data.image = { connect: { id: input.imageId } }
  }
  if (input.featured !== undefined) data.featured = input.featured
  if (input.highlights !== undefined) data.highlights = input.highlights

  return db.city.update({
    where: { id },
    data,
    include: includeList,
  })
}

export async function getCityGallery(cityId: string) {
  const city = await db.city.findUnique({
    where: { id: cityId },
  })
  if (!city) throw new HTTPException(404, { message: "Kota tidak ditemukan" })

  return findGallery(cityId)
}

export async function deleteCity(id: string) {
  const existing = await db.city.findUnique({ where: { id } })
  if (!existing) throw new HTTPException(404, { message: "Kota tidak ditemukan" })

  // Cascade: destinations and galleries deleted by FK constraint
  await db.city.delete({ where: { id } })
}

export async function syncGallery(cityId: string, input: SyncGalleryInput) {
  const city = await db.city.findUnique({
    where: { id: cityId },
  })
  if (!city) throw new HTTPException(404, { message: "Kota tidak ditemukan" })

  // Validate images exist
  if (input.imageIds.length > 0) {
    const images = await db.image.findMany({
      where: { id: { in: input.imageIds } },
      select: { id: true },
    })
    if (images.length !== input.imageIds.length) {
      throw new HTTPException(400, { message: "Beberapa gambar tidak ditemukan" })
    }
  }

  // Full replace in transaction: delete all then create all
  await db.$transaction(async (tx) => {
    await tx.cityImage.deleteMany({ where: { cityId } })

    if (input.imageIds.length > 0) {
      await tx.cityImage.createMany({
        data: input.imageIds.map((imageId, index) => ({
          cityId,
          imageId,
          order: index,
        })),
      })
    }
  })

  return findGallery(cityId)
}
