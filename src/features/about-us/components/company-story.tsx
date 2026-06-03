"use client"

import { motion } from "motion/react"
import { timeline } from "../data"

export function CompanyStory() {
  return (
    <section className="py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Cerita Kami
          </span>
          <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight">
            Dari Ide ke Realita
          </h2>
          <p className="mt-3 text-muted-foreground">
            Perjalanan SultanatExplore dari awal hingga menjadi travel agent terpercaya untuk
            traveler Indonesia di Turki.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative mt-16">
          {/* Vertical line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-border lg:left-1/2 lg:-translate-x-px" />

          <div className="space-y-12">
            {timeline.map((item, i) => {
              const isEven = i % 2 === 0

              return (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  viewport={{ once: true, margin: "-50px" }}
                  className="relative"
                >
                  {/* Dot on line */}
                  <div className="absolute left-4 top-1 flex h-3 w-3 -translate-x-1/2 items-center justify-center lg:left-1/2">
                    <div className="h-3 w-3 rounded-full border-2 border-primary bg-background" />
                  </div>

                  {/* Content — alternating sides on desktop */}
                  <div
                    className={`ml-10 lg:ml-0 lg:w-[45%] ${
                      isEven
                        ? "lg:mr-auto lg:pr-8 lg:text-right"
                        : "lg:ml-auto lg:pl-8 lg:text-left"
                    }`}
                  >
                    <span className="inline-block rounded-full bg-primary/10 px-3 py-0.5 text-xs font-bold text-primary">
                      {item.year}
                    </span>
                    <h3 className="mt-2 font-heading text-base font-semibold">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
