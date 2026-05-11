import { FaqPageContent } from "@/features/faq/components/faq-page-content"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "FAQ - SultanatExplore",
  description:
    "Pertanyaan yang sering ditanyakan tentang perjalanan ke Turki, visa, pembayaran, open trip, private trip, dan paket Umrah.",
}

export default function FaqPage() {
  return <FaqPageContent />
}
