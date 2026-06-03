import type {
  AdvisorProfile,
  Benefit,
  City,
  ComparisonItem,
  FAQ,
  GalleryImage,
  ProcessStep,
  SampleItinerary,
  Service,
  Testimonial,
  TrustStat,
} from "./types"

// ─── Cities ──────────────────────────────────────────────────

export const cities: City[] = [
  {
    id: "istanbul",
    name: "Istanbul",
    image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600&h=400&fit=crop",
    description: "Kota dua benua dengan sejarah ribuan tahun.",
    basePricePerPersonPerDay: 1_500_000,
  },
  {
    id: "cappadocia",
    name: "Cappadocia",
    image: "https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?w=600&h=400&fit=crop",
    description: "Balon udara, gua bawah tanah, dan lanskap surreal.",
    basePricePerPersonPerDay: 1_800_000,
  },
  {
    id: "pamukkale",
    name: "Pamukkale",
    image: "https://images.unsplash.com/photo-1720974613069-690834d3d08d?w=600&h=400&fit=crop",
    description: "Terraces putih dan pemandian air panas alami.",
    basePricePerPersonPerDay: 1_200_000,
  },
  {
    id: "antalya",
    name: "Antalya",
    image: "https://images.unsplash.com/photo-1593238738950-01f243cac6fc?w=600&h=400&fit=crop",
    description: "Pantai Mediterania dan sitat kuno.",
    basePricePerPersonPerDay: 1_300_000,
  },
  {
    id: "trabzon",
    name: "Trabzon",
    image: "https://images.unsplash.com/photo-1663230812927-dedf2bc78fe9?w=600&h=400&fit=crop",
    description: "Hijau, pegunungan, dan biara di tebing.",
    basePricePerPersonPerDay: 1_100_000,
  },
  {
    id: "bursa",
    name: "Bursa",
    image: "https://images.unsplash.com/photo-1516351950028-b976f7373d70?w=600&h=400&fit=crop",
    description: "Kota Ottoman pertama dengan gunung Uludağ.",
    basePricePerPersonPerDay: 1_000_000,
  },
]

// ─── Services ────────────────────────────────────────────────

export const services: Service[] = [
  {
    id: "vip-transport",
    name: "VIP Transport",
    description: "Mobil privat dengan driver profesional.",
    category: "transport",
    priceType: "per-group",
    price: 5_000_000,
  },
  {
    id: "airport-transfer",
    name: "Airport Transfer",
    description: "Antar-jemput bandara dengan kendaraan privat.",
    category: "transport",
    priceType: "per-group",
    price: 1_500_000,
  },
  {
    id: "hotel-4star",
    name: "Hotel 4★",
    description: "Akomodasi bintang 4 di lokasi strategis.",
    category: "akomodasi",
    priceType: "per-person",
    price: 1_200_000,
  },
  {
    id: "hotel-5star",
    name: "Hotel 5★",
    description: "Akomodasi mewah bintang 5.",
    category: "akomodasi",
    priceType: "per-person",
    price: 2_500_000,
  },
  {
    id: "villa",
    name: "Villa Privat",
    description: "Villa eksklusif dengan fasilitas lengkap.",
    category: "akomodasi",
    priceType: "per-group",
    price: 8_000_000,
  },
  {
    id: "bosphorus-cruise",
    name: "Bosphorus Cruise",
    description: "Pelayaran privat di Selat Bosphorus.",
    category: "aktivitas",
    priceType: "per-group",
    price: 3_500_000,
  },
  {
    id: "hot-air-balloon",
    name: "Hot Air Balloon",
    description: "Penerangan balon udara di Cappadocia.",
    category: "aktivitas",
    priceType: "per-person",
    price: 2_000_000,
  },
  {
    id: "turkish-bath",
    name: "Turkish Bath (Hamam)",
    description: "Pengalaman hamam tradisional.",
    category: "aktivitas",
    priceType: "per-person",
    price: 800_000,
  },
  {
    id: "food-tour",
    name: "Food Tour",
    description: "Tur kuliner lokal dengan pemandu.",
    category: "aktivitas",
    priceType: "per-person",
    price: 750_000,
  },
  {
    id: "photo-session",
    name: "Photo Session",
    description: "Fotografer profesional untuk momen Anda.",
    category: "aktivitas",
    priceType: "per-group",
    price: 2_500_000,
  },
  {
    id: "visa-handling",
    name: "Visa Handling",
    description: "Pengurusan visa Turki end-to-end.",
    category: "dokumen",
    priceType: "per-person",
    price: 1_500_000,
  },
  {
    id: "travel-insurance",
    name: "Travel Insurance",
    description: "Asuransi perjalanan komprehensif.",
    category: "dokumen",
    priceType: "per-person",
    price: 500_000,
  },
  {
    id: "pemandu-bahasa",
    name: "Pemandu Bahasa Indonesia",
    description: "Guide berbahasa Indonesia selama perjalanan.",
    category: "dokumen",
    priceType: "per-group",
    price: 4_000_000,
  },
]

// ─── Process Steps ───────────────────────────────────────────

export const processSteps: ProcessStep[] = [
  {
    step: 1,
    title: "Kirim Permintaan",
    description: "Isi form atau chat WhatsApp. Tentukan kota, tanggal, dan jumlah rombongan.",
  },
  {
    step: 2,
    title: "Konsultasi Gratis",
    description: "Tim kami akan menghubungi Anda untuk diskusi detail dan preferensi.",
  },
  {
    step: 3,
    title: "Itinerary Kustom",
    description: "Kami buatkan jadwal perjalanan sesuai keinginan Anda. Revisi sampai puas.",
  },
  {
    step: 4,
    title: "Konfirmasi & DP",
    description: "Setuju dengan itinerary? Bayar DP dan trip Anda siap berangkat!",
  },
]

// ─── Sample Itineraries ──────────────────────────────────────

export const sampleItineraries: SampleItinerary[] = [
  {
    title: "Romantic Turkey Escape",
    duration: "5 Hari 4 Malam",
    cities: ["Istanbul", "Cappadocia"],
    highlights: [
      "Bosphorus cruise privat",
      "Hot air balloon untuk dua",
      "Dinner di rooftop Istanbul",
      "Photo session di Cappadocia",
    ],
    priceRange: "Rp 25 – 35 juta / orang",
  },
  {
    title: "Family Adventure",
    duration: "7 Hari 6 Malam",
    cities: ["Istanbul", "Cappadocia", "Pamukkale"],
    highlights: [
      "Tur kota bersejarah Istanbul",
      "Gua bawah tanah Cappadocia",
      "Pemandian air panas Pamukkale",
      "Hotel ramah keluarga",
    ],
    priceRange: "Rp 30 – 45 juta / orang",
  },
]

// ─── Testimonials ────────────────────────────────────────────

export const testimonials: Testimonial[] = [
  {
    name: "Rina & Dimas",
    location: "Jakarta",
    text: "Trip honeymoon kami ke Cappadocia luar biasa! Balon udara, makanan enak, hotel bagus. Semua diatur SultanatExplore.",
    trip: "Romantic Turkey Escape",
    avatar: "RD",
  },
  {
    name: "Keluarga Budi",
    location: "Surabaya",
    text: "Anak-anak sangat menikmati. Guidenya sabar dan helpful. Itinerary fleksibel sesuai kebutuhan keluarga kami.",
    trip: "Family Adventure",
    avatar: "KB",
  },
  {
    name: "Ahmad & Teman-teman",
    location: "Bandung",
    text: "Kami rombongan 8 orang, semua puas. Makanan halal dijamin, penginapan nyaman. Highly recommended!",
    trip: "Custom Group Trip",
    avatar: "AT",
  },
]

// ─── FAQ ─────────────────────────────────────────────────────

export const privateFaqs: FAQ[] = [
  {
    question: "Berapa jumlah minimum peserta untuk private trip?",
    answer:
      "Tidak ada minimum! Private trip bisa untuk 1 orang (solo traveler), pasangan, keluarga, atau rombongan besar. Harga menyesuaikan jumlah peserta.",
  },
  {
    question: "Berapa lama sebelum keberangkatan saya harus booking?",
    answer:
      "Idealnya 1–2 bulan sebelum keberangkatan untuk persiapan visa dan akomodasi. Untuk trip mendadak, hubungi kami — kami akan coba bantu.",
  },
  {
    question: "Apakah bisa custom itinerary sepenuhnya?",
    answer:
      "Ya! Itinerary 100% bisa disesuaikan. Anda pilih kota, aktivitas, dan akomodasi. Kami bantu optimalkan rute dan waktu.",
  },
  {
    question: "Bagaimana sistem pembayaran?",
    answer:
      "DP 30% saat konfirmasi, pelunasan 2 minggu sebelum keberangkatan. Transfer bank ke rekening resmi PT SultanatExplore.",
  },
  {
    question: "Apakah makanan dijamin halal?",
    answer:
      "Ya. Semua restoran yang kami rekomendasikan menyajikan makanan halal. Turki sendiri mayoritas Muslim, jadi mudah menemukan opsi halal.",
  },
  {
    question: "Berapa kisaran harga private trip?",
    answer:
      "Tergantung durasi, jumlah peserta, kota, dan tingkat akomodasi. Mulai dari Rp 15 juta/orang untuk trip 4 hari. Gunakan trip builder di atas untuk estimasi.",
  },
  {
    question: "Apakah termasuk tiket pesawat?",
    answer:
      "Tiket pesawat internasional (Jakarta – Istanbul) tidak termasuk dalam harga. Namun kami bisa bantu rekomendasi dan booking tiket.",
  },
]

// ─── Comparison Table ────────────────────────────────────────

export const comparisonItems: ComparisonItem[] = [
  { feature: "Jadwal", openTrip: "Sudah ditentukan", privateTrip: "Bebas pilih tanggal" },
  { feature: "Peserta", openTrip: "Campur dengan orang lain", privateTrip: "Hanya rombongan Anda" },
  { feature: "Itinerary", openTrip: "Rute tetap", privateTrip: "100% custom" },
  { feature: "Harga", openTrip: "Lebih hemat", privateTrip: "Premium, fleksibel" },
  { feature: "Privasi", openTrip: "Terbatas", privateTrip: "Penuh" },
  { feature: "Fleksibilitas", openTrip: "Mengikuti grup", privateTrip: "Atur sendiri tempo" },
  {
    feature: "Pemandu",
    openTrip: "1 guide untuk grup",
    privateTrip: "Guide privat + bahasa Indonesia",
  },
]

// ─── Benefits ────────────────────────────────────────────────

export const benefits: Benefit[] = [
  {
    icon: "🎯",
    title: "100% Custom",
    description: "Itinerary, destinasi, dan aktivitas sesuai keinginan Anda.",
  },
  {
    icon: "🔒",
    title: "Privasi Penuh",
    description: "Hanya Anda dan rombongan, tidak gabung dengan traveler lain.",
  },
  {
    icon: "🕐",
    title: "Fleksibel",
    description: "Bebas atur tempo perjalanan sendiri sesuai keinginan Anda.",
  },
  {
    icon: "👨‍👩‍👧‍👦",
    title: "Exclusive",
    description: "Cocok untuk honeymoon, keluarga dengan anak, reuni, atau trip teman.",
  },
  {
    icon: "💬",
    title: "Konsultasi Gratis",
    description: "Free konsultasi dengan tim kami sampai deal tanpa biaya sepeserpun.",
  },
]

// ─── Advisor Profile ─────────────────────────────────────────

export const advisorProfile: AdvisorProfile = {
  name: "Fatimah Azzahra",
  role: "Senior Travel Consultant",
  bio: "Berpengalaman 5+ tahun mengatur perjalanan privat ke Turki untuk traveler Indonesia. Mengenal setiap sudut kota, restoran halal terbaik, dan spot foto tersembunyi.",
  photo:
    "https://images.unsplash.com/photo-1541823709867-1b206113eafd?w=300&h=300&fit=crop&crop=face",
  experience: "5+ tahun",
  speciality: "Private & Custom Trip Turki",
}

// ─── Trust Stats ─────────────────────────────────────────────

export const trustStats: TrustStat[] = [
  { value: "200+", label: "Private Trip" },
  { value: "1,200+", label: "Traveler Puas" },
  { value: "4.9★", label: "Rating" },
  { value: "98%", label: "Repeat Customer" },
]

// ─── Gallery Images ──────────────────────────────────────────

export const galleryImages: GalleryImage[] = [
  {
    src: "https://images.unsplash.com/photo-1564407727371-3eece6c58961?w=600&h=400&fit=crop",
    alt: "Private dinner Istanbul",
    span: "row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?w=400&h=400&fit=crop",
    alt: "Balon udara Cappadocia",
    span: "",
  },
  {
    src: "https://images.unsplash.com/photo-1578852952104-54f3dac8b260?w=400&h=400&fit=crop",
    alt: "Pantai Antalya privat",
    span: "",
  },
  {
    src: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600&h=400&fit=crop",
    alt: "Sightseeing Istanbul rombongan",
    span: "row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1720974613069-690834d3d08d?w=400&h=400&fit=crop",
    alt: "Pamukkale private tour",
    span: "",
  },
  {
    src: "https://images.unsplash.com/photo-1548684486-f61d163b2f6a?w=400&h=400&fit=crop",
    alt: "Villa privat Bursa",
    span: "",
  },
]

// ─── Helper ──────────────────────────────────────────────────

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}
