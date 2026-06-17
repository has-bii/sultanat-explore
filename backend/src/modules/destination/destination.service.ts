import { HTTPException } from "hono/http-exception"

import { db } from "backend/lib/db"
import { cursorArgs, toPage } from "backend/lib/paginate"
import { imageCardSelect } from "backend/lib/prisma-fragments"
import type {
  CreateDestinationInput,
  DestinationQueryOutput,
  UpdateDestinationInput,
} from "backend/modules/destination/destination.schema"
import { assertImageExists } from "backend/modules/image/image.service"

const include = {
  image: { select: imageCardSelect },
} as const

export async function listDestinations(params: DestinationQueryOutput) {
  const { cursor, limit, search, sort, order, cityId } = params

  const where = {
    ...(cityId ? { cityId } : {}),
    ...(search ? { name: { startsWith: search, mode: "insensitive" as const } } : {}),
  }

  const destinations = await db.destination.findMany({
    ...cursorArgs({ cursor, limit }),
    where,
    orderBy: { [sort]: order },
    include,
  })

  return toPage(destinations, limit)
}

export async function getDestination(id: string) {
  const destination = await db.destination.findFirst({
    where: { id },
    include,
  })
  if (!destination) throw new HTTPException(404, { message: "Destinasi tidak ditemukan" })
  return destination
}

export async function createDestination(input: CreateDestinationInput) {
  const city = await db.city.findUnique({
    where: { id: input.cityId },
  })
  if (!city) throw new HTTPException(404, { message: "Kota tidak ditemukan" })

  await assertImageExists(input.imageId)

  return db.destination.create({
    data: {
      name: input.name,
      description: input.description,
      imageId: input.imageId,
      cityId: input.cityId,
    },
    include,
  })
}

export async function updateDestination(id: string, input: UpdateDestinationInput) {
  const existing = await db.destination.findFirst({
    where: { id },
  })
  if (!existing) throw new HTTPException(404, { message: "Destinasi tidak ditemukan" })

  if (input.imageId) {
    await assertImageExists(input.imageId)
  }

  return db.destination.update({
    where: { id },
    data: {
      name: input.name,
      description: input.description,
      ...(input.imageId && { imageId: input.imageId }),
    },
    include,
  })
}

export async function deleteDestination(id: string) {
  const existing = await db.destination.findFirst({
    where: { id },
  })
  if (!existing) throw new HTTPException(404, { message: "Destinasi tidak ditemukan" })

  return db.destination.delete({ where: { id } })
}
