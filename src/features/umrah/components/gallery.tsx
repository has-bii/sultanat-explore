"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { galleryImages } from "../data"

export function Gallery() {
  const [selected, setSelected] = useState<number | null>(null)

  return (
    <section className="bg-muted/30 py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Galeri
          </span>
          <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight">
            Momen Ibadah Jamaah Kami
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Kenangan perjalanan Umrah bersama SultanatExplore
          </p>
        </div>

        {/* Masonry-ish grid */}
        <div className="mt-10 grid auto-rows-[180px] grid-cols-2 gap-3 sm:grid-cols-3 lg:auto-rows-[200px]">
          {galleryImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`group relative overflow-hidden rounded-2xl ${img.span}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
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
          <img
            src={galleryImages[selected].src
              .replace("w=400", "w=1200")
              .replace("w=600", "w=1200")}
            alt={galleryImages[selected].alt}
            className="max-h-[85vh] max-w-full rounded-2xl object-contain"
          />
        </div>
      )}
    </section>
  )
}
