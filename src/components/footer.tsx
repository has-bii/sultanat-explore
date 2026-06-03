"use client"

import { MessageCircle } from "lucide-react"
import Link from "next/link"

const WHATSAPP_LINK =
  "https://wa.me/6281234567890?text=Halo%20SultanatExplore%2C%20saya%20tertarik%20untuk%20berwisata%20ke%20Turki"

const FOOTER_COLUMNS = [
  {
    title: "Trip",
    links: [
      { label: "Open Trip", href: "/open-trip" },
      { label: "Private Trip", href: "/private-trip" },
      { label: "Umrah", href: "/umrah" },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "Destinasi", href: "/destinations" },
      { label: "Artikel", href: "/artikel" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Perusahaan",
    links: [
      { label: "Tentang Kami", href: "/about" },
      { label: "Kontak", href: "/contact" },
    ],
  },
]

const SOCIALS = [
  {
    label: "WhatsApp",
    href: WHATSAPP_LINK,
    icon: MessageCircle,
  },
  {
    label: "Instagram",
    href: "https://instagram.com/sultanatexplore",
    icon: () => (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <circle cx="17" cy="7" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="12" cy="12" r="5" />
      </svg>
    ),
  },
]

export function Footer() {
  return (
    <footer className="bg-black">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Main footer */}
        <div className="py-14 grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand column */}
          <div className="md:col-span-12 lg:col-span-6">
            <Link href="/" className="inline-block group">
              <span className="font-heading text-xl font-bold tracking-tight text-white group-hover:text-white/80 transition-colors">
                Sultanat
                <span className="text-white/70">Explore</span>
              </span>
            </Link>
            <p className="mt-3 text-sm text-white/40 leading-relaxed max-w-xs">
              Agen wisata Turki terpercaya untuk traveler Indonesia. Berbasis langsung di Turki
              dengan tim profesional.
            </p>

            {/* Socials — ghost icons */}
            <div className="mt-5 flex items-center gap-3">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="text-white/40 hover:text-white transition-colors"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_COLUMNS.map((group) => (
            <div key={group.title} className="md:col-span-4 lg:col-span-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40">
                {group.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/50 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} SultanatExplore. All rights reserved.
          </p>
          <p className="text-xs text-white/30">Made with ❤️ for Indonesian travelers</p>
        </div>
      </div>
    </footer>
  )
}
