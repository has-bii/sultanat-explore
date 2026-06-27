export type Facility = {
  icon: string
  title: string
  description: string
  image?: string
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
  heading: "Liburan Lebih Eksklusif dan Fleksibel",
  description: "Rencanakan liburan privat Anda dan kami akan mewujudkannya.",
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
