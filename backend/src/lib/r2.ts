import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3"

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
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
})

export function r2KeyFromUrl(url: string): string {
  const u = new URL(url)
  return u.pathname.replace(/^\//, "")
}

export async function r2Upload(
  key: string,
  body: Buffer,
  contentType: string,
): Promise<string> {
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
