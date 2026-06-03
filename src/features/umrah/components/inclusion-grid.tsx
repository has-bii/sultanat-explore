import {
  BookOpen,
  Building2,
  Car,
  Compass,
  FileCheck,
  Package,
  ShieldCheck,
  Utensils,
  type LucideIcon,
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
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Fasilitas
          </span>
          <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight">
            Semua Termasuk, Tanpa Biaya Tersembunyi
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Harga paket sudah mencakup seluruh kebutuhan perjalanan Umrah Anda
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {inclusions.map((item) => {
            const Icon = iconMap[item.icon]
            return (
              <div
                key={item.title}
                className="rounded-2xl border bg-background p-5 shadow-uber-sm transition-shadow hover:shadow-uber-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  {Icon && <Icon className="h-5 w-5 text-primary" />}
                </div>
                <h3 className="mt-3 font-heading text-sm font-semibold">{item.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
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
