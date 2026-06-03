import type { Article, ArticleCategory, Author } from "./types"

// ─── Re-exports ──────────────────────────────────────────────
export type { ArticleCategory } from "./types"

// ─── Authors ──────────────────────────────────────────────────

const sultanatTeam: Author = {
  name: "Tim SultanatExplore",
  role: "Travel Content Writer",
  avatar: "https://ui-avatars.com/api/?name=Tim+Sultanat&background=000&color=fff&size=128",
}

// ─── Category Labels ─────────────────────────────────────────

export const categoryLabels: Record<ArticleCategory, string> = {
  "tips-perjalanan": "Tips Perjalanan",
  panduan: "Panduan",
  destinasi: "Destinasi",
  kuliner: "Kuliner",
  umrah: "Umrah",
  inspirasi: "Inspirasi",
}

export const categoryOrder: ArticleCategory[] = [
  "tips-perjalanan",
  "panduan",
  "destinasi",
  "kuliner",
  "umrah",
  "inspirasi",
]

// ─── Articles ─────────────────────────────────────────────────

export const articles: Article[] = [
  {
    id: "tips-perjalanan-turki",
    slug: "tips-perjalanan-turki-untuk-wisatawan-indonesia",
    title: "Tips Perjalanan ke Turki untuk Wisatawan Indonesia",
    excerpt:
      "Semua yang perlu Anda ketahui sebelum berkunjung ke Turki — dari persiapan dokumen, cuaca, hingga adab lokal yang wajib dipahami.",
    thumbnail:
      "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?q=80&w=1200&auto=format&fit=crop",
    category: "tips-perjalanan",
    date: "2025-01-15",
    author: sultanatTeam,
    readingTime: 8,
    featured: true,
    metaTitle: "Tips Perjalanan ke Turki untuk Wisatawan Indonesia | SultanatExplore",
    metaDescription:
      "Panduan lengkap tips perjalanan ke Turki untuk wisatawan Indonesia. Persiapan dokumen, cuaca, transportasi, dan adab lokal.",
    content: [
      {
        type: "heading",
        text: "Persiapan Sebelum Berangkat",
      },
      {
        type: "paragraph",
        text: "Turki menjadi salah satu destinasi favorit wisatawan Indonesia. Dengan perpaduan budaya Eropa dan Asia, negara ini menawarkan pengalaman perjalanan yang tak terlupakan. Namun, ada beberapa hal penting yang perlu Anda persiapkan sebelum berkunjung.",
      },
      {
        type: "list",
        items: [
          "Paspor dengan masa berlaku minimal 6 bulan dari tanggal keberangkatan",
          "Visa Turki bisa diurus online (e-Visa) dalam hitungan menit",
          "Asuransi perjalanan internasional untuk keamanan selama di luar negeri",
          "Adapter plug tipe C/F untuk charge perangkat elektronik",
          "Obat-obatan pribadi beserta resep dokter jika diperlukan",
        ],
      },
      {
        type: "heading",
        text: "Cuaca & Waktu Terbaik Berkunjung",
      },
      {
        type: "paragraph",
        text: "Turki memiliki empat musim yang berbeda. Musim semi (April–Mei) dan musim gugur (September–November) adalah waktu terbaik untuk berkunjung. Cuaca sedang, tidak terlalu panas atau dingin, dan jumlah turis relatif lebih sedikit.",
      },
      {
        type: "tip",
        title: "Tips Cuaca",
        text: "Jika ingin melihat balon udara di Cappadocia, bulan April–Juni menawarkan cuaca paling stabil untuk penerangan.",
      },
      {
        type: "heading",
        text: "Transportasi di Turki",
      },
      {
        type: "paragraph",
        text: "Turki memiliki infrastruktur transportasi yang sangat baik. Dalam kota, Anda bisa menggunakan metro, tram, bus, dan taksi. Untuk perjalanan antar kota, tersedia pesawat domestik, kereta api berkecepatan tinggi, dan bus antar kota yang nyaman.",
      },
      {
        type: "list",
        items: [
          "Istanbulkart untuk transportasi umum di Istanbul — beli sekali, top-up sesuai kebutuhan",
          "Penerbangan domestik sangat terjangkau, mulai dari Rp 200.000",
          "Bus antar kota nyaman dengan AC dan WiFi gratis",
          "Grab/taksi gunakan argometer untuk menghindari overcharge",
        ],
      },
      {
        type: "heading",
        text: "Adab & Etika Lokal",
      },
      {
        type: "paragraph",
        text: "Sebagai negara dengan mayoritas Muslim, Turki sangat ramah untuk wisatawan Muslim Indonesia. Makanan halal mudah ditemukan, masjid tersebar di mana-mana, dan masyarakat lokal sangat menghargai kesopanan.",
      },
      {
        type: "tip",
        title: "Catatan Penting",
        text: "Lepas sepatu saat masuk masjid. Wanita sebaiknya membawa syal untuk menutupi rambut. Bawalah pakaian yang sopan saat mengunjungi tempat ibadah.",
      },
      {
        type: "quote",
        text: "Turki adalah negara di mana Timur bertemu Barat — setiap sudut kota menyimpan cerita yang menunggu untuk ditemukan.",
        author: "Tim SultanatExplore",
      },
    ],
  },
  {
    id: "panduan-visa-turki",
    slug: "panduan-lengkap-visa-turki-untuk-wni",
    title: "Panduan Lengkap Visa Turki untuk WNI",
    excerpt:
      "Step-by-step cara mengurus visa Turki untuk warga negara Indonesia — syarat, biaya, dan proses e-Visa yang bisa selesai dalam 30 menit.",
    thumbnail:
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=1200&auto=format&fit=crop",
    category: "panduan",
    date: "2025-02-03",
    author: sultanatTeam,
    readingTime: 6,
    featured: false,
    metaTitle: "Cara Mengurus Visa Turki untuk WNI | SultanatExplore",
    metaDescription:
      "Panduan lengkap cara mengurus visa Turki untuk WNI. Syarat, biaya, dan proses e-Visa online yang cepat dan mudah.",
    content: [
      {
        type: "heading",
        text: "Kebutuhan Visa Turki untuk WNI",
      },
      {
        type: "paragraph",
        text: "Kabar baiknya, warga negara Indonesia bisa mengurus visa Turki secara online melalui sistem e-Visa. Prosesnya cepat, biasanya selesai dalam 24 jam kerja, dan biayanya sangat terjangkau.",
      },
      {
        type: "heading",
        text: "Syarat e-Visa Turki",
      },
      {
        type: "list",
        items: [
          "Paspor berlaku minimal 6 bulan dari tanggal masuk Turki",
          "Alamat email aktif untuk menerima e-Visa",
          "Kartu kredit/debit untuk pembayaran online (sekitar USD 50)",
          "Tiket pulang atau tiket lanjutan ke negara berikutnya",
          "Bukti akomodasi (hotel booking) selama di Turki",
          "Saldo rekening bank minimal USD 500 atau equivalent",
        ],
      },
      {
        type: "heading",
        text: "Langkah-langkah Mengurus e-Visa",
      },
      {
        type: "list",
        items: [
          "Kunjungi situs resmi e-Visa Turki: evisa.gov.tr",
          "Pilih negara Indonesia sebagai citizenship",
          "Isi formulir dengan data sesuai paspor",
          "Upload foto digital paspor",
          "Bayar biaya visa menggunakan kartu kredit/debit",
          "Tunggu persetujuan (biasanya 24 jam)",
          "Download dan cetak e-Visa yang dikirim via email",
        ],
      },
      {
        type: "tip",
        title: "Pro Tip",
        text: "Ajukan e-Visa minimal 1 minggu sebelum keberangkatan. Meski prosesnya cepat, ada baiknya punya buffer waktu untuk mengantisipasi kendala teknis.",
      },
      {
        type: "heading",
        text: "Durasi & Ketentuan",
      },
      {
        type: "paragraph",
        text: "e-Visa Turki untuk WNI memberikan izin tinggal hingga 30 hari dengan masa berlaku 180 hari sejak tanggal penerbitan. Visa ini bersifat single-entry — jika keluar Turki, Anda perlu mengurus visa baru untuk masuk kembali.",
      },
      {
        type: "quote",
        text: "Proses visa Turki sekarang semudah belanja online — cukup siapkan dokumen, isi form, dan selesai!",
      },
    ],
  },
  {
    id: "destinasi-halal-istanbul",
    slug: "destinasi-halal-friendly-di-istanbul",
    title: "Destinasi Halal-Friendly di Istanbul yang Wajib Dikunjungi",
    excerpt:
      "Istanbul bukan hanya kota bersejarah — juga salah satu kota paling halal-friendly di dunia. Simak tempat-tempat terbaik untuk wisatawan Muslim.",
    thumbnail:
      "https://images.unsplash.com/photo-1545459720-aac8509eb02c?q=80&w=1200&auto=format&fit=crop",
    category: "destinasi",
    date: "2025-02-20",
    author: sultanatTeam,
    readingTime: 7,
    featured: false,
    metaTitle: "Destinasi Halal-Friendly di Istanbul | SultanatExplore",
    metaDescription:
      "Temukan destinasi halal-friendly terbaik di Istanbul untuk wisatawan Muslim Indonesia. Masjid, restoran halal, dan tempat wisata.",
    content: [
      {
        type: "heading",
        text: "Istanbul — Kota Muslim-Friendly",
      },
      {
        type: "paragraph",
        text: "Sebagai kota yang berada di dua benua, Istanbul menawarkan pengalaman unik bagi wisatawan Muslim. Masjid bersejarah, restoran halal, dan budaya yang ramah membuat kota ini ideal untuk liburan Muslim Indonesia.",
      },
      {
        type: "heading",
        text: "Masjid-Masjid Bersejarah",
      },
      {
        type: "list",
        items: [
          "Hagia Sophia — simbol Istanbul, kembali menjadi masjid sejak 2020",
          "Masjid Biru (Sultan Ahmed) — arsitektur Ottoman yang menakjubkan dengan 6 menara",
          "Masjid Suleymaniye — karya arsitek legendaris Mimar Sinan",
          "Masjid Yeni (New Mosque) — tepat di tepi Golden Horn",
          "Masjid Ortaköy — dengan latar belakang Jembatan Bosphorus yang ikonik",
        ],
      },
      {
        type: "heading",
        text: "Kuliner Halal di Istanbul",
      },
      {
        type: "paragraph",
        text: "Hampir seluruh restoran di Istanbul menyajikan makanan halal. Dari street food hingga fine dining, Anda tidak perlu khawatir mencari makanan halal di kota ini.",
      },
      {
        type: "list",
        items: [
          "Kebab — daging panggang yang menjadi ikon kuliner Turki",
          "Lahmacun — pizza tipis ala Turki dengan topping daging cincang",
          "Simit — roti lingkaran berselimut biji wijen, makanan jalanan paling populer",
          "Baklava — kue manis berlapis dengan kacang dan madu",
          "Çay — teh hitam Turki yang disajikan di gelas kecil berbentuk tulip",
        ],
      },
      {
        type: "heading",
        text: "Tempat Wisata Wajib",
      },
      {
        type: "list",
        items: [
          "Grand Bazaar — pasar tradisional tertua dan terbesar di dunia",
          "Topkapi Palace — istana para Sultan Ottoman",
          "Basilica Cistern — reservoir bawah tanah dari era Byzantine",
          "Bosphorus Cruise — pelayaran membelah dua benua",
          "Taksim Square — pusat kota modern Istanbul",
        ],
      },
      {
        type: "tip",
        title: "Tips Shalat",
        text: "Masjid-masjid di Istanbul terbuka untuk shalat dan ziarah. Waktu shalat bisa dicek di aplikasi Muslim Pro. Jangan lupa bawa sajadah portable dan syal untuk wanita.",
      },
    ],
  },
  {
    id: "persiapan-umrah",
    slug: "persiapan-umrah-panduan-untuk-jamaah-indonesia",
    title: "Persiapan Umrah: Panduan Lengkap untuk Jamaah Indonesia",
    excerpt:
      "Semua yang perlu disiapkan sebelum berangkat Umrah — mulai dari dokumen, kesehatan, ibadah, hingga tips praktis selama di Tanah Suci.",
    thumbnail:
      "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=1200&auto=format&fit=crop",
    category: "umrah",
    date: "2025-03-10",
    author: sultanatTeam,
    readingTime: 10,
    featured: false,
    metaTitle: "Panduan Persiapan Umrah untuk Jamaah Indonesia | SultanatExplore",
    metaDescription:
      "Panduan lengkap persiapan Umrah untuk jamaah Indonesia. Dokumen, kesehatan, ibadah, dan tips praktis selama di Tanah Suci.",
    content: [
      {
        type: "heading",
        text: "Mengapa Persiapan Umrah Penting?",
      },
      {
        type: "paragraph",
        text: "Umrah adalah perjalanan ibadah yang sangat bermakna bagi setiap Muslim. Persiapan yang matang akan membantu Anda fokus pada ibadah tanpa gangguan masalah teknis atau kesehatan. Berikut panduan lengkapnya.",
      },
      {
        type: "heading",
        text: "Dokumen & Administrasi",
      },
      {
        type: "list",
        items: [
          "Paspor dengan masa berlaku minimal 6 bulan",
          "Visa Umrah (diurus oleh travel agent resmi)",
          "Sertifikat vaksinasi meningitis (wajib)",
          "Kartu identitas (KTP) sebagai dokumen pendukung",
          "Surat keterangan sehat dari dokter",
          "Pas foto sesuai ketentuan Saudi (background putih, 4x6)",
        ],
      },
      {
        type: "heading",
        text: "Persiapan Kesehatan",
      },
      {
        type: "paragraph",
        text: "Kondisi fisik yang prima sangat penting selama di Tanah Suci. Suhu yang ekstrem dan aktivitas fisik yang intens membutuhkan stamina yang baik.",
      },
      {
        type: "list",
        items: [
          "Olahraga rutin 2–3 bulan sebelum keberangkatan (jalan kaki minimal 5km/hari)",
          "Konsultasi dokter untuk cek kesehatan menyeluruh",
          "Bawa obat-obatan pribadi dalam jumlah cukup",
          "Vaksinasi meningitis (hukum wajib)",
          "Siapkan vitamin dan suplemen imunitas",
        ],
      },
      {
        type: "heading",
        text: "Persiapan Ibadah",
      },
      {
        type: "paragraph",
        text: "Pelajari tata cara Umrah dengan baik sebelum berangkat. Praktikkan doa-doa dan niat yang perlu dibaca selama ibadah.",
      },
      {
        type: "list",
        items: [
          "Pelajari tawaf, sa'i, dan tahallul",
          "Hafalkan doa-doa penting selama Umrah",
          "Baca buku panduan manasik Umrah",
          "Ikuti kelas bimbingan dari travel agent",
          "Siapkan niat dan persiapkan hati secara spiritual",
        ],
      },
      {
        type: "tip",
        title: "Tips Praktis",
        text: "Bawa koper dengan roda yang kuat. Gunakan tas pinggang kecil untuk barang berharga. Siapkan payung lipat untuk melindungi dari panas matahari di Makkah dan Madinah.",
      },
      {
        type: "quote",
        text: "Umrah bukan sekadar perjalanan fisik — ini adalah perjalanan spiritual yang akan mengubah hidup Anda selamanya.",
        author: "Tim SultanatExplore",
      },
    ],
  },
  {
    id: "cappadocia-balon-udara",
    slug: "cappadocia-keajaiban-balon-udara-di-turki",
    title: "Cappadocia: Keajaiban Balon Udara di Turki",
    excerpt:
      "Cappadocia dan balon udaranya menjadi ikon wisata dunia. Simak panduan lengkap untuk mengalami sunrise balloon ride yang tak terlupakan.",
    thumbnail:
      "https://images.unsplash.com/photo-1695415683093-ae5f213ea898?q=80&w=1200&auto=format&fit=crop",
    category: "destinasi",
    date: "2025-03-25",
    author: sultanatTeam,
    readingTime: 6,
    featured: false,
    metaTitle: "Cappadocia Balon Udara — Pengalaman Wajib di Turki | SultanatExplore",
    metaDescription:
      "Panduan lengkap pengalaman balon udara di Cappadocia, Turki. Tips, harga, waktu terbaik, dan semua yang perlu Anda ketahui.",
    content: [
      {
        type: "heading",
        text: "Cappadocia — Negeri di Atas Awan",
      },
      {
        type: "paragraph",
        text: "Cappadocia adalah salah satu destinasi paling ajaib di dunia. Formasi batuan vulkanik yang unik, kota bawah tanah kuno, dan ratusan balon udara yang mewarnai langit pagi menjadikan tempat ini impian setiap traveler.",
      },
      {
        type: "heading",
        text: "Balon Udara — Pengalaman yang Tak Terlupakan",
      },
      {
        type: "paragraph",
        text: "Hot air balloon ride di Cappadocia adalah salah satu aktivitas wajib yang harus dicoba. Ratusan balon terbang bersamaan saat matahari terbit, menciptakan pemandangan yang luar biasa indah.",
      },
      {
        type: "list",
        items: [
          "Penerbangan biasanya berlangsung 1–1.5 jam",
          "Take off saat sunrise (sekitar pukul 05:00 pagi)",
          "Harga mulai dari €150–€300 per orang",
          "Tersedia pilihan private flight untuk couple",
          "Sertifikat penerbangan diberikan setelah selesai",
        ],
      },
      {
        type: "heading",
        text: "Tips Memilih Balon Operator",
      },
      {
        type: "list",
        items: [
          "Pilih operator berlisensi resmi dari Turkish Civil Aviation Authority",
          "Cek review di TripAdvisor dan Google",
          "Pastikan asuransi penerbangan termasuk dalam paket",
          "Booking minimal 2 minggu sebelumnya di musim ramai",
          "Pilih flight standar (bukan deluxe) untuk harga lebih terjangkau",
        ],
      },
      {
        type: "heading",
        text: "Selain Balon Udara",
      },
      {
        type: "paragraph",
        text: "Cappadocia bukan hanya soal balon udara. Ada banyak aktivitas menarik lainnya yang bisa Anda coba.",
      },
      {
        type: "list",
        items: [
          "Jelajahi kota bawah tanah Derinkuyu dan Kaymaklı",
          "Trekking di Love Valley dan Red Valley",
          "Berpoto di fairy chimneys di Goreme Open Air Museum",
          "Coba keramik handmade di Avanos",
          "Inap di cave hotel untuk pengalaman unik",
        ],
      },
      {
        type: "tip",
        title: "Pro Tip",
        text: "Balon udara sangat bergantung cuaca. Siapkan jadwal fleksibel — minimal 2–3 hari di Cappadocia untuk memaksimalkan peluang terbang.",
      },
    ],
  },
  {
    id: "kuliner-turki-halal",
    slug: "kuliner-turki-yang-halal-dan-wajib-dicoba",
    title: "Kuliner Turki yang Halal dan Wajib Dicoba",
    excerpt:
      "Dari kebab legendaris hingga baklava manis — simak daftar makanan khas Turki yang halal dan wajib masuk bucket list kuliner Anda.",
    thumbnail:
      "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?q=80&w=1200&auto=format&fit=crop",
    category: "kuliner",
    date: "2025-04-08",
    author: sultanatTeam,
    readingTime: 5,
    featured: false,
    metaTitle: "Kuliner Turki Halal yang Wajib Dicoba | SultanatExplore",
    metaDescription:
      "Daftar lengkap makanan khas Turki yang halal dan wajib dicoba wisatawan Indonesia. Kebab, baklava, Turkish tea, dan lainnya.",
    content: [
      {
        type: "heading",
        text: "Surga Kuliner Halal",
      },
      {
        type: "paragraph",
        text: "Turki adalah surga kuliner bagi wisatawan Muslim. Hampir seluruh makanan tradisional Turki halal, sehingga Anda bisa menikmati berbagai hidangan tanpa khawatir.",
      },
      {
        type: "heading",
        text: "Makanan Wajib Coba",
      },
      {
        type: "list",
        items: [
          "İskender Kebab — daging kebab dengan saus tomat dan yogurt di atas roti pide",
          "Lahmacun — pizza tipis dengan topping daging cincang dan sayuran",
          "Mantı — dumpling Turki dengan yogurt dan mentega",
          "Pide — roti pipih berisi daging, keju, atau sayuran (mirip pizza boat)",
          "Döner — daging yang dipanggang secara vertikal, diiris tipis",
          "Köfte — bakso daging khas Turki dengan bumbu rempah",
        ],
      },
      {
        type: "heading",
        text: "Makanan Penutup & Minuman",
      },
      {
        type: "list",
        items: [
          "Baklava — kue berlapis dengan kacang pistachio dan sirup madu",
          "Künefe — dessert dari kadaif (mi halus) dengan keju dan sirup",
          "Turkish Delight (Lokum) — permen tradisional berbagai rasa",
          "Çay — teh hitam khas Turki di gelas tulip",
          "Türk Kahvesi — kopi Turki yang kental dan aromatik",
          "Ayran — minuman yogurt asin yang menyegarkan",
        ],
      },
      {
        type: "heading",
        text: "Street Food Favorit",
      },
      {
        type: "list",
        items: [
          "Simit — roti bulat berselimut biji wijen (versi Turki dari bagel)",
          "Balık Ekmek — sandwich ikan segar di tepi Galata Bridge",
          "Kumpir — kentang panggang isi berbagai topping",
          "Çiğ Köfte — wrap dengan bulgur pedas (versi tanpa daging)",
          "Midye Dolma — kerang isi dengan nasi berbumbu",
        ],
      },
      {
        type: "tip",
        title: "Tips Kuliner",
        text: "Makan di restoran lokal jauh lebih murah dan autentik daripada restoran di area turis. Cari tempat yang ramai penduduk lokal — itu tandanya makanan enak dan harga bersahabat.",
      },
      {
        type: "quote",
        text: "Kuliner Turki bukan hanya soal rasa — setiap hidangan menyimpan cerita berabad-abad peradaban.",
        author: "Tim SultanatExplore",
      },
    ],
  },
]

// ─── Helpers ──────────────────────────────────────────────────

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug)
}

export function getFeaturedArticles(): Article[] {
  return articles.filter((a) => a.featured)
}

export function getArticlesByCategory(category: ArticleCategory): Article[] {
  return articles.filter((a) => a.category === category)
}

export function getRelatedArticles(currentSlug: string, limit = 3): Article[] {
  const current = getArticleBySlug(currentSlug)
  if (!current) return articles.slice(0, limit)

  // Same category first, then others
  const sameCategory = articles.filter(
    (a) => a.slug !== currentSlug && a.category === current.category,
  )
  const others = articles.filter((a) => a.slug !== currentSlug && a.category !== current.category)

  return [...sameCategory, ...others].slice(0, limit)
}

export function getAllCategories(): { value: ArticleCategory; label: string }[] {
  return categoryOrder.map((cat) => ({ value: cat, label: categoryLabels[cat] }))
}
