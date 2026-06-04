import { HTTPException } from "hono/http-exception"
import { randomUUID } from "node:crypto"

import { db } from "backend/lib/db"
import { processImage } from "backend/lib/image-processing"
import { r2Delete, r2KeyFromUrl, r2Upload } from "backend/lib/r2"
import type { UpdateImageInput } from "backend/modules/image/image.schema"

function r2Key(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  return `images/${year}/${month}/${randomUUID()}.webp`
}

export async function uploadImage(file: File, alt?: string) {
  const buffer = Buffer.from(await file.arrayBuffer())

  let processed: Awaited<ReturnType<typeof processImage>>
  try {
    processed = await processImage(buffer)
  } catch {
    throw new HTTPException(500, { message: "Image processing failed" })
  }

  const key = r2Key()
  let url: string
  try {
    url = await r2Upload(key, processed.buffer, "image/webp")
  } catch {
    throw new HTTPException(500, { message: "Upload failed" })
  }

  const image = await db.image.create({
    data: {
      url,
      alt: alt ?? null,
      fileSize: processed.buffer.length,
      blurHash: processed.blurHash,
    },
  })

  return image
}

export async function listImages(cursor?: string, limit = 20) {
  const take = Math.min(limit, 100) + 1

  const images = await db.image.findMany({
    take,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    orderBy: { createdAt: "desc" },
  })

  const data = images.slice(0, Math.min(limit, 100))
  const nextCursor = images.length > Math.min(limit, 100) ? data[data.length - 1].id : null

  return { data, nextCursor }
}

export async function getImage(id: string) {
  const image = await db.image.findUnique({ where: { id } })
  if (!image) throw new HTTPException(404, { message: "Image not found" })
  return image
}

export async function updateImage(id: string, input: UpdateImageInput) {
  const existing = await db.image.findUnique({ where: { id } })
  if (!existing) throw new HTTPException(404, { message: "Image not found" })

  return db.image.update({
    where: { id },
    data: { alt: input.alt },
  })
}

export async function deleteImage(id: string) {
  const image = await db.image.findUnique({ where: { id } })
  if (!image) throw new HTTPException(404, { message: "Image not found" })

  const key = r2KeyFromUrl(image.url)
  try {
    await r2Delete(key)
  } catch {
    throw new HTTPException(500, { message: "Delete failed" })
  }

  await db.image.delete({ where: { id } })
}
