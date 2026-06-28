import { HTTPException } from "hono/http-exception"

import { db } from "backend/lib/db"
import { imageCardSelect } from "backend/lib/prisma-fragments"
import type { GalleryType, SyncGalleryInput } from "backend/modules/gallery/gallery.schema"

const galleryImageSelect = { image: { select: imageCardSelect } } as const

async function findGallery(type: GalleryType) {
  return db.galleryImage.findMany({
    where: { type },
    orderBy: { order: "asc" },
    include: galleryImageSelect,
  })
}

export async function getGalleryByType(type: GalleryType) {
  return findGallery(type)
}

export async function syncGallery(type: GalleryType, input: SyncGalleryInput) {
  if (input.imageIds.length > 0) {
    const images = await db.image.findMany({
      where: { id: { in: input.imageIds } },
      select: { id: true },
    })
    if (images.length !== input.imageIds.length) {
      throw new HTTPException(400, { message: "Beberapa gambar tidak ditemukan" })
    }
  }

  await db.$transaction(async (tx) => {
    await tx.galleryImage.deleteMany({ where: { type } })

    if (input.imageIds.length > 0) {
      await tx.galleryImage.createMany({
        data: input.imageIds.map((imageId, index) => ({
          imageId,
          type,
          order: index,
        })),
      })
    }
  })

  return findGallery(type)
}
