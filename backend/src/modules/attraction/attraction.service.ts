import { HTTPException } from "hono/http-exception"

import { db } from "backend/lib/db"
import type {
  AddAttractionGalleryImageInput,
  AttractionQueryInput,
  CreateAttractionInput,
  ReorderAttractionGalleryInput,
  UpdateAttractionInput,
} from "backend/modules/attraction/attraction.schema"

const includeDetail = {
  image: { select: { id: true, url: true, blurHash: true } },
  category: { select: { id: true, name: true, slug: true } },
  images: {
    orderBy: { order: "asc" as const },
    include: { image: { select: { id: true, url: true, blurHash: true } } },
  },
  _count: { select: { images: true } },
} as const

const includeList = {
  image: { select: { id: true, url: true, blurHash: true } },
  category: { select: { id: true, name: true, slug: true } },
  _count: { select: { images: true } },
} as const

export async function listAttractions(destinationId: string, params: AttractionQueryInput) {
  const { cursor, limit, search, categoryId, sort, order } = params
  const take = Math.min(limit, 100) + 1

  const where = {
    destinationId,
    ...(search ? { name: { startsWith: search, mode: "insensitive" as const } } : {}),
    ...(categoryId ? { categoryId } : {}),
  }

  const attractions = await db.attraction.findMany({
    take,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    where,
    orderBy: { [sort]: order },
    include: includeList,
  })

  const data = attractions.slice(0, Math.min(limit, 100))
  const nextCursor = attractions.length > Math.min(limit, 100) ? data[data.length - 1].id : null

  return { data, nextCursor }
}

export async function getAttraction(destinationId: string, id: string) {
  const attraction = await db.attraction.findFirst({
    where: { id, destinationId },
    include: includeDetail,
  })
  if (!attraction) throw new HTTPException(404, { message: "Atraksi tidak ditemukan" })
  return attraction
}

export async function createAttraction(destinationId: string, input: CreateAttractionInput) {
  const destination = await db.destination.findUnique({ where: { id: destinationId } })
  if (!destination) throw new HTTPException(404, { message: "Destinasi tidak ditemukan" })

  const image = await db.image.findUnique({ where: { id: input.imageId } })
  if (!image) throw new HTTPException(400, { message: "Gambar tidak ditemukan" })

  if (input.categoryId) {
    const category = await db.attractionCategory.findUnique({
      where: { id: input.categoryId },
    })
    if (!category) throw new HTTPException(400, { message: "Kategori tidak ditemukan" })
  }

  return db.attraction.create({
    data: {
      name: input.name,
      description: input.description,
      imageId: input.imageId,
      destinationId,
      categoryId: input.categoryId,
    },
    include: includeList,
  })
}

export async function updateAttraction(
  destinationId: string,
  id: string,
  input: UpdateAttractionInput,
) {
  const existing = await db.attraction.findFirst({
    where: { id, destinationId },
  })
  if (!existing) throw new HTTPException(404, { message: "Atraksi tidak ditemukan" })

  const data: Record<string, unknown> = {}

  if (input.name !== undefined) data.name = input.name
  if (input.description !== undefined) data.description = input.description
  if (input.categoryId !== undefined) data.categoryId = input.categoryId

  if (input.imageId) {
    const image = await db.image.findUnique({ where: { id: input.imageId } })
    if (!image) throw new HTTPException(400, { message: "Gambar tidak ditemukan" })
    data.imageId = input.imageId
  }

  if (input.categoryId) {
    const category = await db.attractionCategory.findUnique({
      where: { id: input.categoryId },
    })
    if (!category) throw new HTTPException(400, { message: "Kategori tidak ditemukan" })
  }

  return db.attraction.update({
    where: { id },
    data,
    include: includeList,
  })
}

export async function deleteAttraction(destinationId: string, id: string) {
  const existing = await db.attraction.findFirst({
    where: { id, destinationId },
  })
  if (!existing) throw new HTTPException(404, { message: "Atraksi tidak ditemukan" })

  // Cascade: galleries deleted by FK constraint
  await db.attraction.delete({ where: { id } })
}

export async function addGalleryImage(
  destinationId: string,
  attractionId: string,
  input: AddAttractionGalleryImageInput,
) {
  const attraction = await db.attraction.findFirst({
    where: { id: attractionId, destinationId },
  })
  if (!attraction) throw new HTTPException(404, { message: "Atraksi tidak ditemukan" })

  const image = await db.image.findUnique({ where: { id: input.imageId } })
  if (!image) throw new HTTPException(400, { message: "Gambar tidak ditemukan" })

  const exists = await db.attractionImage.findUnique({
    where: { attractionId_imageId: { attractionId, imageId: input.imageId } },
  })
  if (exists) throw new HTTPException(409, { message: "Foto sudah ada di galeri" })

  let order = input.order
  if (order === undefined) {
    const last = await db.attractionImage.findFirst({
      where: { attractionId },
      orderBy: { order: "desc" },
    })
    order = (last?.order ?? -1) + 1
  }

  return db.attractionImage.create({
    data: { attractionId, imageId: input.imageId, order },
    include: { image: { select: { id: true, url: true, blurHash: true } } },
  })
}

export async function removeGalleryImage(
  destinationId: string,
  attractionId: string,
  imageId: string,
) {
  const attraction = await db.attraction.findFirst({
    where: { id: attractionId, destinationId },
  })
  if (!attraction) throw new HTTPException(404, { message: "Atraksi tidak ditemukan" })

  const existing = await db.attractionImage.findUnique({
    where: { attractionId_imageId: { attractionId, imageId } },
  })
  if (!existing) throw new HTTPException(404, { message: "Foto tidak ditemukan di galeri" })

  await db.attractionImage.delete({
    where: { attractionId_imageId: { attractionId, imageId } },
  })
}

export async function reorderGallery(
  destinationId: string,
  attractionId: string,
  input: ReorderAttractionGalleryInput,
) {
  const attraction = await db.attraction.findFirst({
    where: { id: attractionId, destinationId },
  })
  if (!attraction) throw new HTTPException(404, { message: "Atraksi tidak ditemukan" })

  // Verify all images belong to this attraction
  const existing = await db.attractionImage.findMany({
    where: { attractionId },
    select: { imageId: true },
  })
  const existingIds = new Set(existing.map((e) => e.imageId))
  const allValid = input.imageIds.every((id) => existingIds.has(id))
  if (!allValid || existingIds.size !== input.imageIds.length) {
    throw new HTTPException(400, { message: "Daftar gambar tidak valid" })
  }

  await db.$transaction(
    input.imageIds.map((imageId, index) =>
      db.attractionImage.update({
        where: { attractionId_imageId: { attractionId, imageId } },
        data: { order: index },
      }),
    ),
  )
}
