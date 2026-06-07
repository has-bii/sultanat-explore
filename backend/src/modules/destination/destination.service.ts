import { HTTPException } from "hono/http-exception"

import { db } from "backend/lib/db"
import { toSlug } from "backend/lib/slug"
import type {
  AddGalleryImageInput,
  CreateDestinationInput,
  DestinationQueryInput,
  ReorderGalleryInput,
  UpdateDestinationInput,
} from "backend/modules/destination/destination.schema"

const includeDetail = {
  image: { select: { id: true, url: true, blurHash: true } },
  images: {
    orderBy: { order: "asc" as const },
    include: { image: { select: { id: true, url: true, blurHash: true } } },
  },
  attractions: {
    select: {
      id: true,
      name: true,
      image: { select: { id: true, url: true, blurHash: true } },
      category: { select: { id: true, name: true, slug: true } },
    },
  },
  _count: { select: { attractions: true, images: true } },
} as const

const includeList = {
  image: { select: { id: true, url: true, blurHash: true } },
  _count: { select: { attractions: true, images: true } },
} as const

export async function listDestinations(params: DestinationQueryInput) {
  const { cursor, limit = 10, search, featured, sort = "createdAt", order = "desc" } = params
  const take = Math.min(limit, 100) + 1

  const where = {
    ...(search ? { name: { startsWith: search, mode: "insensitive" as const } } : {}),
    ...(featured !== undefined ? { featured } : {}),
  }

  const destinations = await db.destination.findMany({
    take,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    where,
    orderBy: { [sort]: order },
    include: includeList,
  })

  const data = destinations.slice(0, Math.min(limit, 100))
  const nextCursor =
    destinations.length > Math.min(limit, 100) ? data[data.length - 1].id : null

  return { data, nextCursor }
}

export async function getDestination(id: string) {
  const destination = await db.destination.findUnique({
    where: { id },
    include: includeDetail,
  })
  if (!destination) throw new HTTPException(404, { message: "Destinasi tidak ditemukan" })
  return destination
}

export async function createDestination(input: CreateDestinationInput) {
  const slug = toSlug(input.name)

  const existingSlug = await db.destination.findUnique({ where: { slug } })
  if (existingSlug) throw new HTTPException(409, { message: "Slug sudah digunakan" })

  const existingImage = await db.image.findUnique({ where: { id: input.imageId } })
  if (!existingImage) throw new HTTPException(400, { message: "Gambar tidak ditemukan" })

  return db.destination.create({
    data: {
      name: input.name,
      slug,
      tagline: input.tagline,
      description: input.description,
      imageId: input.imageId,
      featured: input.featured,
      highlights: input.highlights ?? [],
    },
    include: includeList,
  })
}

export async function updateDestination(id: string, input: UpdateDestinationInput) {
  const existing = await db.destination.findUnique({ where: { id } })
  if (!existing) throw new HTTPException(404, { message: "Destinasi tidak ditemukan" })

  const data: Record<string, unknown> = {}

  if (input.name) {
    const slug = toSlug(input.name)
    const slugTaken = await db.destination.findFirst({
      where: { slug, id: { not: id } },
    })
    if (slugTaken) throw new HTTPException(409, { message: "Slug sudah digunakan" })
    data.name = input.name
    data.slug = slug
  }

  if (input.tagline !== undefined) data.tagline = input.tagline
  if (input.description !== undefined) data.description = input.description
  if (input.featured !== undefined) data.featured = input.featured
  if (input.highlights !== undefined) data.highlights = input.highlights

  if (input.imageId) {
    const existingImage = await db.image.findUnique({ where: { id: input.imageId } })
    if (!existingImage) throw new HTTPException(400, { message: "Gambar tidak ditemukan" })
    data.imageId = input.imageId
  }

  return db.destination.update({
    where: { id },
    data,
    include: includeList,
  })
}

export async function deleteDestination(id: string) {
  const existing = await db.destination.findUnique({ where: { id } })
  if (!existing) throw new HTTPException(404, { message: "Destinasi tidak ditemukan" })

  // Cascade: attractions and galleries deleted by FK constraint
  await db.destination.delete({ where: { id } })
}

export async function addGalleryImage(destinationId: string, input: AddGalleryImageInput) {
  const destination = await db.destination.findUnique({ where: { id: destinationId } })
  if (!destination) throw new HTTPException(404, { message: "Destinasi tidak ditemukan" })

  const image = await db.image.findUnique({ where: { id: input.imageId } })
  if (!image) throw new HTTPException(400, { message: "Gambar tidak ditemukan" })

  const exists = await db.destinationImage.findUnique({
    where: { destinationId_imageId: { destinationId, imageId: input.imageId } },
  })
  if (exists) throw new HTTPException(409, { message: "Foto sudah ada di galeri" })

  let order = input.order
  if (order === undefined) {
    const last = await db.destinationImage.findFirst({
      where: { destinationId },
      orderBy: { order: "desc" },
    })
    order = (last?.order ?? -1) + 1
  }

  return db.destinationImage.create({
    data: { destinationId, imageId: input.imageId, order },
    include: { image: { select: { id: true, url: true, blurHash: true } } },
  })
}

export async function removeGalleryImage(destinationId: string, imageId: string) {
  const existing = await db.destinationImage.findUnique({
    where: { destinationId_imageId: { destinationId, imageId } },
  })
  if (!existing)
    throw new HTTPException(404, { message: "Foto tidak ditemukan di galeri" })

  await db.destinationImage.delete({
    where: { destinationId_imageId: { destinationId, imageId } },
  })
}

export async function reorderGallery(destinationId: string, input: ReorderGalleryInput) {
  const destination = await db.destination.findUnique({ where: { id: destinationId } })
  if (!destination) throw new HTTPException(404, { message: "Destinasi tidak ditemukan" })

  // Verify all images belong to this destination
  const existing = await db.destinationImage.findMany({
    where: { destinationId },
    select: { imageId: true },
  })
  const existingIds = new Set(existing.map((e) => e.imageId))
  const allValid = input.imageIds.every((id) => existingIds.has(id))
  if (!allValid || existingIds.size !== input.imageIds.length) {
    throw new HTTPException(400, { message: "Daftar gambar tidak valid" })
  }

  await db.$transaction(
    input.imageIds.map((imageId, index) =>
      db.destinationImage.update({
        where: { destinationId_imageId: { destinationId, imageId } },
        data: { order: index },
      }),
    ),
  )
}
