import { Check, MessageCircle, X } from "lucide-react"

import { formatPrice } from "@/utils/format-price"
import { format } from "date-fns"
import { id } from "date-fns/locale"

import { type OpenTripInclusionDetail, computeDuration } from "./lib/fetch"

const WHATSAPP_BASE = "https://wa.me/6281234567890?text="

function formatDate(dateStr: string) {
  return format(dateStr, "PP", { locale: id })
}

type Props = {
  inclusions: OpenTripInclusionDetail[]
  title: string
  price: number
  startAt: string
  endAt: string
}

export function InclusionSection({ inclusions, title, price, startAt, endAt }: Props) {
  const includes = inclusions.filter((i) => i.type === "include")
  const excludes = inclusions.filter((i) => i.type === "exclude")

  const waText = encodeURIComponent(
    `Halo SultanatExplore, saya tertarik dengan Open Trip "${title}" pada ${formatDate(startAt)}. Apakah masih tersedia?`,
  )
  const waLink = `${WHATSAPP_BASE}${waText}`

  return (
    <section className="space-y-8">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Inclusions */}
        <div className="bg-card rounded-2xl border p-6">
          <h3 className="font-heading flex items-center gap-2 text-lg font-semibold">
            <span className="bg-primary/10 text-primary flex h-7 w-7 items-center justify-center rounded-full">
              <Check className="h-4 w-4" />
            </span>
            Termasuk
          </h3>
          <ul className="mt-4 space-y-2.5">
            {includes.map((inc) => (
              <li key={inc.id} className="text-muted-foreground flex items-center gap-2.5 text-sm">
                <span className="bg-primary/10 text-primary flex h-5 w-5 items-center justify-center rounded-full">
                  <Check className="h-3 w-3" />
                </span>
                {inc.inclusionItem.label}
              </li>
            ))}
          </ul>
        </div>

        {/* Exclusions */}
        <div className="bg-card rounded-2xl border p-6">
          <h3 className="font-heading flex items-center gap-2 text-lg font-semibold">
            <span className="bg-foreground/10 text-foreground flex h-7 w-7 items-center justify-center rounded-full">
              <X className="h-4 w-4" />
            </span>
            Tidak Termasuk
          </h3>
          <ul className="mt-4 space-y-2.5">
            {excludes.map((exc) => (
              <li key={exc.id} className="text-muted-foreground flex items-center gap-2.5 text-sm">
                <X className="text-foreground/40 h-3.5 w-3.5" />
                {exc.inclusionItem.label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Price + WhatsApp CTA */}
      <div className="border-primary/20 bg-primary/5 rounded-2xl border-2 p-6 text-center">
        <p className="text-muted-foreground text-sm">Mulai dari</p>
        <p className="font-heading text-primary mt-1 text-3xl font-bold">
          {formatPrice(price)}
          <span className="text-muted-foreground ml-1 text-base font-normal">/orang</span>
        </p>
        <p className="text-muted-foreground mt-1 text-sm">
          {computeDuration(startAt, endAt)} · {formatDate(startAt)}
        </p>
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-primary text-primary-foreground active:shadow-uber-pressed mt-5 inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold transition-all hover:opacity-90"
        >
          <MessageCircle className="h-5 w-5" />
          Pesan via WhatsApp
        </a>
      </div>
    </section>
  )
}
