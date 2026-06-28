import { encode } from "blurhash"
import sharp from "sharp"

/**
 * Convert a library image: resize long edge ≤1920, encode webp q80, and
 * derive a 4×4 blurhash from a 64×64 downscale.
 *
 * ponytail: 1 caller today (confirmImages). uploadAvatar gains this when
 * avatar cards ask for a blur state — import this, don't inline.
 */
export async function processImage(input: Buffer): Promise<{
  buffer: Buffer
  blurHash: string
}> {
  const [processed, { data, info }] = await Promise.all([
    sharp(input)
      .resize({ width: 1920, withoutEnlargement: true, fit: "inside" })
      .webp({ quality: 80, force: true })
      .toBuffer(),
    sharp(input)
      .resize({ width: 64, height: 64, fit: "inside" })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true }),
  ])

  const blurHash = encode(new Uint8ClampedArray(data), info.width, info.height, 4, 4)

  return { buffer: processed, blurHash }
}