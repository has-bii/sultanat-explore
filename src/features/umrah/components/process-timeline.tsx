"use client"

import { FileText, Headphones, MessageCircle, Plane } from "lucide-react"
import { processSteps } from "../data"

const iconMap = [MessageCircle, Headphones, FileText, Plane]

export function ProcessTimeline() {
  return (
    <section className="border-y bg-card py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Proses
          </span>
          <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight">
            Dari Konsultasi ke Tanah Suci
          </h2>
        </div>

        <div className="relative mt-14">
          {/* Connecting line */}
          <div className="absolute top-10 left-0 right-0 hidden lg:block">
            <div className="mx-auto max-w-4xl border-t-2 border-dashed border-primary/15" />
          </div>

          <div className="grid gap-10 lg:grid-cols-4 lg:gap-8">
            {processSteps.map((item, i) => {
              const Icon = iconMap[i]
              return (
                <div key={item.step} className="flex flex-col items-center text-center">
                  <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-uber-md">
                    <Icon className="h-6 w-6" />
                    <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-background text-xs font-bold text-primary ring-2 ring-primary/30">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="mt-4 font-heading text-base font-semibold">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
