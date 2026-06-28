"use client"

import { motion } from "motion/react"
import React from "react"

import { blurhashToDataUrl } from "@/features/image/lib/blurhash"
import Image from "next/image"

type GalleryImage = {
  id: string
  url: string
  alt: string | null
  blurHash: string | null
}

export function GalleryColumn(props: {
  className?: string
  images: GalleryImage[]
  duration?: number
}) {
  return (
    <div className={props.className}>
      <motion.div
        animate={{ translateY: "-50%" }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.images.map((image) => (
                <div key={image.id} className="w-full">
                  <Image
                    src={image.url}
                    alt={image.alt || ""}
                    width={400}
                    height={300}
                    className="rounded-xl object-cover"
                    placeholder={image.blurHash ? "blur" : undefined}
                    blurDataURL={image.blurHash ? blurhashToDataUrl(image.blurHash) : undefined}
                  />
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  )
}
