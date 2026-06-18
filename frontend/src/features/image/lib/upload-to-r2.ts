export interface R2UploadResult {
  ok: true
}

export interface R2UploadOptions {
  url: string
  file: File
  /** Must match the Content-Type the server presigned the URL for. */
  contentType: string
  signal: AbortSignal
  onProgress?: (percent: number) => void
}

/**
 * Upload raw file bytes to R2 via a presigned PUT.
 *
 * R2 does not support presigned POST (S3 POST policy) — it returns 501
 * NotImplemented. Presigned PUT is the supported browser-upload path.
 * The Content-Type header MUST match what the server bound into the
 * signature, or R2 rejects with 403 (signature mismatch).
 */
export function uploadToR2(opts: R2UploadOptions): Promise<R2UploadResult> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open("PUT", opts.url)
    xhr.setRequestHeader("Content-Type", opts.contentType)

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && opts.onProgress) {
        opts.onProgress(Math.round((e.loaded / e.total) * 100))
      }
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve({ ok: true })
      else reject(new Error(r2ErrorMessage(xhr.status)))
    }
    xhr.onerror = () => reject(new Error("Gagal mengunggah foto"))
    xhr.onabort = () => reject(new DOMException("Aborted", "AbortError"))

    opts.signal.addEventListener("abort", () => xhr.abort())

    xhr.send(opts.file)
  })
}

function r2ErrorMessage(status: number): string {
  if (status === 403) return "URL unggah kedaluwarsa, coba lagi"
  if (status === 413) return "Foto terlalu besar"
  return "Gagal mengunggah foto"
}
