import { Trash2 } from "lucide-react"
import { useEffect, useMemo } from "react"

import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { formatFileSize } from "@/utils/format-file-size"
import Image from "next/image"

type Props = {
  file: File
  handleRemove: () => void
}

export function FileListItem({ file, handleRemove }: Props) {
  const previewUrl = useMemo(() => URL.createObjectURL(file), [file])

  useEffect(() => {
    return () => URL.revokeObjectURL(previewUrl)
  }, [previewUrl])

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
