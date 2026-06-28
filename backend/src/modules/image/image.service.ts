import { HTTPException } from "hono/http-exception"

import type { Image } from "backend/generated/prisma/client"
import { db } from "backend/lib/db"
import { logger } from "backend/lib/logger"
import { cursorArgs, toPage } from "backend/lib/paginate"
import { processImage } from "backend/lib/image-processing"
import {
  extByContentType,
  imageKey,
  r2Delete,
  r2GetObject,
  r2Head,
  r2KeyFromUrl,
  r2KeyWithExt,
  r2PresignPut,
  r2Upload,
} from "backend/lib/r2"
import type {
  ConfirmImageInput,
  ImageQueryOutput,
  PresignImageInput,
  UpdateImageInput,
} from "backend/modules/image/image.schema"
import { MAX_IMAGE_SIZE } from "backend/modules/image/image.schema"

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
    // ponytail: real size comes from R2, not the client. HeadObject is the
    // actual gate against oversized uploads that bypass the presign cap —
    // and lets us reject a 50MB upload without downloading 50MB to process it.
    const head = await r2Head(item.key)
    if (!head) {
      throw new HTTPException(400, { message: "File belum diunggah, silakan unggah ulang" })
    }
    if (head.contentLength > MAX_IMAGE_SIZE) {
      throw new HTTPException(413, { message: "Ukuran file melebihi 5MB" })
    }

    // Server-side transform (option A): pull bytes from R2 → sharp webp +
    // blurhash → write a fresh .webp key, discard the original. Bytes never
    // touch the HTTP body — keeps us under Vercel's body-size limit (the
    // reason blurhash was removed in the first place; see commit 4c56b39).
    const original = await r2GetObject(item.key)
    let processed: { buffer: Buffer; blurHash: string }
    try {
      processed = await processImage(original)
    } catch (err) {
      await r2Delete(item.key).catch(() => {})
      throw new HTTPException(400, { message: "File rusak atau tidak didukung", cause: err })
    }

    const webpKey = r2KeyWithExt(item.key, "webp")
    const url = `https://${process.env.R2_PUBLIC_DOMAIN}/${webpKey}`
    try {
      await r2Upload(webpKey, processed.buffer, "image/webp")
    } catch (err) {
      throw new HTTPException(500, { message: "Gagal menyimpan foto", cause: err })
    }

    // Order: upload webp → create row → delete original. On db-create failure
    // the webp orphans (loggable) but the original survives so confirm can retry.
    const created = await db.image.create({
      data: {
        url,
        alt: item.alt,
        fileSize: processed.buffer.length,
        blurHash: processed.blurHash,
      },
    })
    out.push(created)

    // ponytail: original is an intermediate — canonical asset is the webp.
    await r2Delete(item.key).catch((err: unknown) => {
      logger.error(`R2 delete original failed for ${item.key}:`, err)
    })
  }
  return out
}

// ── Backfill ──────────────────────────────────────────────────────

/** Process an existing image: webp re-encode + blurhash. Idempotent guard on blurHash. */
export async function processExistingImage(id: string) {
  const existing = await db.image.findUnique({ where: { id } })
  if (!existing) throw new HTTPException(404, { message: "Foto tidak ditemukan" })
  if (existing.blurHash) {
    throw new HTTPException(409, { message: "Foto sudah diproses" })
  }

  const oldKey = r2KeyFromUrl(existing.url)
  const original = await r2GetObject(oldKey)
  let processed: { buffer: Buffer; blurHash: string }
  try {
    processed = await processImage(original)
  } catch (err) {
    throw new HTTPException(400, { message: "File rusak atau tidak didukung", cause: err })
  }

  // Fresh key (not r2KeyWithExt) — avoids collision when the original is
  // already .webp (uploaded during the no-processing window), which would
  // overwrite the only copy before we could delete it.
  const webpKey = imageKey("webp")
  const url = `https://${process.env.R2_PUBLIC_DOMAIN}/${webpKey}`
  try {
    await r2Upload(webpKey, processed.buffer, "image/webp")
  } catch (err) {
    throw new HTTPException(500, { message: "Gagal menyimpan foto", cause: err })
  }

  // Order: upload webp → update row → delete original. On db-update failure
  // the webp orphans (loggable) but the original survives so process can retry.
  const updated = await db.image.update({
    where: { id },
    data: {
      url,
      fileSize: processed.buffer.length,
      blurHash: processed.blurHash,
    },
  })

  // ponytail: original is an intermediate — canonical asset is the webp.
  await r2Delete(oldKey).catch((err: unknown) => {
    logger.error(`R2 delete original failed for ${id}:`, err)
  })

  return updated
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

  try {
    await db.image.delete({ where: { id } })
  } catch (err) {
    // race: ref appeared between check and delete
    const refs = await findReferencedImageIds([id])
    if (refs.size) {
      throw new HTTPException(400, {
        message: "Gagal menghapus foto. Foto masih digunakan.",
      })
    }
    throw new HTTPException(500, { message: "Gagal menghapus foto", cause: err })
  }

  // ponytail: R2 delete after DB commit — orphaned R2 object (cheap) beats a row pointing at a 404 (broken UX)
  await r2Delete(r2KeyFromUrl(image.url)).catch((err: unknown) => {
    logger.error(`R2 delete failed for ${image.id}:`, err)
  })
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
