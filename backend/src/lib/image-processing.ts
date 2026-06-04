import sharp from "sharp"
import { encode } from "blurhash"

export async function processImage(input: Buffer): Promise<{
  buffer: Buffer
  blurHash: string
}> {
  const [processed, { data, info }] = await Promise.all([
    sharp(input)
      .resize({ width: 1920, withoutEnlargement: true, fit: "inside" })
      .webp({ quality: 75, force: true })
      .toBuffer(),
    sharp(input)
      .resize({ width: 64, height: 64, fit: "inside" })
      .raw()
      .toBuffer({ resolveWithObject: true }),
  ])

  const blurHash = encode(
    new Uint8ClampedArray(data),
    info.width,
    info.height,
    4,
    4,
  )

  return { buffer: processed, blurHash }
}
