import type {
  AdvisorProfile,
  FAQ,
  Inclusion,
  ItineraryDay,
  PackageTier,
  ProcessStep,
  Testimonial,
  TrustStat,
} from "./types"

export const WHATSAPP_BASE = "https://wa.me/6281234567890?text="

// ─── Social Proof Stats ─────────────────────────────────────

export const socialStats: TrustStat[] = [
  { value: "300+", label: "Jamaah" },
  { value: "40+", label: "Grup Umrah" },
  { value: "4.9", label: "Rating" },
  { value: "98%", label: "Puas & Aman" },
]

// ─── Package Tiers ───────────────────────────────────────────

export const packages: PackageTier[] = [
  {
    id: "standard",
    name: "Standard",
    subtitle: "Ibadah nyaman, harga terjangkau",
    duration: "9 Hari",
    hotelStars: 3,
    price: 28_000_000,
    priceLabel: "/ orang",
    highlights: [
      "Hotel bintang 3 dekat Masjid",
      "Pembimbing ibadah bersertifikat",
      "Transport bus AC",
      "Full board meal halal",
    ],
    inclusions: [
      "Tiket pesawat PP",
      "Akomodasi 7 malam",
      "Visa Umrah",
      "Transport selama di Saudi",
      "Makan 3x sehari",
      "Pembimbing ibadah",
      "Ziarah Makkah & Madinah",
      "Perlengkapan ibadah",
      "Asuransi perjalanan",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    subtitle: "Pengalaman ibadah lebih berkesan",
    duration: "11 Hari",
    hotelStars: 4,
    price: 38_000_000,
    priceLabel: "/ orang",
    popular: true,
    highlights: [
      "Hotel bintang 4, berjarak 200m dari Masjid",
      "Mutawwif eksklusif per grup",
      "Transport van privat",
      "Menu Indonesia tersedia",
    ],
    inclusions: [
      "Tiket pesawat PP (full service)",
      "Akomodasi 9 malam",
      "Visa Umrah",
      "Transport privat selama di Saudi",
      "Makan 3x sehari (menu Indonesia)",
      "Mutawwif eksklusif",
      "Ziarah lengkah Makkah & Madinah",
      "Perlengkapan ibadah premium",
      "Asuransi perjalanan",
      "Bimbingan manasik",
    ],
  },
  {
    id: "vip",
    name: "VIP",
    subtitle: "Layanan eksklusif tanpa batas",
    duration: "12 Hari",
    hotelStars: 5,
    price: 55_000_000,
    priceLabel: "/ orang",
    highlights: [
      "Hotel bintang 5, view Masjidil Haram",
      "Pembimbing ibadah privat 1-on-1",
      "Kendaraan privat VIP",
      "Laundry & porter di hotel",
    ],
    inclusions: [
      "Tiket pesawat PP (business class available)",
      "Akomodasi 10 malam (hotel bintang 5)",
      "Visa Umrah",
      "Transport VIP selama di Saudi",
      "Full board meal premium",
      "Pembimbing ibadah privat",
      "Ziarah privat khusus",
      "Perlengkapan ibadah premium",
      "Asuransi perjalanan comprehensive",
      "Laundry service",
      "Porter service",
      "Bimbingan manasik privat",
    ],
  },
]

// ─── Inclusions Grid ─────────────────────────────────────────

export const inclusions: Inclusion[] = [
  {
    icon: "building",
    title: "Akomodasi Premium",
    description: "Hotel dekat Masjidil Haram & Masjid Nabawi. Walking distance.",
  },
  {
    icon: "utensils",
    title: "Full Board Meal",
    description: "Makan 3x sehari, menu halal terjamin. Pilihan menu Indonesia.",
  },
  {
    icon: "car",
    title: "Transport Privat",
    description: "Bus AC, van, atau kendaraan privat selama di Arab Saudi.",
  },
  {
    icon: "book-open",
    title: "Pembimbing Ibadah",
    description: "Mutawwif bersertifikat mendampingi ibadah Anda dari awal hingga akhir.",
  },
  {
    icon: "compass",
    title: "Ziarah Lengkap",
    description: "Tur ziarah sejarah Islam di Makkah, Madinah, dan sekitarnya.",
  },
  {
    icon: "file-check",
    title: "Visa & Dokumen",
    description: "Pengurusan visa Umrah, paspor, dan seluruh dokumen perjalanan.",
  },
  {
    icon: "shield-check",
    title: "Asuransi Perjalanan",
    description: "Perlindungan menyeluruh selama perjalanan internasional.",
  },
  {
    icon: "package",
    title: "Perlengkapan Ibadah",
    description: "Kitab doa, pakaian ihram, tasbih, dan perlengkapan lainnya.",
  },
]

// ─── Itinerary Preview (Standard 9 Days) ─────────────────────

export const itineraryDays: ItineraryDay[] = [
  {
    day: 1,
    title: "Keberangkatan",
    location: "Jakarta → Jeddah",
    description: "Take off dari Jakarta. Tiba di Jeddah, transfer ke hotel di Makkah.",
  },
  {
    day: 2,
    title: "Umrah Pertama",
    location: "Makkah",
    description: "Ibadah Umrah bersama pembimbing. Tawaf, Sa'i, dan tahallul.",
  },
  {
    day: 3,
    title: "Ibadah & Ziarah Makkah",
    location: "Makkah",
    description: "Shalat di Masjidil Haram, ziarah Jabal Nur, Gua Hira, dan Arafah.",
  },
  {
    day: 4,
    title: "Ziarah Makkah",
    location: "Makkah",
    description: "Ziarah Mina, Muzdalifah, Jabal Tsur, dan Masjid Jin.",
  },
  {
    day: 5,
    title: "Transfer ke Madinah",
    location: "Makkah → Madinah",
    description: "Perjalanan ke Madinah. Check-in hotel dekat Masjid Nabawi.",
  },
  {
    day: 6,
    title: "Ziarah Madinah",
    location: "Madinah",
    description: "Ziarah Raudhah, Makam Rasulullah ﷺ, Masjid Quba, dan Pasar Kurma.",
  },
  {
    day: 7,
    title: "Ibadah di Madinah",
    location: "Madinah",
    description: "Shalat 40 waktu di Masjid Nabawi, waktu bebas untuk ibadah personal.",
  },
  {
    day: 8,
    title: "Hari Terakhir di Madinah",
    location: "Madinah",
    description: "Ibadah terakhir, belanja oleh-oleh, persiapan kepulangan.",
  },
  {
    day: 9,
    title: "Kepulangan",
    location: "Madinah → Jakarta",
    description: "Check-out, transfer ke bandara Jeddah. Selamat datang kembali!",
  },
]

// ─── Process Steps ───────────────────────────────────────────

export const processSteps: ProcessStep[] = [
  {
    step: 1,
    title: "Konsultasi Gratis",
    description: "Chat WhatsApp kami. Diskusikan kebutuhan, tanggal, dan budget Anda.",
  },
  {
    step: 2,
    title: "Pilih Paket",
    description: "Pilih paket Standard, Premium, atau VIP. Atau custom sesuai keinginan.",
  },
  {
    step: 3,
    title: "Proses Dokumen",
    description: "Kami urus visa, paspor, tiket, dan seluruh dokumen perjalanan Anda.",
  },
  {
    step: 4,
    title: "Berangkat!",
    description: "Pembimbing menjemput Anda. Tinggal ikuti — semua sudah kami atur.",
  },
]

// ─── Testimonials ────────────────────────────────────────────

export const testimonials: Testimonial[] = [
  {
    name: "Keluarga H. Ridwan",
    location: "Jakarta",
    text: "Alhamdulillah, Umrah bersama SultanatExplore sangat memuaskan. Pembimbing sabar, hotel dekat Masjid, semua lancar. Kami sudah recommended ke tetangga.",
    trip: "Paket Premium",
    avatar: "HR",
  },
  {
    name: "Ibu Siti Aminah",
    location: "Bandung",
    text: "Umrah pertama saya dan sangat berkesan. Pembimbing sangat detail menjelaskan setiap ibadah. Makanan enak, hotel bersih. Jazakallah khair.",
    trip: "Paket Standard",
    avatar: "SA",
  },
  {
    name: "Ahmad & Fatimah",
    location: "Surabaya",
    text: "Paket VIP benar-benar worth it. Hotel bintang 5 langsung di depan Masjidil Haram. Pembimbing privat sangat membantu. InsyaAllah akan kembali.",
    trip: "Paket VIP",
    avatar: "AF",
  },
]

// ─── FAQ ─────────────────────────────────────────────────────

export const umrahFaqs: FAQ[] = [
  {
    question: "Berapa lama durasi paket Umrah?",
    answer:
      "Paket Standard 9 hari, Premium 11 hari, dan VIP 12 hari. Durasi bisa disesuaikan jika Anda ingin custom.",
  },
  {
    question: "Apakah bisa custom paket?",
    answer:
      "Tentu! Semua paket bisa disesuaikan — durasi, hotel, jumlah jamaah, tambahan ziarah. Hubungi kami untuk custom.",
  },
  {
    question: "Berapa jumlah minimum jamaah?",
    answer:
      "Private Umrah bisa mulai dari 1 orang. Tidak ada minimum. Harga menyesuaikan jumlah jamaah.",
  },
  {
    question: "Apakah perlu mahram untuk wanita?",
    answer:
      "Menurut ketentuan pemerintah Saudi, wanita di bawah 45 tahun wajib ditemani mahram. Di atas 45 tahun bisa bergabung dalam rombongan.",
  },
  {
    question: "Bagaimana proses visa Umrah?",
    answer:
      "Kami mengurus seluruh proses visa. Anda hanya perlu menyiapkan paspor (minimal 6 bulan validity), foto, dan dokumen pendukung. Kami handle sisanya.",
  },
  {
    question: "Kapan waktu terbaik untuk Umrah?",
    answer:
      "Umrah bisa kapan saja. Namun bulan Rajab, Sya'ban, dan Ramadan biasanya lebih ramai. Untuk cuaca lebih sejuk, bulan November–Februari.",
  },
  {
    question: "Apakah ada bimbingan sebelum berangkat?",
    answer:
      "Ya, kami mengadakan manasik Umrah sebelum keberangkatan. Pembimbing akan menjelaskan seluruh rangkaian ibadah secara detail.",
  },
  {
    question: "Bagaimana sistem pembayaran?",
    answer:
      "DP 30% untuk konfirmasi pemesanan. Pelunasan maksimal 14 hari sebelum keberangkatan. Transfer ke rekening resmi PT.",
  },
]

// ─── Advisor ─────────────────────────────────────────────────

export const advisorProfile: AdvisorProfile = {
  name: "Ustadz Ahmad Fauzi",
  role: "Pembimbing Umrah Senior",
  bio: "Berpengalaman 8+ tahun mendampingi jamaah Umrah dari Indonesia. Hafiz Al-Quran, fasih bahasa Arab, dan menguasai sejarah Islam Makkah-Madinah secara mendalam.",
  photo:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
  experience: "8+ tahun",
  speciality: "Umrah & Ziarah Saudi",
}

// ─── Helper ──────────────────────────────────────────────────

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}
