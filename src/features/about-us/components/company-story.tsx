"use client"

import { motion } from "motion/react"

import { timeline } from "../data"

export function CompanyStory() {
  return (
    <section className="py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-xl text-center">
          <span className="text-primary text-xs font-semibold tracking-widest uppercase">
            Cerita Kami
          </span>
          <h2 className="font-heading mt-2 text-3xl font-bold tracking-tight">
            Dari Ide ke Realita
          </h2>
          <p className="text-muted-foreground mt-3">
            Perjalanan SultanatExplore dari awal hingga menjadi travel agent terpercaya untuk
            traveler Indonesia di Turki.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative mt-16">
          {/* Vertical line */}
          <div className="bg-border absolute top-0 bottom-0 left-4 w-px lg:left-1/2 lg:-translate-x-px" />

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
                  <div className="absolute top-1 left-4 flex h-3 w-3 -translate-x-1/2 items-center justify-center lg:left-1/2">
                    <div className="border-primary bg-background h-3 w-3 rounded-full border-2" />
                  </div>

                  {/* Content — alternating sides on desktop */}
                  <div
                    className={`ml-10 lg:ml-0 lg:w-[45%] ${
                      isEven
                        ? "lg:mr-auto lg:pr-8 lg:text-right"
                        : "lg:ml-auto lg:pl-8 lg:text-left"
                    }`}
                  >
                    <span className="bg-primary/10 text-primary inline-block rounded-full px-3 py-0.5 text-xs font-bold">
                      {item.year}
                    </span>
                    <h3 className="font-heading mt-2 text-base font-semibold">{item.title}</h3>
                    <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
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
