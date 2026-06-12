import { HTTPException } from "hono/http-exception"
import { randomUUID } from "node:crypto"

import { PrismaClientKnownRequestError } from "backend/generated/prisma/internal/prismaNamespace"
import { db } from "backend/lib/db"
import { processImage } from "backend/lib/image-processing"
import { r2Delete, r2KeyFromUrl, r2Upload } from "backend/lib/r2"
import type { ImageQueryOutput, UpdateImageInput } from "backend/modules/image/image.schema"

function r2Key(): string {
  const now = new Date()
  const year = String(now.getFullYear())
  const month = String(now.getMonth() + 1).padStart(2, "0")
  return `images/${year}/${month}/${randomUUID()}.webp`
}

async function processAndUpload(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer())

  let processed: Awaited<ReturnType<typeof processImage>>
  try {
    processed = await processImage(buffer)
  } catch (err) {
    throw new HTTPException(500, { message: "Gagal memproses foto", cause: err })
  }

  const key = r2Key()
  let url: string
  try {
    url = await r2Upload(key, processed.buffer, "image/webp")
  } catch {
    throw new HTTPException(500, { message: "Gagal mengunggah foto" })
  }

  return db.image.create({
    data: {
      url,
      fileSize: processed.buffer.length,
      blurHash: processed.blurHash,
    },
  })
}

export async function uploadImages(files: File[] | File) {
  if (Array.isArray(files)) {
    const results = await Promise.all(files.map(processAndUpload))
    return results
  }
  return await processAndUpload(files)
}

export async function listImages(params: ImageQueryOutput) {
  const { cursor, limit, sort, order, search } = params
  const take = Math.min(limit, 100) + 1

  const images = await db.image.findMany({
    take,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    orderBy: { [sort]: order },
    ...(search ? { where: { alt: { startsWith: search, mode: "insensitive" } } } : {}),
  })

  const data = images.slice(0, Math.min(limit, 100))
  const nextCursor = images.length > Math.min(limit, 100) ? data[data.length - 1].id : null

  return { data, nextCursor }
}

export async function getImage(id: string) {
  const image = await db.image.findUnique({ where: { id } })
  if (!image) throw new HTTPException(404, { message: "Foto tidak ditemukan" })
  return image
}

export async function updateImage(id: string, input: UpdateImageInput) {
  const existing = await db.image.findUnique({ where: { id } })
  if (!existing) throw new HTTPException(404, { message: "Foto tidak ditemukan" })

  return db.image.update({
    where: { id },
    data: { alt: input.alt },
  })
}

export async function deleteImage(id: string) {
  try {
    const image = await db.image.findUnique({ where: { id } })
    if (!image) throw new HTTPException(404, { message: "Foto tidak ditemukan" })

    await db.image.delete({ where: { id } })

    const key = r2KeyFromUrl(image.url)
    try {
      await r2Delete(key)
    } catch {
      throw new HTTPException(500, { message: "Gagal menghapus foto" })
    }
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError && err.code === "P2003") {
      throw new HTTPException(400, { message: "Gagal menghapus foto. Foto masih digunakan." })
    }
    throw err
  }
}

export async function bulkDeleteImages(ids: string[]) {
  const images = await db.image.findMany({ where: { id: { in: ids } } })
  if (images.length === 0) throw new HTTPException(404, { message: "Foto tidak ditemukan" })

  // Collect referenced image IDs (FK from destinations, attractions, galleries)
  const refChecks = await Promise.all([
    db.destination.findMany({
      where: { imageId: { in: ids } },
      select: { imageId: true },
    }),
    db.attraction.findMany({
      where: { imageId: { in: ids } },
      select: { imageId: true },
    }),
    db.destinationImage.findMany({
      where: { imageId: { in: ids } },
      select: { imageId: true },
    }),
    db.attractionImage.findMany({
      where: { imageId: { in: ids } },
      select: { imageId: true },
    }),
  ])

  const referencedIds = new Set(refChecks.flat().map((r) => r.imageId))

  const deletable = images.filter((img) => !referencedIds.has(img.id))
  const skipped = images.length - deletable.length

  // Delete from R2 in parallel
  await Promise.all(
    deletable.map((img) =>
      r2Delete(r2KeyFromUrl(img.url)).catch(() => {
        // R2 delete failure shouldn't block DB cleanup
      }),
    ),
  )

  // Delete from DB
  const deleteResult = await db.image.deleteMany({
    where: { id: { in: deletable.map((img) => img.id) } },
  })

  return { deleted: deleteResult.count, skipped }
}
