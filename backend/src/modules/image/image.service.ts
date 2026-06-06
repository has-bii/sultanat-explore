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

export async function listImages(params: {
  cursor?: string
  limit?: number
  sort?: "createdAt"
  order?: "asc" | "desc"
  search?: string
}) {
  const { cursor, limit = 20, sort = "createdAt", order = "desc", search } = params
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
  const image = await db.image.findUnique({ where: { id } })
  if (!image) throw new HTTPException(404, { message: "Foto tidak ditemukan" })

  const key = r2KeyFromUrl(image.url)
  try {
    await r2Delete(key)
  } catch {
    throw new HTTPException(500, { message: "Gagal menghapus foto" })
  }

  await db.image.delete({ where: { id } })
}
