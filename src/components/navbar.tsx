"use client"

import { cn } from "@/lib/utils"
import { ChevronDown, Menu, MessageCircle, X } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"

const WHATSAPP_LINK =
  "https://wa.me/6281234567890?text=Halo%20SultanatExplore%2C%20saya%20tertarik%20untuk%20berwisata%20ke%20Turki"

interface NavItem {
  label: string
  href: string
  children?: { label: string; href: string; description: string }[]
}

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Services",
    href: "/services",
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
  { label: "Destinations", href: "/destinations" },
  { label: "Artikel", href: "/artikel" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
]

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
          className="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-72"
          onMouseLeave={onClose}
        >
          <div className={cn(
            "rounded-2xl border border-border/60 backdrop-blur-xl p-2 shadow-xl shadow-black/5",
            inverted ? "bg-black/90 border-white/10" : "bg-background/95",
          )}>
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "group flex flex-col gap-0.5 rounded-xl px-4 py-3 transition-colors hover:bg-accent/80",
                  inverted && "hover:bg-white/10",
                )}
              >
                <span className={cn(
                  "text-sm font-semibold transition-colors",
                  inverted
                    ? "text-white group-hover:text-white/80"
                    : "text-foreground group-hover:text-primary",
                )}>
                  {item.label}
                </span>
                <span className={cn(
                  "text-xs leading-relaxed",
                  inverted ? "text-white/50" : "text-muted-foreground",
                )}>
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

function MobileMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [servicesOpen, setServicesOpen] = useState(false)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-[85%] max-w-sm bg-background/98 backdrop-blur-xl border-l border-border/40"
          >
            <div className="flex items-center justify-between p-6 border-b border-border/40">
              <span className="font-heading text-lg font-bold tracking-tight">
                Sultanat
                <span className="text-primary">Explore</span>
              </span>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-accent transition-colors"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="p-6 space-y-1">
              {NAV_ITEMS.map((item) =>
                item.children ? (
                  <div key={item.label}>
                    <button
                      onClick={() => setServicesOpen(!servicesOpen)}
                      className="flex items-center justify-between w-full py-3 px-3 rounded-xl text-base font-medium hover:bg-accent transition-colors"
                    >
                      {item.label}
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 text-muted-foreground transition-transform duration-200",
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
                          <div className="pl-4 pb-2 space-y-0.5">
                            {item.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                onClick={onClose}
                                className="flex flex-col gap-0.5 py-2.5 px-3 rounded-lg hover:bg-accent/60 transition-colors"
                              >
                                <span className="text-sm font-medium">{child.label}</span>
                                <span className="text-xs text-muted-foreground">
                                  {child.description}
                                </span>
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
                    className="block py-3 px-3 rounded-xl text-base font-medium hover:bg-accent transition-colors"
                  >
                    {item.label}
                  </Link>
                ),
              )}
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-border/40">
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all active:shadow-uber-pressed"
              >
                <MessageCircle className="h-4.5 w-4.5" />
                Chat WhatsApp
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export function Navbar() {
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
        // Check if any dark sentinel overlaps the navbar zone
        const sentinels = document.querySelectorAll('[data-nav-theme="dark"]')
        const navbarBottom = 80
        let anyOverlap = false
        sentinels.forEach((el) => {
          const rect = el.getBoundingClientRect()
          // Sentinel top is above navbar bottom = overlap
          if (rect.top < navbarBottom && rect.bottom > 0) {
            anyOverlap = true
          }
        })
        setInverted(anyOverlap)
      },
      {
        // Observe when elements enter/leave viewport
        threshold: [0, 0.1, 0.5, 1],
      }
    )
    observerRef.current = observer

    // Observe all dark-theme sentinels
    const observe = () => {
      const sentinels = document.querySelectorAll('[data-nav-theme="dark"]')
      sentinels.forEach((el) => observer.observe(el))
    }

    observe()

    // Re-observe on DOM changes (page navigations)
    const mo = new MutationObserver(observe)
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      mo.disconnect()
    }
  }, [])

  useEffect(() => {
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  // When scrolled (bg fills in), never invert — bg is solid
  const shouldInvert = inverted && !scrolled

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-30 transition-all duration-500",
          scrolled
            ? "bg-background/90 backdrop-blur-xl border-b border-border/40 shadow-sm shadow-black/5"
            : "bg-transparent",
        )}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="relative z-10 group">
              <span className={cn(
                "font-heading text-xl font-bold tracking-tight transition-colors",
                shouldInvert
                  ? "text-white group-hover:text-white/80"
                  : "text-foreground group-hover:text-foreground/80",
              )}>
                Sultanat
                <span className={shouldInvert ? "text-white/70" : "text-primary"}>Explore</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
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
                        "flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors",
                        shouldInvert && !servicesOpen && "text-white/70 hover:text-white hover:bg-white/10",
                        shouldInvert && servicesOpen && "text-white bg-white/10",
                        !shouldInvert && !servicesOpen && "text-foreground/70 hover:text-foreground hover:bg-accent/40",
                        !shouldInvert && servicesOpen && "text-foreground bg-accent/60",
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
                      "px-3.5 py-2 rounded-lg text-sm font-medium transition-colors",
                      shouldInvert
                        ? "text-white/70 hover:text-white hover:bg-white/10"
                        : "text-foreground/70 hover:text-foreground hover:bg-accent/40",
                    )}
                  >
                    {item.label}
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
                  "hidden lg:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all active:shadow-uber-pressed",
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
                  "lg:hidden relative z-10 p-2 rounded-xl transition-colors",
                  shouldInvert
                    ? "text-white hover:bg-white/10"
                    : "hover:bg-accent/60",
                )}
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}
