import { Upload } from "lucide-react"
import React, { useRef } from "react"

import { cn } from "@/lib/utils"
import { toast } from "sonner"

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"]
const MAX_SIZE = 5 * 1024 * 1024

type Props = {
  onChange: (value: React.SetStateAction<Map<string, File>>) => void
}

export function DndImages({ onChange }: Props) {
  const inputFileRef = useRef<HTMLInputElement>(null)
  const [isDragging, setisDragging] = React.useState(false)

  const addFiles = (files: FileList | File[]) => {
    onChange((prev) => {
      const next = new Map(prev)
      for (const file of Array.from(files)) {
        if (!ACCEPTED_TYPES.includes(file.type)) {
          toast.error(`Tipe file tidak didukung: ${file.name.split(".").pop()}`)
          continue
        }
        if (file.size > MAX_SIZE) {
          toast.error(`File terlalu besar (max 5MB): ${file.name}`)
          continue
        }
        if (!next.has(file.name)) {
          next.set(file.name, file)
        }
      }
      return next
    })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setisDragging(false)
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setisDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setisDragging(false)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      if (e.target.files) addFiles(e.target.files)
    }
    e.target.value = ""
  }

  return (
    <>
      {/* DnD Element */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputFileRef.current?.click()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 text-center transition-colors hover:border-neutral-400",
          isDragging ? "border-primary" : "border-neutral-300",
        )}
      >
        <Upload className="size-8 text-neutral-400" strokeWidth={1.5} />
        <p className="text-sm text-neutral-600">Drop files here atau klik</p>
        <p className="text-caption text-neutral-400">JPG, PNG, WebP (max 5MB each)</p>
      </div>

      {/* Input file */}
      <input
        ref={inputFileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={handleFileInput}
      />
    </>
  )
}
