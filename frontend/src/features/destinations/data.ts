import type { Attraction, Destination, DestinationCategory, WhyTurkeyItem } from "./types"

// ─── Re-exports ──────────────────────────────────────────────
export type { DestinationCategory } from "./types"

// ─── Destinations ─────────────────────────────────────────────

export const destinations: Destination[] = [
  {
    id: "istanbul",
    slug: "istanbul",
    name: "Istanbul",
    tagline: "Kota dua benua yang memukau",
    description:
      "Istanbul menjembatani Asia dan Eropa dengan keajaiban arsitektur, kuliner, dan budaya yang tak tertandingi. Dari megahnya Hagia Sophia hingga ramainya Grand Bazaar, setiap sudut kota ini menyimpan cerita ribuan tahun.",
    image:
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=1080&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1570838478900-3dd1b5236cc2?q=80&w=800&auto=format&fit=crop",
    ],
    categories: ["budaya"],
    featured: true,
    highlights: ["Hagia Sophia", "Blue Mosque", "Grand Bazaar", "Bosphorus Cruise"],
  },
  {
    id: "cappadocia",
    slug: "cappadocia",
    name: "Cappadocia",
    tagline: "Negeri balon udara ikonik",
    description:
      "Cappadocia terkenal dengan pemandangan balloon yang ikonik, gua bersejarah, dan formasi batu unik yang menakjubkan. Sunrise di sini adalah salah satu pengalaman paling memorable seumur hidup.",
    image:
      "https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?q=80&w=1080&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1695415683093-ae5f213ea898?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1649333195003-18c47d64ed18?q=80&w=800&auto=format&fit=crop",
    ],
    categories: ["alam", "budaya"],
    featured: true,
    highlights: ["Hot Air Balloon", "Göreme Open Air Museum", "Underground City", "Uchisar Castle"],
  },
  {
    id: "pamukkale",
    slug: "pamukkale",
    name: "Pamukkale",
    tagline: "Kolam teras putih alami",
    description:
      "Pamukkale atau 'Istana Kapas' menawarkan kolam teras putih alami yang memukau dan peninggalan kota kuno Hierapolis. Air panas mineral yang mengalir sudah ribuan tahun membentuk keajaiban alam ini.",
    image:
      "https://images.unsplash.com/photo-1728466698701-2eb2af4117d4?q=80&w=1080&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1728466698701-2eb2af4117d4?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1720974613776-566971057c17?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1590076082090-3a2a37fe0e20?q=80&w=800&auto=format&fit=crop",
    ],
    categories: ["alam", "budaya"],
    featured: true,
    highlights: ["Travertine Terraces", "Cleopatra Pool", "Hierapolis", "Antique Theatre"],
  },
  {
    id: "trabzon",
    slug: "trabzon",
    name: "Trabzon",
    tagline: "Permata Laut Hitam",
    description:
      "Trabzon menawarkan keindahan alam Laut Hitam yang masih alami, biara Sümela yang dramatis di tebing, dan udara segar pegunungan. Destinasi ideal bagi pecinta alam dan ketenangan.",
    image:
      "https://images.unsplash.com/photo-1663230812927-dedf2bc78fe9?q=80&w=1080&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1663230812927-dedf2bc78fe9?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1590076082090-3a2a37fe0a20?q=80&w=800&auto=format&fit=crop",
    ],
    categories: ["alam", "budaya"],
    featured: true,
    highlights: ["Sümela Monastery", "Uzungöl Lake", "Trabzon Hagia Sophia", "Tea Plantation"],
  },
  {
    id: "antalya",
    slug: "antalya",
    name: "Antalya",
    tagline: "Riviera Mediterania Turki",
    description:
      "Antalya menggabungkan pantai biru kristal, kota tua bersejarah Kaleiçi, dan resor mediterania yang menawan. Gerbang menuju Riviera Turki yang memikat hati setiap pengunjung.",
    image:
      "https://images.unsplash.com/photo-1578852952104-54f3dac8b260?q=80&w=1080&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1578852952104-54f3dac8b260?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1644521681185-8b2247db0091?q=80&w=800&auto=format&fit=crop",
    ],
    categories: ["pantai", "budaya"],
    featured: false,
    highlights: ["Kaleiçi Old Town", "Düden Waterfall", "Konyaaltı Beach", "Antalya Museum"],
  },
  {
    id: "bodrum",
    slug: "bodrum",
    name: "Bodrum",
    tagline: "Pesisir elegan Aegea",
    description:
      "Bodrum adalah kota pesisir elegan dengan kastil Crusader, pantai eksklusif, dan suasana santai yang khas Aegea. Surga bagi yang mencicipi kemewahan dan ketenangan sekaligus.",
    image:
      "https://images.unsplash.com/photo-1628626915799-af7d444a8c4d?q=80&w=1080&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1628626915799-af7d444a8c4d?q=80&w=800&auto=format&fit=crop",
    ],
    categories: ["pantai", "budaya"],
    featured: false,
    highlights: ["Bodrum Castle", "Blue Cruise", "Bitez Beach", "Mausoleum at Halicarnassus"],
  },
  {
    id: "fethiye",
    slug: "fethiye",
    name: "Fethiye",
    tagline: "Blue Lagoon & paragliding",
    description:
      "Fethiye terkenal dengan Blue Lagoon Ölüdeniz yang memesona, paragliding dari puncak Gunung Babadağ, dan pulau-pulau tersembunyi di sepanjang pesisir. Petualangan dimulai di sini.",
    image:
      "https://images.unsplash.com/photo-1626009740542-691a70fd230f?q=80&w=1080&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1626009740542-691a70fd230f?q=80&w=800&auto=format&fit=crop",
    ],
    categories: ["alam", "pantai"],
    featured: false,
    highlights: [
      "Ölüdeniz Blue Lagoon",
      "Babadağ Paragliding",
      "Butterfly Valley",
      "12 Islands Boat Trip",
    ],
  },
  {
    id: "bursa",
    slug: "bursa",
    name: "Bursa",
    tagline: "Kota Ottoman pertama",
    description:
      "Bursa adalah kota Ottoman pertama yang menawarkan keagungan arsitektur Green Mosque, gunung Uludağ yang megah, dan kuliner Iskender kebab yang legendaris. Sebuah perjalanan menelusuri sejarah.",
    image:
      "https://images.unsplash.com/photo-1516352267226-f5f3e4c53781?q=80&w=1080&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1516352267226-f5f3e4c53781?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1571935441004-601bab498442?q=80&w=800&auto=format&fit=crop",
    ],
    categories: ["budaya", "alam"],
    featured: false,
    highlights: ["Green Mosque & Tomb", "Uludağ Cable Car", "Iskender Kebab", "Silk Market"],
  },
  {
    id: "izmir",
    slug: "izmir",
    name: "İzmir",
    tagline: "Pintu gerbang Efesus",
    description:
      "İzmir adalah kota pelabuhan modern yang menjadi pintu gerbang menuju Efesus kuno dan pantai-pantai Aegea yang memesona. Perpaduan modernitas dan sejarah yang sempurna.",
    image:
      "https://images.unsplash.com/photo-1582380625189-423697e32b92?q=80&w=1080&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1582380625189-423697e32b92?q=80&w=800&auto=format&fit=crop",
    ],
    categories: ["pantai", "budaya"],
    featured: false,
    highlights: [
      "Ephesus Ancient City",
      "Kemeraltı Bazaar",
      "Alsancak Waterfront",
      "Şirince Village",
    ],
  },
  {
    id: "konya",
    slug: "konya",
    name: "Konya",
    tagline: "Kota spiritual Rumi",
    description:
      "Konya adalah kota spiritual yang menjadi tempat peristirahatan Rumi. Tarian Sufi yang hipnotis, warisan Seljuk yang kaya, dan atmosfer spiritual yang menembus jiwa menanti di sini.",
    image:
      "https://images.unsplash.com/photo-1554797073-31d3ce2efd4e?q=80&w=1080&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1554797073-31d3ce2efd4e?q=80&w=800&auto=format&fit=crop",
    ],
    categories: ["budaya"],
    featured: false,
    highlights: [
      "Mevlana Museum",
      "Sufi Whirling Dervish",
      "Alaeddin Mosque",
      "Seljuk Architecture",
    ],
  },
  {
    id: "ankara",
    slug: "ankara",
    name: "Ankara",
    tagline: "Ibukota modern Turki",
    description:
      "Ankara adalah ibukota modern Turki yang menawarkan Museum Peradaban Anatolia yang mendunia, Anıtkabir mausoleum Atatürk yang megah, dan warisan kemiliteran yang mengesankan.",
    image:
      "https://images.unsplash.com/photo-1770291252190-147c1f86bdd6?q=80&w=1080&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1770291252190-147c1f86bdd6?q=80&w=800&auto=format&fit=crop",
    ],
    categories: ["budaya"],
    featured: false,
    highlights: [
      "Anıtkabir",
      "Museum of Anatolian Civilizations",
      "Ankara Castle",
      "Kızılay Square",
    ],
  },
]

// ─── Featured Attractions ─────────────────────────────────────

export const attractions: Attraction[] = [
  {
    id: "hagia-sophia",
    name: "Hagia Sophia",
    description:
      "Mahakarya arsitektur yang telah berdiri sejak 537 M — menjadi gereja, masjid, museum, dan kembali masjid. Simbol toleransi dan keagungan peradaban.",
    image:
      "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?q=80&w=800&auto=format&fit=crop",
    destinationId: "istanbul",
  },
  {
    id: "balloon-cappadocia",
    name: "Hot Air Balloon Cappadocia",
    description:
      "Ratusan balon udara mewarnai langit pagi Cappadocia — pengalaman sunrise yang menjadi bucket list seluruh dunia.",
    image:
      "https://images.unsplash.com/photo-1695415683093-ae5f213ea898?q=80&w=800&auto=format&fit=crop",
    destinationId: "cappadocia",
  },
  {
    id: "pamukkale-terraces",
    name: "Pamukkale Travertine Terraces",
    description:
      "Teras putih berlapis terbentuk dari mineral air panas selama ribuan tahun. Pemandangan surreal yang hanya ada di Turki.",
    image:
      "https://images.unsplash.com/photo-1720974613776-566971057c17?q=80&w=800&auto=format&fit=crop",
    destinationId: "pamukkale",
  },
  {
    id: "sumela-monastery",
    name: "Biara Sümela",
    description:
      "Biara Orthodox yang menempel di tebing curam pegunungan Altındere. View yang menentramkan dan sejarah yang mendalam.",
    image:
      "https://images.unsplash.com/photo-1663230812927-dedf2bc78fe9?q=80&w=800&auto=format&fit=crop",
    destinationId: "trabzon",
  },
  {
    id: "ephesus",
    name: "Efesus Kuno",
    description:
      "Salah satu kota kuno terlestari di dunia. Library of Celsus dan Great Theatre yang masih berdiri kokoh setelah 2000 tahun.",
    image:
      "https://images.unsplash.com/photo-1582380625189-423697e32b92?q=80&w=800&auto=format&fit=crop",
    destinationId: "izmir",
  },
  {
    id: "oludeniz-lagoon",
    name: "Blue Lagoon Ölüdeniz",
    description:
      "Laguna biru yang tenang di kaki tebing, dikelilingi hutan pinus. Salah satu pantai terfoto di seluruh dunia.",
    image:
      "https://images.unsplash.com/photo-1626009740542-691a70fd230f?q=80&w=800&auto=format&fit=crop",
    destinationId: "fethiye",
  },
]

// ─── Why Turkey ────────────────────────────────────────────────

export const whyTurkeyItems: WhyTurkeyItem[] = [
  {
    icon: "🕌",
    title: "Muslim-Friendly",
    description:
      "Turki adalah negara Muslim dengan infrastruktur wisata lengkap. Masjid mudah ditemukan, makanan halal di mana-mana.",
  },
  {
    icon: "🍽️",
    title: "Kuliner Halal Terjamin",
    description:
      "Dari kebab legendaris hingga Turkish delight — semua halal. Zero compromise dalam makanan.",
  },
  {
    icon: "💰",
    title: "Harga Terjangkau",
    description:
      "Nilai tukar menguntungkan wisatawan Indonesia. Eropa-quality experience dengan harga Asia.",
  },
  {
    icon: "🏛️",
    title: "Sejarah Ribuan Tahun",
    description:
      "Peradaban Ottoman, Byzantine, Roman — Turki adalah museum hidup terbesar di dunia.",
  },
  {
    icon: "🏔️",
    title: "Alam yang Beragam",
    description:
      "Dari pegunungan hingga pantai, dari gua bawah tanah hingga teras mineral. Semua dalam satu negara.",
  },
  {
    icon: "🇮🇩",
    title: "Guide Berbahasa Indonesia",
    description: "Tim SultanatExplore siap menemani perjalanan Anda tanpa barrier bahasa.",
  },
]

// ─── Categories ────────────────────────────────────────────────

export const categoryLabels: Record<string, string> = {
  budaya: "Budaya & Sejarah",
  alam: "Alam & Petualangan",
  pantai: "Pantai & Pesisir",
}

export const categoryOrder: string[] = ["budaya", "alam", "pantai"]

// ─── Helpers ──────────────────────────────────────────────────

export function getDestinationBySlug(slug: string): Destination | undefined {
  return destinations.find((d) => d.slug === slug)
}

export function getFeaturedDestinations(): Destination[] {
  return destinations.filter((d) => d.featured)
}

export function getDestinationsByCategory(category: string): Destination[] {
  return destinations.filter((d) => d.categories.includes(category as DestinationCategory))
}

export function getAttractionsByDestinationId(destinationId: string): Attraction[] {
  return attractions.filter((a) => a.destinationId === destinationId)
}
