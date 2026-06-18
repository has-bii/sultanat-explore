import { decode } from "blurhash"

let cached: { hash: string; url: string } | null = null

export function blurhashToDataUrl(hash: string, w = 32, h = 32): string {
  if (cached && cached.hash === hash && w === 32 && h === 32) return cached.url

  const pixels = decode(hash, w, h)
  const canvas = new OffscreenCanvas(w, h)
  const ctx = canvas.getContext("2d")!
  const imageData = ctx.createImageData(w, h)
  imageData.data.set(pixels)
  ctx.putImageData(imageData, 0, 0)

  // Sync to data URL via canvas conversion
  const canvasEl = document.createElement("canvas")
  canvasEl.width = w
  canvasEl.height = h
  const ctx2 = canvasEl.getContext("2d")!
  ctx2.drawImage(canvas, 0, 0)
  const url = canvasEl.toDataURL("image/png")
  cached = { hash, url }
  return url
}
