import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { HTTPException } from "hono/http-exception"
import { randomUUID } from "node:crypto"

function getEnv(key: string): string {
  const value = process.env[key]
  if (!value) throw new Error(`${key} is not set`)
  return value
}

const R2_ACCOUNT_ID = getEnv("R2_ACCOUNT_ID")
const R2_ACCESS_KEY_ID = getEnv("R2_ACCESS_KEY_ID")
const R2_SECRET_ACCESS_KEY = getEnv("R2_SECRET_ACCESS_KEY")
const BUCKET = getEnv("R2_BUCKET_NAME")
const PUBLIC_DOMAIN = getEnv("R2_PUBLIC_DOMAIN")

const client = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  // R2 default endpoint only supports path-style addressing.
  // Without this, the SDK emits virtual-hosted-style URLs
  // (https://<bucket>.<account>.r2.cloudflarestorage.com) and R2
  // returns 501 Not Implemented on the presigned POST.
  forcePathStyle: true,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
})

export function r2KeyFromUrl(url: string): string {
  const u = new URL(url)
  return u.pathname.replace(/^\//, "")
}

export function extByContentType(ct: string): string {
  switch (ct) {
    case "image/jpeg":
      return "jpg"
    case "image/png":
      return "png"
    case "image/webp":
      return "webp"
    default:
      throw new HTTPException(400, { message: "Tipe file tidak didukung" })
  }
}

export function imageKey(ext: string): string {
  const now = new Date()
  const year = String(now.getFullYear())
  const month = String(now.getMonth() + 1).padStart(2, "0")
  return `images/${year}/${month}/${randomUUID()}.${ext}`
}

export async function r2PresignPut(
  key: string,
  contentType: string,
): Promise<{ url: string }> {
  // R2 does not support presigned POST (S3 POST policy) — returns 501
  // NotImplemented. Use presigned PUT instead. ContentType is bound into
  // the signature; the client MUST send the same Content-Type header on
  // the PUT or R2 rejects with a signature mismatch (403).
  // Content-length is NOT enforced by the PUT signature; size validation
  // happens up front in presignImageSchema + DndImages (client-trusted
  // fileSize, per Phase A decision).
  const url = await getSignedUrl(
    client,
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      ContentType: contentType,
    }),
    { expiresIn: 600 }, // 10 min
  )
  return { url }
}

export async function r2Upload(key: string, body: Buffer, contentType: string): Promise<string> {
  await client.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  )
  return `https://${PUBLIC_DOMAIN}/${key}`
}

export async function r2Delete(key: string): Promise<void> {
  await client.send(
    new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: key,
    }),
  )
}
