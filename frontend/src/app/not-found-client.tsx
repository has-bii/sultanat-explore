"use client"

import { motion } from "motion/react"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export function NotFoundClient() {
  return (
    <div className="flex min-h-[calc(100vh-4.5rem)] flex-col items-center justify-center px-6 py-24 text-center">
      {/* Animated 404 */}
      <div className="relative mb-8">
        <motion.h1
          className="font-heading text-foreground/10 text-[10rem] leading-none font-black tracking-tighter md:text-[14rem]"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 14, mass: 1 }}
        >
          404
        </motion.h1>

        {/* Floating compass */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl md:text-7xl"
          initial={{ rotate: 0, opacity: 0 }}
          animate={{ opacity: 1, rotate: 360 }}
          transition={{
            opacity: { delay: 0.3, duration: 0.5 },
            rotate: { delay: 0.3, duration: 2, ease: "easeInOut" },
          }}
        >
          🧭
        </motion.div>
      </div>

      {/* Text */}
      <motion.div
        className="max-w-md space-y-4"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
      >
        <h2 className="font-heading text-2xl font-bold md:text-3xl">Halaman Tidak Ditemukan</h2>
        <p className="text-muted-foreground">
          Sepertinya Anda tersesat! Halaman yang Anda cari tidak ada atau sudah dipindahkan.
        </p>
      </motion.div>

      {/* CTA buttons */}
      <motion.div
        className="mt-10 flex flex-col gap-3 sm:flex-row"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <Button asChild size="lg" className="font-heading font-semibold">
          <Link href="/">Kembali ke Beranda</Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="font-heading font-semibold">
          <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer">
            Hubungi Kami
          </a>
        </Button>
      </motion.div>

      {/* Decorative floating dots */}
      {[
        { x: "-20%", y: "-30%", size: 6, delay: 0 },
        { x: "25%", y: "-20%", size: 4, delay: 0.5 },
        { x: "30%", y: "20%", size: 8, delay: 1 },
        { x: "-25%", y: "25%", size: 5, delay: 1.5 },
        { x: "0%", y: "-40%", size: 3, delay: 2 },
      ].map((dot, i) => (
        <motion.span
          key={i}
          className="bg-primary/20 absolute rounded-full"
          style={{
            width: dot.size,
            height: dot.size,
            left: `calc(50% + ${dot.x})`,
            top: `calc(50% + ${dot.y})`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 3,
            delay: dot.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}
