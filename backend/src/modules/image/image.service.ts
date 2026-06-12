import { HTTPException } from "hono/http-exception"
import { randomUUID } from "node:crypto"

import { db } from "backend/lib/db"
import { processImage } from "backend/lib/image-processing"
import { logger } from "backend/lib/logger"
import { cursorArgs, toPage } from "backend/lib/paginate"
import { r2Delete, r2KeyFromUrl, r2Upload } from "backend/lib/r2"
import type { ImageQueryOutput, UpdateImageInput } from "backend/modules/image/image.schema"

// ── Shared helpers (exported for destination / attraction) ──────────

/** Throws 400 if image not found. Use in destination + attraction create/update. */
export async function assertImageExists(id: string) {
  const img = await db.image.findUnique({ where: { id }, select: { id: true } })
  if (!img) throw new HTTPException(400, { message: "Gambar tidak ditemukan" })
}

/** Returns the set of imageIds still referenced by destination / attraction / gallery. */
export async function findReferencedImageIds(ids: string[]): Promise<Set<string>> {
  const [dest, attr, gallery] = await Promise.all([
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
  ])
  return new Set([...dest, ...attr, ...gallery].map((r) => r.imageId))
}

// ── Private helpers ────────────────────────────────────────────────

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

// ── CRUD ───────────────────────────────────────────────────────────

export async function uploadImages(files: File[] | File) {
  const arr = Array.isArray(files) ? files : [files]
  return Promise.all(arr.map(processAndUpload))
}

export async function listImages(params: ImageQueryOutput) {
  const { cursor, limit, sort, order, search } = params

  const images = await db.image.findMany({
    ...cursorArgs({ cursor, limit }),
    orderBy: { [sort]: order },
    ...(search ? { where: { alt: { startsWith: search, mode: "insensitive" } } } : {}),
  })

  return toPage(images, limit)
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
  const image = await db.image.findUnique({ where: { id } })
  if (!image) throw new HTTPException(404, { message: "Foto tidak ditemukan" })

  const refs = await findReferencedImageIds([id])
  if (refs.size) {
    throw new HTTPException(400, {
      message: "Gagal menghapus foto. Foto masih digunakan.",
    })
  }

  const key = r2KeyFromUrl(image.url)
  await r2Delete(key).catch(() => {
    throw new HTTPException(500, { message: "Gagal menghapus foto dari storage" })
  })

  await db.image.delete({ where: { id } })
}

export async function bulkDeleteImages(ids: string[]) {
  const images = await db.image.findMany({ where: { id: { in: ids } } })
  if (images.length === 0) throw new HTTPException(404, { message: "Foto tidak ditemukan" })

  const referencedIds = await findReferencedImageIds(ids)

  const deletable = images.filter((img) => !referencedIds.has(img.id))
  const skipped = images.length - deletable.length

  // Delete from R2 — best-effort, log failures, don't block DB cleanup
  await Promise.all(
    deletable.map((img) =>
      r2Delete(r2KeyFromUrl(img.url)).catch((err: unknown) => {
        logger.error(`R2 delete failed for ${img.id}:`, err)
      }),
    ),
  )

  const deleteResult = await db.image.deleteMany({
    where: { id: { in: deletable.map((img) => img.id) } },
  })

  return { deleted: deleteResult.count, skipped }
}
