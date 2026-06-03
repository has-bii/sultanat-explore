"use client"

import { motion } from "motion/react"

import { TestimonialsColumn } from "@/components/ui/testimonials-columns-1"
import { testimonials } from "@/data/testimonials"

const firstColumn = testimonials.slice(0, 3)
const secondColumn = testimonials.slice(3, 6)
const thirdColumn = testimonials.slice(6, 9)

export function AboutTestimonials() {
  return (
    <section className="bg-background relative py-20">
      <div className="z-10 container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="mx-auto flex max-w-135 flex-col items-center justify-center"
        >
          <div className="flex justify-center">
            <div className="rounded-full border px-4 py-1">Testimoni</div>
          </div>

          <h2 className="font-heading text-small-heading sm:text-subheading md:text-heading lg:text-card-title xl:text-display mt-5 font-bold tracking-tighter">
            Kata Mereka
          </h2>
          <p className="text-body mt-5 text-center opacity-75">
            Testimoni dari traveler Indonesia yang telah berpetualang bersama kami.
          </p>
        </motion.div>

        <div className="mt-10 flex max-h-185 justify-center gap-6 overflow-hidden mask-[linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn
            testimonials={secondColumn}
            className="hidden md:block"
            duration={19}
          />
          <TestimonialsColumn
            testimonials={thirdColumn}
            className="hidden lg:block"
            duration={17}
          />
        </div>
      </div>
    </section>
  )
}
