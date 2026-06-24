import { cn } from "@/lib/utils"
import RootProviders from "@/providers/root"
import type { Metadata } from "next"
import { DM_Sans, Geist, Geist_Mono, Inter } from "next/font/google"
import { NuqsAdapter } from "nuqs/adapters/next/app"

import "./globals.css"

const dmSansHeading = DM_Sans({ subsets: ["latin"], variable: "--font-heading" })

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://sultanatexplore.com"

if (process.env.NODE_ENV !== "production" && !process.env.NEXT_PUBLIC_SITE_URL) {
  console.warn(
    "NEXT_PUBLIC_SITE_URL is not set; falling back to https://sultanatexplore.com. " +
      "Set it in your environment so OG/canonical URLs resolve absolute.",
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SultanatExplore — Jelajahi Turki & Umrah",
    template: "%s | SultanatExplore",
  },
  description:
    "Agen wisata Turki terpercaya untuk traveler Indonesia. Open trip, private trip, dan paket Umrah.",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteUrl,
    siteName: "SultanatExplore",
    images: [
      {
        url: "/og/default.svg",
        width: 1200,
        height: 630,
        alt: "SultanatExplore — Jelajahi Turki & Umrah",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@sultanatexplore",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
        dmSansHeading.variable,
      )}
    >
      <body className="flex min-h-full flex-col">
        <NuqsAdapter>
          <main className="flex-1">
            <RootProviders>{children}</RootProviders>
          </main>
        </NuqsAdapter>
      </body>
    </html>
  )
}
