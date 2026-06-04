import type { Image } from "../dto/image.schema"

export function xhrUpload(opts: {
  file: File
  alt?: string
  signal: AbortSignal
  onProgress: (pct: number) => void
}): Promise<Image> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    const formData = new FormData()
    formData.append("file", opts.file)
    if (opts.alt) formData.append("alt", opts.alt)

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        opts.onProgress(Math.round((e.loaded / e.total) * 100))
      }
    }

    xhr.onload = () => {
      if (xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText))
      } else {
        try {
          const body = JSON.parse(xhr.responseText)
          reject(new Error(body.message || "Upload failed"))
        } catch {
          reject(new Error("Upload failed"))
        }
      }
    }

    xhr.onerror = () => reject(new Error("Network error"))
    xhr.onabort = () => reject(new DOMException("Aborted", "AbortError"))

    opts.signal.addEventListener("abort", () => xhr.abort())

    xhr.open("POST", `${process.env.NEXT_PUBLIC_API_URL}/api/images`)
    xhr.withCredentials = true
    xhr.send(formData)
  })
}
