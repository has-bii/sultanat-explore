import { decode } from "blurhash"

export function blurhashToDataUrl(hash: string, w = 32, h = 32): string {
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
  return canvasEl.toDataURL("image/png")
}
