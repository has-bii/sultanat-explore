import { HTTPException } from "hono/http-exception"

import { db } from "backend/lib/db"
import { logger } from "backend/lib/logger"
import { cursorArgs, toPage } from "backend/lib/paginate"
import { r2Delete, r2KeyFromUrl, r2PresignPut, extByContentType, imageKey } from "backend/lib/r2"
import type {
  ConfirmImageInput,
  ImageQueryOutput,
  PresignImageInput,
  UpdateImageInput,
} from "backend/modules/image/image.schema"
import type { Image } from "backend/generated/prisma/client"

// ── Shared helpers (exported for city / destination) ──────────────

/** Throws 400 if image not found. Use in city + destination create/update. */
export async function assertImageExists(id: string) {
  const img = await db.image.findUnique({ where: { id }, select: { id: true } })
  if (!img) throw new HTTPException(400, { message: "Gambar tidak ditemukan" })
}

/** Returns the set of imageIds still referenced by city / destination / gallery. */
export async function findReferencedImageIds(ids: string[]): Promise<Set<string>> {
  const [cities, destinations, gallery] = await Promise.all([
    db.city.findMany({
      where: { imageId: { in: ids } },
      select: { imageId: true },
    }),
    db.destination.findMany({
      where: { imageId: { in: ids } },
      select: { imageId: true },
    }),
    db.cityImage.findMany({
      where: { imageId: { in: ids } },
      select: { imageId: true },
    }),
  ])
  return new Set([...cities, ...destinations, ...gallery].map((r) => r.imageId))
}

// ── Presigned upload ──────────────────────────────────────────────

export async function presignImages(files: PresignImageInput["files"]) {
  return Promise.all(
    files.map(async (f) => {
      const ext = extByContentType(f.contentType)
      const key = imageKey(ext)
      const { url } = await r2PresignPut(key, f.contentType)
      return { key, url }
    }),
  )
}

export async function confirmImages(items: ConfirmImageInput["items"]): Promise<Image[]> {
  const out: Image[] = []
  for (const item of items) {
    const url = `https://${process.env.R2_PUBLIC_DOMAIN}/${item.key}`
    const existing = await db.image.findFirst({ where: { url } })
    if (existing) {
      out.push(existing)
      continue
    }
    const created = await db.image.create({
      data: { url, alt: item.alt, fileSize: item.fileSize },
    })
    out.push(created)
  }
  return out
}

// ── CRUD ───────────────────────────────────────────────────────────

export async function listImages(params: ImageQueryOutput) {
  const { cursor, limit, sort, order, search } = params

  const images = await db.image.findMany({
    ...cursorArgs({ cursor, limit }),
    orderBy: { [sort]: order },
    ...(search ? { where: { alt: { contains: search, mode: "insensitive" } } } : {}),
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
  await r2Delete(key).catch((err: unknown) => {
    logger.error(`R2 delete failed for ${image.id}:`, err)
  })

  try {
    await db.image.delete({ where: { id } })
  } catch (err) {
    const refs = await findReferencedImageIds([id])
    if (refs.size) {
      throw new HTTPException(400, {
        message: "Gagal menghapus foto. Foto masih digunakan.",
      })
    }
    throw new HTTPException(500, { message: "Gagal menghapus foto", cause: err })
  }
}

export async function bulkDeleteImages(ids: string[]) {
  const images = await db.image.findMany({ where: { id: { in: ids } } })
  if (images.length === 0) throw new HTTPException(404, { message: "Foto tidak ditemukan" })

  const referencedIds = await findReferencedImageIds(ids)

  const deletable = images.filter((img) => !referencedIds.has(img.id))
  const skipped = images.length - deletable.length

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
