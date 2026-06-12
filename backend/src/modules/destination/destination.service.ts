import { HTTPException } from "hono/http-exception"

import { Prisma } from "backend/generated/prisma/client"
import { db } from "backend/lib/db"
import { cursorArgs, toPage } from "backend/lib/paginate"
import { imageCardSelect } from "backend/lib/prisma-fragments"
import { toSlug } from "backend/lib/slug"
import type {
  CreateDestinationInput,
  DestinationQueryOutput,
  SyncGalleryInput,
  UpdateDestinationInput,
} from "backend/modules/destination/destination.schema"
import { assertImageExists } from "backend/modules/image/image.service"

const includeDetail = {
  image: { select: imageCardSelect },
  attractions: {
    select: {
      id: true,
      name: true,
      image: { select: imageCardSelect },
    },
  },
  _count: { select: { attractions: true, images: true } },
} as const

const includeList = {
  image: { select: imageCardSelect },
  _count: { select: { attractions: true, images: true } },
} as const

const galleryImageSelect = { image: { select: imageCardSelect } } as const

async function findGallery(destinationId: string) {
  return db.destinationImage.findMany({
    where: { destinationId },
    orderBy: { order: "asc" },
    include: galleryImageSelect,
  })
}

export async function listDestinations(params: DestinationQueryOutput) {
  const { cursor, limit, search, featured, sort, order } = params

  const where = {
    ...(search ? { name: { startsWith: search, mode: "insensitive" as const } } : {}),
    ...(featured !== undefined ? { featured } : {}),
  }

  const destinations = await db.destination.findMany({
    ...cursorArgs({ cursor, limit }),
    where,
    orderBy: { [sort]: order },
    include: includeList,
  })

  return toPage(destinations, limit)
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

  await assertImageExists(input.imageId)

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
    await assertImageExists(input.imageId)
    data.image = { connect: { id: input.imageId } }
  }

  return db.destination.update({
    where: { id },
    data,
    include: includeList,
  })
}

export async function getDestinationGallery(destinationId: string) {
  const destination = await db.destination.findUnique({
    where: { id: destinationId },
  })
  if (!destination) throw new HTTPException(404, { message: "Destinasi tidak ditemukan" })

  return findGallery(destinationId)
}

export async function deleteDestination(id: string) {
  const existing = await db.destination.findUnique({ where: { id } })
  if (!existing) throw new HTTPException(404, { message: "Destinasi tidak ditemukan" })

  // Cascade: attractions and galleries deleted by FK constraint
  await db.destination.delete({ where: { id } })
}

export async function syncGallery(destinationId: string, input: SyncGalleryInput) {
  const destination = await db.destination.findUnique({
    where: { id: destinationId },
  })
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

  return findGallery(destinationId)
}
