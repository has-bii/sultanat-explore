import { HTTPException } from "hono/http-exception"

import { db } from "backend/lib/db"
import type {
  AttractionQueryInput,
  CreateAttractionInput,
  UpdateAttractionInput,
} from "backend/modules/attraction/attraction.schema"

const include = {
  image: { select: { id: true, url: true, blurHash: true } },
} as const

export async function listAttractions(destinationId: string, params: AttractionQueryInput) {
  const { cursor, limit, search, sort, order } = params
  const pageSize = Math.min(limit, 100)
  const take = pageSize + 1

  const where = {
    destinationId,
    ...(search ? { name: { startsWith: search, mode: "insensitive" as const } } : {}),
  }

  const attractions = await db.attraction.findMany({
    take,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    where,
    orderBy: { [sort]: order },
    include,
  })

  const data = attractions.slice(0, pageSize)
  const nextCursor = attractions.length > pageSize ? data[data.length - 1].id : null

  return { data, nextCursor }
}

export async function getAttraction(destinationId: string, id: string) {
  const attraction = await db.attraction.findFirst({
    where: { id, destinationId },
    include,
  })
  if (!attraction) throw new HTTPException(404, { message: "Atraksi tidak ditemukan" })
  return attraction
}

export async function createAttraction(destinationId: string, input: CreateAttractionInput) {
  const destination = await db.destination.findUnique({ where: { id: destinationId } })
  if (!destination) throw new HTTPException(404, { message: "Destinasi tidak ditemukan" })

  const image = await db.image.findUnique({ where: { id: input.imageId } })
  if (!image) throw new HTTPException(400, { message: "Gambar tidak ditemukan" })

  return db.attraction.create({
    data: {
      name: input.name,
      description: input.description,
      imageId: input.imageId,
      destinationId,
    },
    include,
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

  if (input.imageId) {
    const image = await db.image.findUnique({ where: { id: input.imageId } })
    if (!image) throw new HTTPException(400, { message: "Gambar tidak ditemukan" })
  }

  return db.attraction.update({
    where: { id },
    data: {
      name: input.name,
      description: input.description,
      ...(input.imageId && { imageId: input.imageId }),
    },
    include,
  })
}

export async function deleteAttraction(destinationId: string, id: string) {
  const existing = await db.attraction.findFirst({
    where: { id, destinationId },
  })
  if (!existing) throw new HTTPException(404, { message: "Atraksi tidak ditemukan" })

  return db.attraction.delete({ where: { id } })
}
