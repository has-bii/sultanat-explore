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

export const metadata: Metadata = {
  title: "SultanatExplore — Jelajahi Turki & Umrah",
  description:
    "Agen wisata Turki terpercaya untuk traveler Indonesia. Open trip, private trip, dan paket Umrah.",
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
