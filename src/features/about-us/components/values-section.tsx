"use client"

import { motion } from "motion/react"

import { values } from "../data"

export function ValuesSection() {
  return (
    <section className="bg-card border-t py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-xl text-center">
          <span className="text-primary text-xs font-semibold tracking-widest uppercase">
            Nilai Kami
          </span>
          <h2 className="font-heading mt-2 text-3xl font-bold tracking-tight">
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
              className="bg-background hover:shadow-uber-md rounded-2xl border p-6 transition-all hover:-translate-y-0.5"
            >
              <span className="text-3xl">{item.icon}</span>
              <h3 className="font-heading mt-3 text-base font-semibold">{item.title}</h3>
              <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
