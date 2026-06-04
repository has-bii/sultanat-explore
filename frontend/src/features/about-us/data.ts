import type { TeamMember, TimelineItem, ValueItem, WhyTurkeyItem } from "./types"

// ─── Company Story Timeline ─────────────────────────────────

export const timeline: TimelineItem[] = [
  {
    year: "2019",
    title: "Awal Mula",
    description:
      "SultanatExplore didirikan oleh seorang mahasiswa Indonesia di Istanbul yang melihat potensi besar wisata Turki untuk pasar Indonesia.",
  },
  {
    year: "2020",
    title: "Membangun Jaringan",
    description:
      "Membangun kemitraan langsung dengan hotel, transportasi, dan restoran halal lokal di seluruh Turki meski di tengah pandemi.",
  },
  {
    year: "2021",
    title: "Trip Pertama",
    description:
      "Menyelenggarakan open trip pertama dengan 12 peserta. Respons positif menjadi fondasi pertumbuhan.",
  },
  {
    year: "2022",
    title: "Ekspansi Layanan",
    description:
      "Meluncurkan private trip dan mulai melayani grup besar — perusahaan, komunitas, dan keluarga.",
  },
  {
    year: "2023",
    title: "Paket Umrah",
    description:
      "Menambahkan paket Umrah privat dengan pembimbing bersertifikat, menjadi travel agent lengkap untuk traveler Indonesia.",
  },
  {
    year: "2024",
    title: "500+ Traveler",
    description:
      "Menjangkau lebih dari 500 traveler Indonesia dengan rating konsisten di atas 4.8/5.0 di semua platform.",
  },
]

// ─── Why Turkey-Based ────────────────────────────────────────

export const whyTurkey: WhyTurkeyItem[] = [
  {
    icon: "📍",
    title: "Berbasis Langsung di Turki",
    description:
      "Tim kami tinggal dan beroperasi langsung dari Turki. Bukan agent tempel — kami tahu setiap sudut kota, setiap restoran halal, setiap jalur terbaik.",
  },
  {
    icon: "🤝",
    title: "Jaringan Lokal Kuat",
    description:
      "Kemitraan langsung dengan hotel, transportasi VIP, dan restoran halal tanpa perantara. Harga lebih baik, layanan lebih personal.",
  },
  {
    icon: "🕌",
    title: "Halal-First",
    description:
      "Setiap itinerary dirancang dengan kebutuhan Muslim Indonesia sebagai prioritas — makanan halal terjamin, waktu shalat diperhatikan, musholla diketahui.",
  },
  {
    icon: "☎️",
    title: "Support 24/7 On-Ground",
    description:
      "Masalah di tempat? Tim kami siap membantu langsung. Bukan hotline jauh — kami bisa temu dalam hitungan menit.",
  },
]

// ─── Team Members ────────────────────────────────────────────

export const team: TeamMember[] = [
  {
    name: "Ahmad Sultan",
    role: "Founder & CEO",
    bio: "Mahasiswa Indonesia di Istanbul yang jatuh cinta dengan Turki dan membangun jembatan wisata untuk sesama Indonesia.",
    image: "https://i.pravatar.cc/300?img=11",
  },
  {
    name: "Fatimah Zahra",
    role: "Operations Manager",
    bio: "Berpengalaman 5+ tahun di industri travel. Memastikan setiap trip berjalan lancar dari booking hingga pulang.",
    image: "https://i.pravatar.cc/300?img=47",
  },
  {
    name: "Rizky Pratama",
    role: "Lead Tour Guide",
    bio: "Fluent dalam Bahasa Indonesia, Turki, dan Inggris. Mengenal Turki seperti telapak tangan.",
    image: "https://i.pravatar.cc/300?img=15",
  },
  {
    name: "Dewi Safitri",
    role: "Customer Relations",
    bio: "Fast respond, detail-oriented. Titik kontak utama traveler dari konsultasi hingga perjalanan selesai.",
    image: "https://i.pravatar.cc/300?img=25",
  },
]

// ─── Values ──────────────────────────────────────────────────

export const values: ValueItem[] = [
  {
    icon: "🛡️",
    title: "Trust & Transparansi",
    description:
      "Harga jelas, itinerary detail, rekening resmi PT. Tidak ada biaya tersembunyi, tidak ada janji kosong.",
  },
  {
    icon: "🕌",
    title: "Muslim-Friendly",
    description:
      "Dari makanan hingga jadwal — setiap aspek perjalanan dirancang nyaman untuk Muslim Indonesia.",
  },
  {
    icon: "🌟",
    title: "Personal Touch",
    description:
      "Setiap traveler adalah tamu, bukan nomor. Layanan personal dari tim yang benar-benar peduli.",
  },
  {
    icon: "💎",
    title: "Kualitas Tanpa Kompromi",
    description:
      "Hotel terbaik, transportasi nyaman, restaman terpilih. Kami tidak memotong kualitas untuk margin.",
  },
]
