"use client"

import { X } from "lucide-react"
import { useState } from "react"

import Image from "next/image"

import { galleryImages } from "../data"

export function PastTripGallery() {
  const [selected, setSelected] = useState<number | null>(null)

  return (
    <section className="bg-muted/30 py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <span className="text-primary text-xs font-semibold tracking-widest uppercase">
            Galeri
          </span>
          <h2 className="font-heading mt-2 text-3xl font-bold tracking-tight">
            Intip Keseruan Kami
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">Dokumentasi para customer kami</p>
        </div>

        {/* Masonry-ish grid */}
        <div className="mt-10 grid auto-rows-[180px] grid-cols-2 gap-3 sm:grid-cols-3 lg:auto-rows-[200px]">
          {galleryImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`group relative overflow-hidden rounded-2xl ${img.span}`}
            >
              <Image
                fill
                src={img.src}
                alt={img.alt}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selected !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <button
            onClick={() => setSelected(null)}
            className="absolute top-6 right-6 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>
          <Image
            src={galleryImages[selected].src.replace("w=400", "w=1200").replace("w=600", "w=1200")}
            alt={galleryImages[selected].alt}
            width={1200}
            height={800}
            className="max-h-[85vh] max-w-full rounded-2xl object-contain"
            style={{ width: "auto", height: "auto" }}
          />
        </div>
      )}
    </section>
  )
}
