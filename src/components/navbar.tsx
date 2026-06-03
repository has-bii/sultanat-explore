"use client"

import { ChevronDown, Menu, MessageCircle, X } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useCallback, useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

const WHATSAPP_LINK =
  "https://wa.me/6281234567890?text=Halo%20SultanatExplore%2C%20saya%20tertarik%20untuk%20berwisata%20ke%20Turki"

interface NavItem {
  label: string
  href: string
  children?: { label: string; href: string; description: string }[]
}

const NAV_ITEMS: NavItem[] = [
  { label: "Beranda", href: "/" },
  {
    label: "Layanan",
    href: "#",
    children: [
      {
        label: "Open Trip",
        href: "/open-trip",
        description: "Bergabung dengan traveler lain. Hemat dan seru!",
      },
      {
        label: "Private Trip",
        href: "/private-trip",
        description: "Perjalanan eksklusif sesuai jadwal & keinginan Anda.",
      },
      {
        label: "Umrah",
        href: "/umrah",
        description: "Paket Umrah terlengkap dengan pelayanan terbaik.",
      },
    ],
  },
  { label: "Destinasi", href: "/destinations" },
  { label: "Artikel", href: "/artikel" },
  { label: "Tentang Kami", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Kontak", href: "/contact" },
]

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/"
  return pathname.startsWith(href)
}

function ServicesDropdown({
  items,
  isOpen,
  onClose,
  inverted,
}: {
  items: NavItem["children"]
  isOpen: boolean
  onClose: () => void
  inverted: boolean
}) {
  if (!items) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.96 }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="absolute top-full left-1/2 w-72 -translate-x-1/2 pt-3"
          onMouseLeave={onClose}
        >
          <div
            className={cn(
              "border-border/60 rounded-2xl border p-2 shadow-xl shadow-black/5 backdrop-blur-xl",
              inverted ? "border-white/10 bg-black/90" : "bg-background/95",
            )}
          >
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "group hover:bg-accent/80 flex flex-col gap-0.5 rounded-xl px-4 py-3 transition-colors",
                  inverted && "hover:bg-white/10",
                )}
              >
                <span
                  className={cn(
                    "text-sm font-semibold transition-colors",
                    inverted
                      ? "text-white group-hover:text-white/80"
                      : "text-foreground group-hover:text-primary",
                  )}
                >
                  {item.label}
                </span>
                <span
                  className={cn(
                    "text-xs leading-relaxed",
                    inverted ? "text-white/50" : "text-muted-foreground",
                  )}
                >
                  {item.description}
                </span>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function MobileOverlay({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname()
  const [servicesOpen, setServicesOpen] = useState(false)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex flex-col bg-black"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-6">
            <span className="font-heading text-xl font-bold tracking-tight text-white">
              Sultanat
              <span className="text-white/70">Explore</span>
            </span>
            <button
              onClick={onClose}
              className="rounded-full p-2 transition-colors hover:bg-white/10"
              aria-label="Tutup menu"
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex-1 space-y-1 overflow-y-auto px-8 py-4">
            {NAV_ITEMS.map((item) =>
              item.children ? (
                <div key={item.label}>
                  <button
                    onClick={() => setServicesOpen(!servicesOpen)}
                    className="flex w-full items-center justify-between py-3 text-2xl font-medium text-white/80 transition-colors hover:text-white"
                  >
                    {item.label}
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 text-white/50 transition-transform duration-200",
                        servicesOpen && "rotate-180",
                      )}
                    />
                  </button>
                  <AnimatePresence>
                    {servicesOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-1 pb-2 pl-4">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={onClose}
                              className={cn(
                                "block py-2 text-lg transition-colors",
                                isActive(pathname, child.href)
                                  ? "font-medium text-white"
                                  : "text-white/50 hover:text-white/80",
                              )}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "block py-3 text-2xl font-medium transition-colors",
                    isActive(pathname, item.href) ? "text-white" : "text-white/80 hover:text-white",
                  )}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          {/* Bottom CTA */}
          <div className="px-8 pt-4 pb-8">
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="active:shadow-uber-pressed flex w-full items-center justify-center gap-2.5 rounded-full bg-white py-4 text-base font-semibold text-black transition-all hover:bg-white/90"
            >
              <MessageCircle className="h-5 w-5" />
              Chat WhatsApp
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [inverted, setInverted] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 50)
  }, [])

  // Observe [data-nav-theme="dark"] sentinels for color inversion
  useEffect(() => {
    const observer = new IntersectionObserver(
      () => {
        const sentinels = document.querySelectorAll('[data-nav-theme="dark"]')
        const navbarBottom = 80
        let anyOverlap = false
        sentinels.forEach((el) => {
          const rect = el.getBoundingClientRect()
          if (rect.top < navbarBottom && rect.bottom > 0) {
            anyOverlap = true
          }
        })
        setInverted(anyOverlap)
      },
      { threshold: [0, 0.1, 0.5, 1] },
    )
    observerRef.current = observer

    const observe = () => {
      const sentinels = document.querySelectorAll('[data-nav-theme="dark"]')
      sentinels.forEach((el) => observer.observe(el))
    }

    observe()

    const mo = new MutationObserver(observe)
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      mo.disconnect()
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  const shouldInvert = inverted && !scrolled

  return (
    <>
      <header
        className={cn(
          "fixed top-0 right-0 left-0 z-30 transition-all duration-500",
          scrolled
            ? "border-border/40 border-b bg-white/95 shadow-sm shadow-black/5 backdrop-blur-xl"
            : "bg-transparent",
        )}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="group relative z-10">
              <span
                className={cn(
                  "font-heading text-xl font-bold tracking-tight transition-colors",
                  shouldInvert
                    ? "text-white group-hover:text-white/80"
                    : "text-foreground group-hover:text-foreground/80",
                )}
              >
                Sultanat
                <span className={shouldInvert ? "text-white/70" : "text-primary"}>Explore</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden items-center gap-1 lg:flex">
              {NAV_ITEMS.map((item) =>
                item.children ? (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => setServicesOpen(true)}
                    onMouseLeave={() => setServicesOpen(false)}
                  >
                    <button
                      className={cn(
                        "flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors",
                        shouldInvert && !servicesOpen && "text-white/70 hover:text-white",
                        shouldInvert && servicesOpen && "text-white",
                        !shouldInvert &&
                          !servicesOpen &&
                          "text-foreground/70 hover:text-foreground",
                        !shouldInvert && servicesOpen && "text-foreground",
                      )}
                    >
                      {item.label}
                      <ChevronDown
                        className={cn(
                          "h-3.5 w-3.5 transition-transform duration-200",
                          servicesOpen && "rotate-180",
                        )}
                      />
                    </button>
                    <ServicesDropdown
                      items={item.children}
                      isOpen={servicesOpen}
                      onClose={() => setServicesOpen(false)}
                      inverted={shouldInvert}
                    />
                  </div>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "relative px-3 py-2 text-sm font-medium transition-colors",
                      isActive(pathname, item.href)
                        ? shouldInvert
                          ? "text-white"
                          : "text-foreground"
                        : shouldInvert
                          ? "text-white/70 hover:text-white"
                          : "text-foreground/70 hover:text-foreground",
                    )}
                  >
                    {item.label}
                    {/* Active underline */}
                    {isActive(pathname, item.href) && (
                      <span
                        className={cn(
                          "absolute right-3 bottom-0 left-3 h-0.5 rounded-full",
                          shouldInvert ? "bg-white" : "bg-foreground",
                        )}
                      />
                    )}
                  </Link>
                ),
              )}
            </nav>

            {/* Desktop CTA + mobile toggle */}
            <div className="flex items-center gap-3">
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "active:shadow-uber-pressed hidden items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all lg:inline-flex",
                  shouldInvert
                    ? "bg-white text-black hover:bg-white/90"
                    : "bg-primary text-primary-foreground hover:opacity-90",
                )}
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>

              <button
                onClick={() => setMobileOpen(true)}
                className={cn(
                  "relative z-10 rounded-full p-2 transition-colors lg:hidden",
                  shouldInvert ? "text-white hover:bg-white/10" : "hover:bg-accent/60",
                )}
                aria-label="Buka menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileOverlay isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}
