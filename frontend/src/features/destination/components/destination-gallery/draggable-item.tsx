import type { PanInfo } from "motion/react"
import * as motion from "motion/react-client"
import { type RefObject, useRef, useState } from "react"

import { cn } from "@/lib/utils"

import type { Image as TImage } from "backend/generated/prisma/client"

import { ImageCard } from "./image-card"

type GalleryImage = Pick<TImage, "id" | "url" | "blurHash">

interface DraggableItemProps {
  image: GalleryImage
  index: number
  constraintsRef: RefObject<HTMLDivElement | null>
  onSwap: (fromIndex: number, toIndex: number) => void
  onDelete: (id: string) => void
  cols: number
}

export function DraggableItem({
  image,
  index,
  constraintsRef,
  onSwap,
  onDelete,
  cols,
}: DraggableItemProps) {
  const lastSwapRef = useRef<number>(0)
  const [isDragging, setIsDragging] = useState(false)

  const getCellIndexFromPoint = (point: PanInfo["point"]): number => {
    const container = constraintsRef.current
    if (!container) return -1

    const rect = container.getBoundingClientRect()
    const gap = 8 // gap-2 = 0.5rem = 8px
    const cellWidth = (rect.width - gap * (cols - 1)) / cols
    const cellHeight = cellWidth // aspect-square

    const col = Math.floor((point.x - rect.left) / (cellWidth + gap))
    const row = Math.floor((point.y - rect.top) / (cellHeight + gap))

    // Check if pointer is within cell bounds (not in gap)
    const cellLeft = rect.left + col * (cellWidth + gap)
    const cellTop = rect.top + row * (cellHeight + gap)
    const inCellX = point.x >= cellLeft && point.x <= cellLeft + cellWidth
    const inCellY = point.y >= cellTop && point.y <= cellTop + cellHeight

    if (col < 0 || col >= cols || row < 0 || !inCellX || !inCellY) return -1

    const totalCells = container.children.length
    const cellIndex = row * cols + col
    return cellIndex < totalCells ? cellIndex : -1
  }

  const handleDrag = (_: never, info: PanInfo) => {
    const now = Date.now()
    if (now - lastSwapRef.current < 100) return // debounce 100ms

    const overIndex = getCellIndexFromPoint(info.point)
    if (overIndex !== -1 && overIndex !== index) {
      lastSwapRef.current = now
      onSwap(index, overIndex)
    }
  }

  return (
    <motion.div
      layout
      drag
      dragConstraints={constraintsRef}
      dragSnapToOrigin
      dragElastic={0.1}
      dragMomentum={false}
      transition={{
        layout: { type: "spring", stiffness: 300, damping: 25 },
      }}
      onDragStart={() => setIsDragging(true)}
      onDrag={handleDrag}
      onDragEnd={() => setIsDragging(false)}
      className={cn("relative", isDragging ? "z-50" : "z-0")}
    >
      <ImageCard data={image} onDelete={onDelete} isDragging={isDragging} />
    </motion.div>
  )
}
