"use client"

import { motion } from "motion/react"
import { values } from "../data"

export function ValuesSection() {
  return (
    <section className="border-t bg-card py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Nilai Kami
          </span>
          <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight">
            Prinsip yang Kami Pegang
          </h2>
        </div>

        {/* Values Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              viewport={{ once: true }}
              className="rounded-2xl border bg-background p-6 transition-all hover:-translate-y-0.5 hover:shadow-uber-md"
            >
              <span className="text-3xl">{item.icon}</span>
              <h3 className="mt-3 font-heading text-base font-semibold">{item.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
