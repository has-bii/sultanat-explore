"use client"

import { WandSparkles } from "lucide-react"

import { ButtonLoading } from "@/components/button-loading"

import { useProcessImage } from "../mutations/process-image.mutation"

interface Props {
  imageId: string
}

export function ProcessImageButton({ imageId }: Props) {
  const { mutate, isPending } = useProcessImage()

  return (
    <div className="flex flex-col gap-1.5">
      <ButtonLoading
        size="lg"
        variant="outline"
        onClick={() => mutate(imageId)}
        isLoading={isPending}
        loadingLabel="Memproses..."
        icon={WandSparkles}
      >
        Proses foto
      </ButtonLoading>
      <p className="text-muted-foreground text-xs">
        Kompres ke webp + buat blurhash
      </p>
    </div>
  )
}