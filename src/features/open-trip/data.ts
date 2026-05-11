import type { OpenTrip, TrustBadge } from "./types"

// ─── Trips ────────────────────────────────────────────────────

export const openTrips: OpenTrip[] = [
  {
    slug: "istanbul-cappadocia-7h",
    name: "Istanbul & Cappadocia",
    destination: "Istanbul, Cappadocia",
    image:
      "https://images.unsplash.com/photo-1695415683093-ae5f213ea898?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1695415683093-ae5f213ea898?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1570838478900-3dd1b5236cc2?q=80&w=800&auto=format&fit=crop",
    ],
    departureDate: "2026-07-15",
    duration: "7 Hari",
    durationDays: 7,
    price: 18_500_000,
    totalSeats: 20,
    availableSeats: 8,
    inclusions: [
      { icon: "✈️", label: "Tiket pesawat PP" },
      { icon: "🏨", label: "Hotel bintang 4" },
      { icon: "🚌", label: "Transport privat" },
      { icon: "🍽️", label: "Makan halal" },
      { icon: "🎤", label: "Tour guide Indonesia" },
    ],
    exclusions: [
      "Visa Turki (bisa dibantu pengurusan)",
      "Tip guide & driver",
      "Pengeluaran pribadi",
      "Asuransi perjalanan",
    ],
    highlights: [
      "Hot air balloon Cappadocia",
      "Blue Mosque & Hagia Sophia",
      "Grand Bazaar shopping",
      "Turkish night show",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival Istanbul",
        description:
          "Sesampainya di Istanbul, Anda akan dijemput oleh tim kami dan diantar ke hotel. Acara bebas untuk beristirahat atau menjelajahi sekitar hotel.",
      },
      {
        day: 2,
        title: "Istanbul City Tour",
        description:
          "Mengunjungi Blue Mosque, Hagia Sophia, Hippodrome, dan Topkapi Palace. Sore hari berbelanja di Grand Bazaar.",
      },
      {
        day: 3,
        title: "Istanbul → Cappadocia",
        description:
          "Penerbangan domestic ke Cappadocia. Mengunjungi Goreme Open Air Museum dan Uchisar Castle.",
      },
      {
        day: 4,
        title: "Cappadocia Adventure",
        description:
          "Pagi hari hot air balloon (optional). Tour ke Pasargadae, Avanos pottery village, dan Turkish Night Show setelah makan malam.",
      },
      {
        day: 5,
        title: "Underground City",
        description: "Menjelajahi Derinkuyu Underground City, Ihlara Valley, dan Selime Monastery.",
      },
      {
        day: 6,
        title: "Cappadocia → Istanbul",
        description:
          "Penerbangan kembali ke Istanbul. Sore hari bebas, bisa mengunjungi Spice Bazaar atau Bosphorus cruise (optional).",
      },
      {
        day: 7,
        title: "Departure",
        description:
          "Hari terakhir. Transfer ke bandara untuk penerbangan kembali ke Indonesia. Sampai jumpa, Turki!",
      },
    ],
  },
  {
    slug: "istanbul-pamukkale-5h",
    name: "Istanbul & Pamukkale",
    destination: "Istanbul, Pamukkale",
    image:
      "https://images.unsplash.com/photo-1720974613776-566971057c17?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1720974613776-566971057c17?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1590076082090-3a2a37fe0e20?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1570838478900-3dd1b5236cc2?q=80&w=800&auto=format&fit=crop",
    ],
    departureDate: "2026-08-10",
    duration: "5 Hari",
    durationDays: 5,
    price: 15_900_000,
    totalSeats: 15,
    availableSeats: 12,
    inclusions: [
      { icon: "✈️", label: "Tiket pesawat PP" },
      { icon: "🏨", label: "Hotel bintang 3" },
      { icon: "🚌", label: "Transport privat" },
      { icon: "🍽️", label: "Makan halal" },
      { icon: "🎤", label: "Tour guide Indonesia" },
    ],
    exclusions: [
      "Visa Turki (bisa dibantu pengurusan)",
      "Tip guide & driver",
      "Pengeluaran pribadi",
      "Asuransi perjalanan",
    ],
    highlights: [
      "Pamukkale travertine terraces",
      "Hierapolis ancient city",
      "Istanbul highlights tour",
      "Turkish hammam experience",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival Istanbul",
        description: "Dijemput di bandara Istanbul, transfer ke hotel. Acara bebas.",
      },
      {
        day: 2,
        title: "Istanbul City Tour",
        description:
          "Mengunjungi Blue Mosque, Hagia Sophia, dan Grand Bazaar. Makan siang di restoran halal.",
      },
      {
        day: 3,
        title: "Istanbul → Pamukkale",
        description:
          "Penerbangan ke Denizli. Transfer ke Pamukkale, menikmati pemandangan travertine terraces saat golden hour.",
      },
      {
        day: 4,
        title: "Pamukkale & Hierapolis",
        description:
          "Menjelajahi Pamukkale terraces, Cleopatra Pool, dan Hierapolis ancient city. Sore hari kembali ke Istanbul.",
      },
      {
        day: 5,
        title: "Departure",
        description:
          "Acara bebas sampai waktu transfer ke bandara. Penerbangan kembali ke Indonesia.",
      },
    ],
  },
  {
    slug: "istanbul-antalya-6h",
    name: "Istanbul & Antalya Riviera",
    destination: "Istanbul, Antalya",
    image:
      "https://images.unsplash.com/photo-1644521681185-8b2247db0091?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1624890240392-678d7e836da0?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1590076082090-3a2a37fe0e20?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1570838478900-3dd1b5236cc2?q=80&w=800&auto=format&fit=crop",
    ],
    departureDate: "2026-09-05",
    duration: "6 Hari",
    durationDays: 6,
    price: 17_200_000,
    totalSeats: 18,
    availableSeats: 18,
    inclusions: [
      { icon: "✈️", label: "Tiket pesawat PP" },
      { icon: "🏨", label: "Hotel bintang 4" },
      { icon: "🚌", label: "Transport privat" },
      { icon: "🍽️", label: "Makan halal" },
      { icon: "🎤", label: "Tour guide Indonesia" },
      { icon: "🏖️", label: "Beach tour" },
    ],
    exclusions: [
      "Visa Turki",
      "Tip guide & driver",
      "Pengeluaran pribadi",
      "Asuransi perjalanan",
      "Watersport activities",
    ],
    highlights: [
      "Antalya old town & harbor",
      "Duden Waterfall",
      "Mediterranean coastline",
      "Istanbul cultural tour",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival Istanbul",
        description:
          "Dijemput di bandara, transfer ke hotel. Acara bebas menjelajahi sekitar hotel.",
      },
      {
        day: 2,
        title: "Istanbul Highlights",
        description: "City tour: Blue Mosque, Hagia Sophia, Topkapi Palace, Grand Bazaar.",
      },
      {
        day: 3,
        title: "Istanbul → Antalya",
        description:
          "Penerbangan ke Antalya. Sore hari mengunjungi Antalya Old Town (Kaleici) dan harbor.",
      },
      {
        day: 4,
        title: "Antalya Coast Tour",
        description: "Mengunjungi Duden Waterfall, Konyaalti Beach, dan Antalya Museum.",
      },
      {
        day: 5,
        title: "Antalya → Istanbul",
        description:
          "Pagi bebas. Siang hari penerbangan kembali ke Istanbul. Sore Bosphorus cruise (optional).",
      },
      {
        day: 6,
        title: "Departure",
        description: "Transfer ke bandara. Penerbangan kembali ke Indonesia.",
      },
    ],
  },
  {
    slug: "istanbul-bursa-4h",
    name: "Istanbul & Bursa",
    destination: "Istanbul, Bursa",
    image:
      "https://images.unsplash.com/photo-1516352267226-f5f3e4c53781?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1571935441004-601bab498442?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1570838478900-3dd1b5236cc2?q=80&w=800&auto=format&fit=crop",
    ],
    departureDate: "2026-10-20",
    duration: "4 Hari",
    durationDays: 4,
    price: 12_800_000,
    totalSeats: 25,
    availableSeats: 3,
    inclusions: [
      { icon: "✈️", label: "Tiket pesawat PP" },
      { icon: "🏨", label: "Hotel bintang 3" },
      { icon: "🚌", label: "Transport privat" },
      { icon: "🍽️", label: "Makan halal" },
      { icon: "🎤", label: "Tour guide Indonesia" },
    ],
    exclusions: ["Visa Turki", "Tip guide & driver", "Pengeluaran pribadi"],
    highlights: [
      "Bursa Green Mosque & Tomb",
      "Uludag mountain cable car",
      "Istanbul quick tour",
      "Iskender kebab experience",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival Istanbul",
        description:
          "Dijemput di bandara. City tour singkat: Blue Mosque, Hagia Sophia. Transfer ke hotel.",
      },
      {
        day: 2,
        title: "Istanbul → Bursa",
        description: "Perjalanan ke Bursa. Mengunjungi Green Mosque, Green Tomb, dan Silk Market.",
      },
      {
        day: 3,
        title: "Bursa Mountain & Back",
        description:
          "Cable car ke Uludag mountain. Makan siang Iskender kebab asli. Kembali ke Istanbul.",
      },
      {
        day: 4,
        title: "Departure",
        description: "Acara bebas sampai transfer ke bandara. Penerbangan kembali ke Indonesia.",
      },
    ],
  },
  {
    slug: "istanbul-trabzon-5h",
    name: "Istanbul & Trabzon",
    destination: "Istanbul, Trabzon",
    image:
      "https://images.unsplash.com/photo-1663230812927-dedf2bc78fe9?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1590076082090-3a2a37fe0e20?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1570838478900-3dd1b5236cc2?q=80&w=800&auto=format&fit=crop",
    ],
    departureDate: "2026-11-15",
    duration: "5 Hari",
    durationDays: 5,
    price: 16_500_000,
    totalSeats: 20,
    availableSeats: 20,
    inclusions: [
      { icon: "✈️", label: "Tiket pesawat PP" },
      { icon: "🏨", label: "Hotel bintang 4" },
      { icon: "🚌", label: "Transport privat" },
      { icon: "🍽️", label: "Makan halal" },
      { icon: "🎤", label: "Tour guide Indonesia" },
    ],
    exclusions: ["Visa Turki", "Tip guide & driver", "Pengeluaran pribadi", "Asuransi perjalanan"],
    highlights: [
      "Sümela Monastery",
      "Uzungöl lake",
      "Trabzon Hagia Sophia",
      "Tea plantation visit",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival Istanbul",
        description: "Dijemput di bandara Istanbul. Transfer ke hotel. Acara bebas.",
      },
      {
        day: 2,
        title: "Istanbul City Tour",
        description: "Mengunjungi Blue Mosque, Hagia Sophia, Grand Bazaar, dan Bosphorus.",
      },
      {
        day: 3,
        title: "Istanbul → Trabzon",
        description:
          "Penerbangan ke Trabzon. Mengunjungi Trabzon Hagia Sophia dan Ataturk Pavilion.",
      },
      {
        day: 4,
        title: "Sümela & Uzungöl",
        description:
          "Menjelajahi Sümela Monastery di tebing, lalu ke Uzungöl — danau cantik di pegunungan.",
      },
      {
        day: 5,
        title: "Departure",
        description: "Transfer ke bandara Trabzon via Istanbul. Kembali ke Indonesia.",
      },
    ],
  },
]

// ─── Social Proof Stats ───────────────────────────────────────

export const socialStats = [
  { value: "500+", label: "Traveler Puas" },
  { value: "50+", label: "Trip Selesai" },
  { value: "4.9", label: "Rating" },
  { value: "10+", label: "Destinasi" },
]

// ─── How It Works ─────────────────────────────────────────────

export const howItWorks = [
  {
    step: 1,
    title: "Pilih Trip",
    description: "Pilih destinasi dan tanggal yang Anda inginkan.",
  },
  {
    step: 2,
    title: "Chat WhatsApp",
    description: "Hubungi kami via WhatsApp untuk konfirmasi pemesanan.",
  },
  {
    step: 3,
    title: "Berangkat!",
    description: "Siapkan paspor, kami urus sisanya. Tinggal menikmati!",
  },
]

// ─── Past Trip Gallery ────────────────────────────────────────

export const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?q=80&w=600&auto=format&fit=crop",
    alt: "Hot air balloon Cappadocia",
    span: "col-span-2 row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1649333195003-18c47d64ed18?q=80&w=400&auto=format&fit=crop",
    alt: "Blue Mosque Istanbul",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://images.unsplash.com/photo-1580069491658-8220b0e8722d?q=80&w=400&auto=format&fit=crop",
    alt: "Turkish tea time",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://images.unsplash.com/photo-1564407727371-3eece6c58961?q=80&w=400&auto=format&fit=crop",
    alt: "Istanbul skyline at sunset",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://images.unsplash.com/photo-1566371486037-6072a54daf1f?q=80&w=600&auto=format&fit=crop",
    alt: "Group photo travelers",
    span: "col-span-1 row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1578852952104-54f3dac8b260?q=80&w=400&auto=format&fit=crop",
    alt: "Antalya coast",
    span: "col-span-1 row-span-1",
  },
]

// ─── Trust Badges ─────────────────────────────────────────────

export const trustBadges: TrustBadge[] = [
  {
    icon: "清真",
    title: "Garansi Halal",
    description: "Semua makanan & restoran terjamin halal. Zero compromise.",
  },
  {
    icon: "👥",
    title: "Small Group",
    description: "Maksimal 20 orang per grup. Personal, bukan massal.",
  },
  {
    icon: "💰",
    title: "Tanpa Biaya Tersembunyi",
    description: "Harga yang tertera sudah all-in. Tidak ada biaya tambahan di lapangan.",
  },
  {
    icon: "🇮🇩",
    title: "Guide Indonesia",
    description: "Tour guide fasih bahasa Indonesia. Tidak ada barrier bahasa.",
  },
]

// ─── Helpers ──────────────────────────────────────────────────

export function getTripBySlug(slug: string): OpenTrip | undefined {
  return openTrips.find((t) => t.slug === slug)
}

export function getUniqueDestinations(): string[] {
  return [...new Set(openTrips.map((t) => t.destination))]
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export const WHATSAPP_BASE = "https://wa.me/6281234567890?text="
