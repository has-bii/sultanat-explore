import { HTTPException } from "hono/http-exception"

import { db } from "backend/lib/db"
import { cursorArgs, toPage } from "backend/lib/paginate"
import { imageCardSelect } from "backend/lib/prisma-fragments"
import type {
  AttractionQueryOutput,
  CreateAttractionInput,
  UpdateAttractionInput,
} from "backend/modules/attraction/attraction.schema"
import { assertImageExists } from "backend/modules/image/image.service"

const include = {
  image: { select: imageCardSelect },
} as const

export async function listAttractions(params: AttractionQueryOutput) {
  const { cursor, limit, search, sort, order, destinationId } = params

  const where = {
    ...(destinationId ? { destinationId } : {}),
    ...(search ? { name: { startsWith: search, mode: "insensitive" as const } } : {}),
  }

  const attractions = await db.attraction.findMany({
    ...cursorArgs({ cursor, limit }),
    where,
    orderBy: { [sort]: order },
    include,
  })

  return toPage(attractions, limit)
}

export async function getAttraction(id: string) {
  const attraction = await db.attraction.findFirst({
    where: { id },
    include,
  })
  if (!attraction) throw new HTTPException(404, { message: "Atraksi tidak ditemukan" })
  return attraction
}

export async function createAttraction(input: CreateAttractionInput) {
  const destination = await db.destination.findUnique({
    where: { id: input.destinationId },
  })
  if (!destination) throw new HTTPException(404, { message: "Destinasi tidak ditemukan" })

  await assertImageExists(input.imageId)

  return db.attraction.create({
    data: {
      name: input.name,
      description: input.description,
      imageId: input.imageId,
      destinationId: input.destinationId,
    },
    include,
  })
}

export async function updateAttraction(id: string, input: UpdateAttractionInput) {
  const existing = await db.attraction.findFirst({
    where: { id },
  })
  if (!existing) throw new HTTPException(404, { message: "Atraksi tidak ditemukan" })

  if (input.imageId) {
    await assertImageExists(input.imageId)
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

export async function deleteAttraction(id: string) {
  const existing = await db.attraction.findFirst({
    where: { id },
  })
  if (!existing) throw new HTTPException(404, { message: "Atraksi tidak ditemukan" })

  return db.attraction.delete({ where: { id } })
}
