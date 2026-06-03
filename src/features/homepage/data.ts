export type Inclusion = {
  icon: string
  label: string
}

export type Trip = {
  slug: string
  name: string
  destination: string
  price: number
  duration: string
  image: string
  inclusions: Inclusion[]
}

export type Facility = {
  icon: string
  title: string
  description: string
  image?: string
}

// --- Open Trip ---

const openTripTrips: Trip[] = [
  {
    slug: "istanbul-cappadocia-7h",
    name: "Istanbul & Cappadocia",
    destination: "Istanbul, Cappadocia",
    price: 18_500_000,
    duration: "7 Hari",
    image:
      "https://images.unsplash.com/photo-1695415683093-ae5f213ea898?q=80&w=800&auto=format&fit=crop",
    inclusions: [
      { icon: "✈️", label: "Tiket pesawat PP" },
      { icon: "🏨", label: "Hotel bintang 4" },
      { icon: "🚌", label: "Transport privat" },
      { icon: "🍽️", label: "Makan halal" },
      { icon: "🎤", label: "Tour guide Indonesia" },
    ],
  },
  {
    slug: "istanbul-pamukkale-5h",
    name: "Istanbul & Pamukkale",
    destination: "Istanbul, Pamukkale",
    price: 15_900_000,
    duration: "5 Hari",
    image:
      "https://images.unsplash.com/photo-1720974613776-566971057c17?q=80&w=800&auto=format&fit=crop",
    inclusions: [
      { icon: "✈️", label: "Tiket pesawat PP" },
      { icon: "🏨", label: "Hotel bintang 3" },
      { icon: "🚌", label: "Transport privat" },
      { icon: "🍽️", label: "Makan halal" },
      { icon: "🎤", label: "Tour guide Indonesia" },
    ],
  },
]

// --- Destinations ---

export const destinationItems = [
  {
    id: "istanbul",
    title: "Istanbul",
    description: "Kota dua benua dengan keajaiban arsitektur, kuliner, dan budaya yang memukau.",
    href: "/destinations/istanbul",
    image:
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=1080&auto=format&fit=crop",
  },
  {
    id: "cappadocia",
    title: "Cappadocia",
    description:
      "Pemandangan balloon ikonik, gua bersejarah, dan formasi batu unik yang menakjubkan.",
    href: "/destinations/cappadocia",
    image:
      "https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?q=80&w=1080&auto=format&fit=crop",
  },
  {
    id: "pamukkale",
    title: "Pamukkale",
    description: "Kolam teras putih alami yang memukau dan peninggalan kota kuno Hierapolis.",
    href: "/destinations/pamukkale",
    image:
      "https://images.unsplash.com/photo-1728466698701-2eb2af4117d4?q=80&w=1080&auto=format&fit=crop",
  },
  {
    id: "trabzon",
    title: "Trabzon",
    description: "Keindahan alam Laut Hitam, biara Sumela, dan udara segar pegunungan.",
    href: "/destinations/trabzon",
    image:
      "https://images.unsplash.com/photo-1663230812927-dedf2bc78fe9?q=80&w=1080&auto=format&fit=crop",
  },
  {
    id: "antalya",
    title: "Antalya",
    description: "Pantai biru kristal, kota tua bersejarah, dan resor mediterania yang menawan.",
    href: "/destinations/antalya",
    image:
      "https://images.unsplash.com/photo-1578852952104-54f3dac8b260?q=80&w=1080&auto=format&fit=crop",
  },
  {
    id: "bodrum",
    title: "Bodrum",
    description:
      "Kota pesisir elegan dengan kastil Crusader, pantai eksklusif, dan suasana santai.",
    href: "/destinations/bodrum",
    image:
      "https://images.unsplash.com/photo-1628626915799-af7d444a8c4d?q=80&w=1080&auto=format&fit=crop",
  },
  {
    id: "fethiye",
    title: "Fethiye",
    description:
      "Blue Lagoon Ölüdeniz, paragliding dari Gunung Babadağ, dan pulau-pulau tersembunyi.",
    href: "/destinations/fethiye",
    image:
      "https://images.unsplash.com/photo-1626009740542-691a70fd230f?q=80&w=1080&auto=format&fit=crop",
  },
  {
    id: "bursa",
    title: "Bursa",
    description: "Kota ottoman pertama, gunung Uludağ, dan kuliner Iskender kebab legendaris.",
    href: "/destinations/bursa",
    image:
      "https://images.unsplash.com/photo-1528659862616-22886eb53642?q=80&w=1080&auto=format&fit=crop",
  },
  {
    id: "izmir",
    title: "İzmir",
    description: "Kota pelabuhan modern, Efesus kuno, dan pantai Aegea yang memesona.",
    href: "/destinations/izmir",
    image:
      "https://images.unsplash.com/photo-1582380625189-423697e32b92?q=80&w=1080&auto=format&fit=crop",
  },
  {
    id: "konya",
    title: "Konya",
    description: "Kota spiritual Rumi, tarian Sufi, dan warisan Seljuk yang kaya.",
    href: "/destinations/konya",
    image:
      "https://images.unsplash.com/photo-1554797073-31d3ce2efd4e?q=80&w=1080&auto=format&fit=crop",
  },
  {
    id: "ankara",
    title: "Ankara",
    description: "Ibukota modern Turki, museum peradaban Anatolia, dan warisan kemiliteran.",
    href: "/destinations/ankara",
    image:
      "https://images.unsplash.com/photo-1770291252190-147c1f86bdd6?q=80&w=1080&auto=format&fit=crop",
  },
]

export const openTripService = {
  title: "Open Trip",
  heading: "Trip Hemat Healing Bareng Bestie",
  description: "Solusi healing anti ribet. Jadwal dan akomodasi tinggal dinikmati.",
  href: "/open-trip",
  ctaText: "Lihat Semua Open Trip",
  trips: openTripTrips,
}

// --- Private Trip ---

const privateTripFacilities: Facility[] = [
  {
    icon: "map",
    title: "Custom Itinerary",
    description: "Rancang destinasi dan urutan perjalanan sesuai keinginan Anda",
    image:
      "https://images.unsplash.com/photo-1464716821973-e1031cfa43dc?q=80&w=600&auto=format&fit=crop",
  },
  {
    icon: "star",
    title: "Pilihan Hotel",
    description: "Dari bintang 3 hingga boutique luxury, sesuai budget Anda",
    image:
      "https://images.unsplash.com/photo-1549294413-26f195200c16?q=80&w=600&auto=format&fit=crop",
  },
  {
    icon: "car",
    title: "Transport Privat",
    description: "Kendaraan pribadi dengan sopir sepanjang perjalanan",
    image:
      "https://images.unsplash.com/photo-1730800328198-f9efbf9db53f?q=80&w=600&auto=format&fit=crop",
  },
  {
    icon: "users",
    title: "Tour Guide Indonesia",
    description: "Guide berpengalaman yang fasih bahasa Indonesia",
    image:
      "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?q=80&w=600&auto=format&fit=crop",
  },
  {
    icon: "utensils",
    title: "Makan Halal",
    description: "Pilihan restoran dan menu halal terjamin",
    image:
      "https://images.unsplash.com/photo-1539755530862-00f623c00f52?q=80&w=600&auto=format&fit=crop",
  },
  {
    icon: "calendar",
    title: "Fleksibilitas Tanggal",
    description: "Pilih tanggal keberangkatan sesuai jadwal Anda",
    image:
      "https://images.unsplash.com/photo-1631972756622-b2d9164c0e53?q=80&w=600&auto=format&fit=crop",
  },
  {
    icon: "camera",
    title: "Dokumentasi",
    description: "Jasa foto dan videografi profesional untuk mengabadikan momen",
    image:
      "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=600&auto=format&fit=crop",
  },
  {
    icon: "sparkles",
    title: "Pengalaman Ekstra",
    description: "Hot air balloon, Turkish bath, dan pengalaman eksklusif lainnya",
    image:
      "https://images.unsplash.com/photo-1631677757514-f82ec5ee2b7b?q=80&w=600&auto=format&fit=crop",
  },
]

export const privateTripService = {
  title: "Private Trip",
  heading: "Perjalanan Privat, Sesuai Keinginan Anda",
  description:
    "Dirancang khusus untuk Anda — baik untuk keluarga, bulan madu, atau perjalanan bersama teman. Tentukan sendiri destinasi, durasi, dan fasilitas yang Anda inginkan, dan kami yang mewujudkannya.",
  href: "/private-trip",
  ctaText: "Ajukan Private Trip",
  facilities: privateTripFacilities,
}

// --- Private Umrah ---

const umrahFacilities: Facility[] = [
  {
    icon: "book-open",
    title: "Muthawwif",
    description: "Berpengalaman & Profesional",
  },
  {
    icon: "building",
    title: "Hotel Strategis",
    description: "Ibadah jadi lebih mudah",
  },
  {
    icon: "compass",
    title: "Program Fleksibel",
    description: "Bebas atur itenerary mulai dari ziarah & wisata halal lainnya",
  },
  {
    icon: "file-check",
    title: "Visa Umrah",
    description: "Pengurusan visa umrah terjamin tanpa ribet",
  },
  {
    icon: "car",
    title: "Transport Private",
    description: "Exclusive aman & nyaman",
  },
  {
    icon: "utensils",
    title: "Full Board Meal",
    description: "Makan 3x sehari dengan banyak pilihan menu",
  },
  {
    icon: "package",
    title: "Bimbingan Ibadah",
    description: "Memastikan ibadah sah sesuai syariat",
  },
  {
    icon: "camera",
    title: "Dokumentasi",
    description: "Mengabadikan moment terindah selama di tanah suci",
  },
]

export const umrahService = {
  title: "Private Umroh Eksklusif",
  heading: "Ibadah Lebih Nyaman dan Berkesan",
  description:
    "Paket Umroh Eksklusif dengan muthawwif berpengalaman, akomodasi bintang 5, program fleksibel dengan layanan profesional",
  href: "/umrah",
  ctaText: "Konsultasi Paket Umrah",
  facilities: umrahFacilities,
}
