import { Trash2 } from "lucide-react"
import { useEffect, useRef } from "react"

import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import Image from "next/image"

type Props = {
  file: File
  handleRemove: () => void
}

export function FileListItem({ file, handleRemove }: Props) {
  const isRendered = useRef(false)
  const previewUrl = URL.createObjectURL(file)

  useEffect(() => {
    if (!isRendered.current) {
      isRendered.current = true
      return
    }

    return () => {
      console.log("revoking")
      URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <Item variant="outline" role="listitem">
      <ItemMedia variant="image" className="size-14">
        <Image src={previewUrl} alt="" width={56} height={56} />
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="line-clamp-1">{file.name}</ItemTitle>
        <ItemDescription>{formatFileSize(file.size)}</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button size="icon-sm" variant="destructive" onClick={handleRemove}>
          <Trash2 />
        </Button>
      </ItemActions>
    </Item>
  )
}
