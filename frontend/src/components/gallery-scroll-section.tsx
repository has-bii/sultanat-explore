"use client"

import { useSuspenseQuery } from "@tanstack/react-query"

import { getGalleryQueryOptions } from "@/features/gallery/queries"

import { GalleryType } from "backend/modules/gallery/gallery.schema"

import { GalleryColumn } from "./gallery-column"

interface Props {
  type: GalleryType
}

export default function GalleryScrollSection({ type }: Props) {
  const { data: gallery } = useSuspenseQuery(getGalleryQueryOptions(type))

  // Hide section if no images
  if (!gallery || gallery.length === 0) return null

  const images = gallery.map(({ image }) => image)
  const third = Math.ceil(images.length / 3)
  const firstColumn = images.slice(0, third)
  const secondColumn = images.slice(third, third * 2)
  const thirdColumn = images.slice(third * 2)

  return (
    <div className="mt-10 flex max-h-185 justify-center gap-6 overflow-hidden mask-[linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]">
      <GalleryColumn images={firstColumn} duration={15} />
      <GalleryColumn images={secondColumn} className="hidden md:block" duration={19} />
      <GalleryColumn images={thirdColumn} className="hidden lg:block" duration={17} />
    </div>
  )
}
