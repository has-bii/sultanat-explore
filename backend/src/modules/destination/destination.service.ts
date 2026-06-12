import { HTTPException } from "hono/http-exception"
import { Prisma } from "backend/generated/prisma/client"

import { db } from "backend/lib/db"
import { toSlug } from "backend/lib/slug"
import type {
  CreateDestinationInput,
  DestinationQueryOutput,
  SyncGalleryInput,
  UpdateDestinationInput,
} from "backend/modules/destination/destination.schema"

const includeDetail = {
  image: { select: { id: true, url: true, blurHash: true } },
  attractions: {
    select: {
      id: true,
      name: true,
      image: { select: { id: true, url: true, blurHash: true } },
    },
  },
  _count: { select: { attractions: true, images: true } },
} as const

const includeList = {
  image: { select: { id: true, url: true, blurHash: true } },
  _count: { select: { attractions: true, images: true } },
} as const

export async function listDestinations(params: DestinationQueryOutput) {
  const { cursor, limit, search, featured, sort, order } = params
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
  const nextCursor = destinations.length > Math.min(limit, 100) ? data[data.length - 1].id : null

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

export async function getDestinationBySlug(slug: string) {
  const destination = await db.destination.findUnique({
    where: { slug },
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
      highlights: input.highlights,
    },
    include: includeList,
  })
}

export async function updateDestination(id: string, input: UpdateDestinationInput) {
  const existing = await db.destination.findUnique({ where: { id } })
  if (!existing) throw new HTTPException(404, { message: "Destinasi tidak ditemukan" })

  const data: Prisma.DestinationUpdateInput = {}

  if (input.name !== undefined) {
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

  if (input.imageId !== undefined) {
    const existingImage = await db.image.findUnique({ where: { id: input.imageId } })
    if (!existingImage) throw new HTTPException(400, { message: "Gambar tidak ditemukan" })
    data.image = { connect: { id: input.imageId } }
  }

  return db.destination.update({
    where: { id },
    data,
    include: includeList,
  })
}

export async function getDestinationGallery(destinationId: string) {
  const destination = await db.destination.findUnique({ where: { id: destinationId } })
  if (!destination) throw new HTTPException(404, { message: "Destinasi tidak ditemukan" })

  const images = await db.destinationImage.findMany({
    where: { destinationId },
    orderBy: { order: "asc" },
    include: { image: { select: { id: true, url: true, blurHash: true } } },
  })

  return images
}

export async function deleteDestination(id: string) {
  const existing = await db.destination.findUnique({ where: { id } })
  if (!existing) throw new HTTPException(404, { message: "Destinasi tidak ditemukan" })

  // Cascade: attractions and galleries deleted by FK constraint
  await db.destination.delete({ where: { id } })
}

export async function syncGallery(destinationId: string, input: SyncGalleryInput) {
  const destination = await db.destination.findUnique({ where: { id: destinationId } })
  if (!destination) throw new HTTPException(404, { message: "Destinasi tidak ditemukan" })

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
    await tx.destinationImage.deleteMany({ where: { destinationId } })

    if (input.imageIds.length > 0) {
      await tx.destinationImage.createMany({
        data: input.imageIds.map((imageId, index) => ({
          destinationId,
          imageId,
          order: index,
        })),
      })
    }
  })

  // Return updated gallery
  return db.destinationImage.findMany({
    where: { destinationId },
    orderBy: { order: "asc" },
    include: { image: { select: { id: true, url: true, blurHash: true } } },
  })
}
