"use client"

import { GalleryScrollSectionSkeleton } from "@/components/gallery-scroll-section-skeleton"
import dynamic from "next/dynamic"

import type { GalleryType } from "backend/modules/gallery/gallery.schema"

const GalleryScrollSection = dynamic(() => import("@/components/gallery-scroll-section"), {
  ssr: false,
  loading: GalleryScrollSectionSkeleton,
})

interface GallerySectionProps {
  type?: GalleryType
  title?: string
  subtitle?: string
}

export function GallerySection({
  type = "home",
  title = "Dokumentasi",
  subtitle = "Abadikan moment terindah Anda bersama kami",
}: GallerySectionProps) {
  return (
    <section className="bg-background relative my-20">
      <div className="z-10 mx-auto max-w-6xl">
        <div className="mx-auto flex flex-col items-center justify-center">
          <h2 className="font-heading text-small-heading sm:text-subheading md:text-heading lg:text-card-title xl:text-display mt-5 font-bold tracking-tighter">
            {title}
          </h2>
          <p className="text-body mt-5 text-center opacity-75">
            {subtitle}
          </p>
        </div>

        <GalleryScrollSection type={type} />
      </div>
    </section>
  )
}
