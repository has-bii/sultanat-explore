import {
  BookOpen,
  Building2,
  Car,
  Compass,
  FileCheck,
  type LucideIcon,
  Package,
  ShieldCheck,
  Utensils,
} from "lucide-react"

import { inclusions } from "../data"

const iconMap: Record<string, LucideIcon> = {
  building: Building2,
  utensils: Utensils,
  car: Car,
  "book-open": BookOpen,
  compass: Compass,
  "file-check": FileCheck,
  "shield-check": ShieldCheck,
  package: Package,
}

export function InclusionGrid() {
  return (
    <section className="py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <span className="text-primary text-xs font-semibold tracking-widest uppercase">
            Fasilitas
          </span>
          <h2 className="font-heading mt-2 text-3xl font-bold tracking-tight">
            Semua Termasuk, Tanpa Biaya Tersembunyi
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Harga paket sudah mencakup seluruh kebutuhan perjalanan Umrah Anda
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {inclusions.map((item) => {
            const Icon = iconMap[item.icon]
            return (
              <div
                key={item.title}
                className="bg-background shadow-uber-sm hover:shadow-uber-md rounded-2xl border p-5 transition-shadow"
              >
                <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-xl">
                  {Icon && <Icon className="text-primary h-5 w-5" />}
                </div>
                <h3 className="font-heading mt-3 text-sm font-semibold">{item.title}</h3>
                <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                  {item.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
