"use client"

import {
  Check,
  ChevronLeft,
  ChevronRight,
  MapPin,
  MessageCircle,
  Minus,
  Plus,
  Sparkles,
} from "lucide-react"
import { useMemo, useState } from "react"

import Image from "next/image"

import { cities, formatPrice, services } from "../data"
import type { ServiceCategory } from "../types"

const categoryLabels: Record<ServiceCategory, string> = {
  transport: "Transportasi",
  akomodasi: "Akomodasi",
  aktivitas: "Aktivitas",
  dokumen: "Dokumen & Lainnya",
}

const categoryOrder: ServiceCategory[] = ["transport", "akomodasi", "aktivitas", "dokumen"]

export function TripBuilderWizard() {
  const [step, setStep] = useState(1)
  const [selectedCities, setSelectedCities] = useState<Set<string>>(new Set())
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set())
  const [days, setDays] = useState(5)
  const [travelers, setTravelers] = useState(2)

  const toggleCity = (id: string) => {
    setSelectedCities((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleService = (id: string) => {
    setSelectedServices((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const priceEstimate = useMemo(() => {
    const selectedCityData = cities.filter((c) => selectedCities.has(c.id))
    const cityCost = selectedCityData.reduce(
      (sum, c) => sum + c.basePricePerPersonPerDay * days * travelers,
      0,
    )
    const selectedServiceData = services.filter((s) => selectedServices.has(s.id))
    const serviceCost = selectedServiceData.reduce((sum, s) => {
      return sum + (s.priceType === "per-person" ? s.price * travelers : s.price)
    }, 0)
    return cityCost + serviceCost
  }, [selectedCities, selectedServices, days, travelers])

  const whatsappMessage = useMemo(() => {
    const selectedCityData = cities.filter((c) => selectedCities.has(c.id))
    const selectedServiceData = services.filter((s) => selectedServices.has(s.id))
    let msg = "Halo SultanatExplore, saya tertarik private trip!\n\n"
    msg += `📍 Kota: ${selectedCityData.map((c) => c.name).join(", ") || "Belum dipilih"}\n`
    msg += `📅 Durasi: ${days} hari\n`
    msg += `👥 Jumlah orang: ${travelers}\n`
    if (selectedServiceData.length > 0) {
      msg += `\n✨ Layanan tambahan:\n`
      selectedServiceData.forEach((s) => {
        msg += `  - ${s.name}\n`
      })
    }
    msg += `\n💰 Estimasi: ${formatPrice(priceEstimate)}`
    return encodeURIComponent(msg)
  }, [selectedCities, selectedServices, days, travelers, priceEstimate])

  const canNext = step === 1 ? selectedCities.size > 0 : true

  const steps = [
    { num: 1, label: "Pilih Kota" },
    { num: 2, label: "Pilih Layanan" },
    { num: 3, label: "Ringkasan" },
  ]

  return (
    <section className="py-20 lg:py-24">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <span className="text-primary text-xs font-semibold tracking-widest uppercase">
            Trip Builder
          </span>
          <h2 className="font-heading mt-2 text-3xl font-bold tracking-tight">
            Bangun Trip Impianmu
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Pilih kota, layanan, dan lihat estimasi harga — semua dalam hitungan menit
          </p>
        </div>

        {/* Step indicator */}
        <div className="mt-10 flex items-center justify-center gap-2">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center gap-2">
              <div
                className={`flex h-8 items-center gap-2 rounded-full px-4 text-xs font-semibold transition-colors ${
                  step === s.num
                    ? "bg-primary text-primary-foreground"
                    : step > s.num
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {step > s.num ? <Check className="h-3.5 w-3.5" /> : <span>{s.num}</span>}
                <span className="hidden sm:inline">{s.label}</span>
              </div>
              {i < steps.length - 1 && <div className="bg-border h-px w-8 sm:w-12" />}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="bg-background shadow-uber-sm mt-8 rounded-2xl border p-6 sm:p-8">
          {/* Step 1: Cities */}
          {step === 1 && (
            <div>
              <h3 className="font-heading text-lg font-semibold">
                Pilih Kota yang Ingin Dikunjungi
              </h3>
              <p className="text-muted-foreground mt-1 text-sm">
                Pilih satu atau lebih kota tujuan perjalanan Anda
              </p>

              {/* Days & Travelers */}
              <div className="mt-6 flex flex-wrap gap-4">
                <div className="bg-background flex items-center gap-3 rounded-full border px-4 py-2">
                  <span className="text-sm font-medium">Hari:</span>
                  <button
                    onClick={() => setDays(Math.max(1, days - 1))}
                    className="bg-muted hover:bg-primary/10 flex h-6 w-6 items-center justify-center rounded-full"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-6 text-center text-sm font-bold">{days}</span>
                  <button
                    onClick={() => setDays(Math.min(30, days + 1))}
                    className="bg-muted hover:bg-primary/10 flex h-6 w-6 items-center justify-center rounded-full"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                <div className="bg-background flex items-center gap-3 rounded-full border px-4 py-2">
                  <span className="text-sm font-medium">Orang:</span>
                  <button
                    onClick={() => setTravelers(Math.max(1, travelers - 1))}
                    className="bg-muted hover:bg-primary/10 flex h-6 w-6 items-center justify-center rounded-full"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-6 text-center text-sm font-bold">{travelers}</span>
                  <button
                    onClick={() => setTravelers(Math.min(20, travelers + 1))}
                    className="bg-muted hover:bg-primary/10 flex h-6 w-6 items-center justify-center rounded-full"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* City grid */}
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {cities.map((city) => {
                  const isSelected = selectedCities.has(city.id)
                  return (
                    <button
                      key={city.id}
                      onClick={() => toggleCity(city.id)}
                      className={`group relative overflow-hidden rounded-2xl border text-left transition-all ${
                        isSelected
                          ? "border-primary ring-primary/20 ring-2"
                          : "hover:border-primary/30"
                      }`}
                    >
                      <div className="relative h-28 overflow-hidden">
                        <Image
                          fill
                          src={city.image}
                          alt={city.name}
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-2 left-3">
                          <span className="text-sm font-bold text-white">{city.name}</span>
                        </div>
                        {isSelected && (
                          <div className="bg-primary absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full">
                            <Check className="text-primary-foreground h-3 w-3" />
                          </div>
                        )}
                      </div>
                      <div className="px-3 py-2">
                        <p className="text-muted-foreground text-[11px] leading-snug">
                          {city.description}
                        </p>
                        <p className="text-primary mt-1 text-[11px] font-semibold">
                          Mulai {formatPrice(city.basePricePerPersonPerDay)}/orang/hari
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Step 2: Services */}
          {step === 2 && (
            <div>
              <h3 className="font-heading text-lg font-semibold">Pilih Layanan Tambahan</h3>
              <p className="text-muted-foreground mt-1 text-sm">
                Tambahkan layanan untuk pengalaman yang lebih baik
              </p>

              <div className="mt-6 space-y-6">
                {categoryOrder.map((cat) => {
                  const catServices = services.filter((s) => s.category === cat)
                  if (catServices.length === 0) return null
                  return (
                    <div key={cat}>
                      <h4 className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
                        {categoryLabels[cat]}
                      </h4>
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        {catServices.map((service) => {
                          const isSelected = selectedServices.has(service.id)
                          return (
                            <button
                              key={service.id}
                              onClick={() => toggleService(service.id)}
                              className={`flex items-start gap-3 rounded-xl border p-3 text-left transition-all ${
                                isSelected
                                  ? "border-primary bg-primary/[0.03] ring-primary/20 ring-1"
                                  : "hover:border-primary/30"
                              }`}
                            >
                              <div
                                className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border transition-colors ${
                                  isSelected
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-border"
                                }`}
                              >
                                {isSelected && <Check className="h-3 w-3" />}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-sm font-semibold">{service.name}</span>
                                  <span className="text-primary flex-shrink-0 text-xs font-semibold">
                                    {formatPrice(service.price)}
                                    <span className="text-muted-foreground font-normal">
                                      /{service.priceType === "per-person" ? "orang" : "grup"}
                                    </span>
                                  </span>
                                </div>
                                <p className="text-muted-foreground mt-0.5 text-[11px] leading-snug">
                                  {service.description}
                                </p>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Step 3: Summary */}
          {step === 3 && (
            <div>
              <h3 className="font-heading text-lg font-semibold">Ringkasan Trip Anda</h3>

              <div className="mt-6 space-y-4">
                {/* Cities */}
                <div className="rounded-xl border p-4">
                  <div className="text-muted-foreground flex items-center gap-2 text-xs font-semibold tracking-widest uppercase">
                    <MapPin className="h-3.5 w-3.5" />
                    Kota
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {cities
                      .filter((c) => selectedCities.has(c.id))
                      .map((c) => (
                        <span
                          key={c.id}
                          className="bg-primary/10 text-primary inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium"
                        >
                          {c.name}
                        </span>
                      ))}
                  </div>
                </div>

                {/* Details */}
                <div className="rounded-xl border p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-muted-foreground text-xs">Durasi</p>
                      <p className="text-sm font-semibold">{days} Hari</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Jumlah Orang</p>
                      <p className="text-sm font-semibold">{travelers} Orang</p>
                    </div>
                  </div>
                </div>

                {/* Services */}
                {selectedServices.size > 0 && (
                  <div className="rounded-xl border p-4">
                    <div className="text-muted-foreground flex items-center gap-2 text-xs font-semibold tracking-widest uppercase">
                      <Sparkles className="h-3.5 w-3.5" />
                      Layanan Tambahan
                    </div>
                    <ul className="mt-2 space-y-1">
                      {services
                        .filter((s) => selectedServices.has(s.id))
                        .map((s) => (
                          <li key={s.id} className="flex items-center justify-between text-sm">
                            <span>{s.name}</span>
                            <span className="font-semibold">
                              {formatPrice(
                                s.priceType === "per-person" ? s.price * travelers : s.price,
                              )}
                            </span>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}

                {/* Price estimate */}
                <div className="bg-primary text-primary-foreground rounded-xl p-5">
                  <p className="text-primary-foreground/70 text-xs font-medium tracking-wider uppercase">
                    Estimasi Harga Total
                  </p>
                  <p className="font-heading mt-1 text-3xl font-bold">
                    {formatPrice(priceEstimate)}
                  </p>
                  <p className="text-primary-foreground/60 mt-1 text-[11px]">
                    Harga estimasi. Harga final dikonfirmasi setelah konsultasi.
                  </p>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <a
                href={`https://wa.me/6281234567890?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary text-primary-foreground shadow-uber-sm mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full text-base font-semibold transition-all hover:opacity-90"
              >
                <MessageCircle className="h-5 w-5" />
                Chat WhatsApp — Dapatkan Penawaran
              </a>
              <p className="text-muted-foreground mt-2 text-center text-[11px]">
                Ringkasan trip akan otomatis terkirim di WhatsApp
              </p>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="mt-6 flex items-center justify-between border-t pt-4">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="text-muted-foreground hover:text-primary flex items-center gap-1.5 text-sm font-medium transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                Kembali
              </button>
            ) : (
              <div />
            )}
            {step < 3 && (
              <button
                onClick={() => canNext && setStep(step + 1)}
                disabled={!canNext}
                className={`flex items-center gap-1.5 rounded-full px-6 py-2.5 text-sm font-semibold transition-all ${
                  canNext
                    ? "bg-primary text-primary-foreground shadow-uber-sm hover:opacity-90"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              >
                Lanjut
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
