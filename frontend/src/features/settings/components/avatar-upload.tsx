"use client"

import { useRef, useState } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Loader } from "lucide-react"

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

    mutate(file)
  }

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <Avatar className="h-20 w-20 cursor-pointer" onClick={handleClick}>
          <AvatarImage src={imageUrl ?? undefined} alt={name} />
          <AvatarFallback className="text-2xl">{name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        {isPending && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
            <Loader className="h-6 w-6 animate-spin text-white" />
          </div>
        )}
      </div>
      <div className="space-y-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleClick}
          disabled={isPending}
        >
          {isPending ? "Mengunggah..." : "Ubah Foto"}
        </Button>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <p className="text-muted-foreground text-xs">JPG, PNG, WebP. Maksimal 5MB.</p>
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
