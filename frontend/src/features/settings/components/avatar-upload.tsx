"use client"

import { Camera, Loader2 } from "lucide-react"
import { useRef, useState } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

import { useUploadAvatar } from "../mutations/upload-avatar.mutation"

interface Props {
  name: string
  imageUrl?: string | null
}

export function AvatarUpload({ name, imageUrl }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)

  const { mutate, isPending } = useUploadAvatar()

  const handleClick = () => {
    if (isPending) return
    inputRef.current?.click()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)

    const accepted = ["image/jpeg", "image/png", "image/webp"]
    if (!accepted.includes(file.type)) {
      setError("Format file harus JPG, PNG, atau WebP")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran file maksimal 5MB")
      return
    }

    mutate(file, {
      onError: () => {
        if (inputRef.current) inputRef.current.value = ""
      },
    })
  }

  return (
    <div className="flex items-center gap-5">
      <button
        type="button"
        onClick={handleClick}
        className="group focus-visible:ring-ring relative h-20 w-20 shrink-0 cursor-pointer rounded-full outline-none focus-visible:ring-2"
        disabled={isPending}
      >
        <Avatar className="h-20 w-20">
          <AvatarImage src={imageUrl ?? undefined} alt={name} />
          <AvatarFallback className="text-2xl">{name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
          {isPending ? (
            <Loader2 className="h-5 w-5 animate-spin text-white" />
          ) : (
            <Camera className="h-5 w-5 text-white" />
          )}
        </div>
      </button>
      <div className="space-y-1.5">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleClick}
          disabled={isPending}
        >
          {isPending ? "Mengunggah..." : "Ubah Foto"}
        </Button>
        {error && <p className="text-destructive text-sm">{error}</p>}
        <p className="text-muted-foreground text-xs">JPG, PNG, atau WebP. Maks 5MB.</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  )
}
