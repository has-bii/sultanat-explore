import { MessageCircle } from "lucide-react"

const WHATSAPP_LINK =
  "https://wa.me/6281234567890?text=Halo%20SultanatExplore%2C%20saya%20tertarik%20untuk%20berwisata%20ke%20Turki"

export function CTASection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-4xl px-6">
        <div className="bg-primary text-primary-foreground relative overflow-hidden rounded-3xl px-8 py-16 text-center">
          {/* Decorative circles */}
          <div className="bg-primary-foreground/5 absolute -top-12 -left-12 h-48 w-48 rounded-full" />
          <div className="bg-primary-foreground/5 absolute -right-16 -bottom-16 h-64 w-64 rounded-full" />

          <div className="relative z-10">
            <h2 className="font-heading text-subheading sm:text-heading font-bold">
              Bebas Konsultasi
            </h2>
            <p className="text-body text-primary-foreground/80 mx-auto mt-4 max-w-lg">
              Hubungi kami sekarang melalui WhatsApp untuk konsultasi gratis dan dapatkan penawaran
              terbaik untuk perjalanan impian Anda.
            </p>

            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-white px-8 text-base font-semibold transition-colors hover:bg-white/90"
            >
              <MessageCircle className="h-5 w-5" />
              Chat WhatsApp Sekarang
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
