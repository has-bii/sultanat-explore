import { randomUUID } from "node:crypto"

import { HTTPException } from "hono/http-exception"
import sharp from "sharp"

import { r2Upload } from "backend/lib/r2"

function r2Key(): string {
  const now = new Date()
  const year = String(now.getFullYear())
  const month = String(now.getMonth() + 1).padStart(2, "0")
  return `avatars/${year}/${month}/${randomUUID()}.webp`
}

export async function uploadAvatar(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer())

  let processed: Buffer
  try {
    processed = await sharp(buffer)
      .resize({ width: 512, height: 512, fit: "cover" })
      .webp({ quality: 80, force: true })
      .toBuffer()
  } catch (err) {
    throw new HTTPException(500, { message: "Gagal memproses foto", cause: err })
  }

  const key = r2Key()
  let url: string
  try {
    url = await r2Upload(key, processed, "image/webp")
  } catch {
    throw new HTTPException(500, { message: "Gagal mengunggah foto" })
  }

  return { url }
}
