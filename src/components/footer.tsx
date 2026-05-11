"use client";

import React from "react";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

const WHATSAPP_LINK =
  "https://wa.me/6281234567890?text=Halo%20SultanatExplore%2C%20saya%20tertarik%20untuk%20berwisata%20ke%20Turki";

const FOOTER_LINKS = [
  {
    title: "Services",
    links: [
      { label: "Open Trip", href: "#open-trip" },
      { label: "Private Trip", href: "#private-trip" },
      { label: "Umrah", href: "#umrah" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#about" },
      { label: "Destinations", href: "#destinations" },
      { label: "Articles", href: "#articles" },
      { label: "Contact", href: "#contact" },
    ],
  },
];

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
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <circle cx="17" cy="7" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="12" cy="12" r="5" />
      </svg>
    ),
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Main footer */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand column */}
          <div className="md:col-span-5">
            <Link href="/" className="inline-block group">
              <span className="font-heading text-xl font-bold tracking-tight">
                Sultanat
                <span className="text-primary">Explore</span>
              </span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-xs">
              Agen wisata Turki terpercaya untuk traveler Indonesia. Berbasis
              langsung di Turki dengan tim profesional.
            </p>

            {/* Socials */}
            <div className="mt-5 flex items-center gap-2">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex items-center justify-center h-9 w-9 rounded-lg border border-border/60 text-muted-foreground hover:text-foreground hover:border-foreground/30 hover:bg-accent/50 transition-all"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_LINKS.map((group) => (
            <div key={group.title} className="md:col-span-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {group.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
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
        <div className="border-t border-border/40 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} SultanatExplore. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Made with ❤️ for Indonesian travelers
          </p>
        </div>
      </div>
    </footer>
  );
}
