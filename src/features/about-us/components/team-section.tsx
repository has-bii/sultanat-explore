"use client"

import { motion } from "motion/react"

import Image from "next/image"

import { team } from "../data"

export function TeamSection() {
  return (
    <section className="py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-xl text-center">
          <span className="text-primary text-xs font-semibold tracking-widest uppercase">
            Tim Kami
          </span>
          <h2 className="font-heading mt-2 text-3xl font-bold tracking-tight">
            Orang di Balik Layar
          </h2>
          <p className="text-muted-foreground mt-3">
            Tim kecil yang berdedikasi. Setiap orang punya peran penting untuk memastikan perjalanan
            Anda sempurna.
          </p>
        </div>

        {/* Card Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              viewport={{ once: true }}
              className="group bg-background hover:shadow-uber-md rounded-2xl border p-6 text-center transition-all hover:-translate-y-0.5"
            >
              {/* Avatar */}
              <div className="mx-auto h-24 w-24 overflow-hidden rounded-full">
                <Image
                  fill
                  src={member.image}
                  alt={member.name}
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="96px"
                />
              </div>

              <h3 className="font-heading mt-4 text-base font-semibold">{member.name}</h3>
              <span className="bg-primary/10 text-primary mt-0.5 inline-block rounded-full px-3 py-0.5 text-xs font-medium">
                {member.role}
              </span>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed">{member.bio}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
