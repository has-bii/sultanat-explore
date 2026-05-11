export type FaqItem = {
  question: string
  answer: string
}

export type FaqCategory = {
  category: string
  slug: string
  items: FaqItem[]
}

export const faqCategories: FaqCategory[] = [
  {
    category: "Umum",
    slug: "umum",
    items: [
      {
        question: "Apakah SultanatExplore agen wisata resmi?",
        answer:
          "Ya, SultanatExplore adalah agen wisata yang berbasis langsung di Turki. Tim kami profesional dan berpengalaman melayani traveler Indonesia. Kami memiliki legalitas usaha dan jaringan mitra terpercaya di Turki.",
      },
      {
        question: "Apa keunggulan SultanatExplore dibanding agen lain?",
        answer:
          "Kami berbasis langsung di Turki, bukan sub-agent. Artinya harga lebih kompetitif, respons lebih cepat, dan kami punya pengetahuan lokal yang mendalam. Tim kami juga 100% berbahasa Indonesia untuk kemudahan komunikasi Anda.",
      },
      {
        question: "Apakah ada konsultasi gratis sebelum booking?",
        answer:
          "Tentu! Kami menyediakan konsultasi gratis via WhatsApp. Travel advisor kami siap membantu merencanakan trip impian Anda sesuai budget dan preferensi.",
      },
    ],
  },
  {
    category: "Visa & Dokumen",
    slug: "visa",
    items: [
      {
        question: "Apakah saya perlu visa untuk ke Turki?",
        answer:
          "Warga Indonesia memerlukan visa Turki. Namun, prosesnya cukup mudah dan bisa dilakukan online (e-Visa). Tim kami akan membantu dan mendampingi proses pengurusan visa Anda.",
      },
      {
        question: "Berapa lama proses pengurusan visa Turki?",
        answer:
          "Proses e-Visa Turki biasanya hanya memerlukan 1–3 hari kerja. Kami akan memandu Anda langkah demi langkah agar proses berjalan lancar.",
      },
      {
        question: "Dokumen apa saja yang perlu disiapkan?",
        answer:
          "Paspor dengan masa berlaku minimal 6 bulan, foto paspor, dan bukti pemesanan tiket/penginapan. Tim kami akan memberikan checklist lengkap setelah Anda melakukan booking.",
      },
    ],
  },
  {
    category: "Pembayaran",
    slug: "pembayaran",
    items: [
      {
        question: "Bagaimana sistem pembayarannya?",
        answer:
          "DP 30% untuk booking, pelunasan 2 minggu sebelum keberangkatan. Kami menerima transfer bank dan metode pembayaran digital. Detail akan dikirim setelah konfirmasi via WhatsApp.",
      },
      {
        question: "Apakah bisa refund jika membatalkan diri?",
        answer:
          "DP tidak bisa dikembalikan. Untuk pelunasan, refund 50% jika pembatalan dilakukan minimal 14 hari sebelum keberangkatan. Setelah itu, tidak ada refund.",
      },
      {
        question: "Apakah bisa bayar dengan cicilan?",
        answer:
          "Kami menyediakan opsi cicilan untuk trip tertentu. Hubungi tim kami via WhatsApp untuk informasi lebih lanjut mengenai program cicilan yang tersedia.",
      },
    ],
  },
  {
    category: "Perjalanan",
    slug: "perjalanan",
    items: [
      {
        question: "Berapa minimal peserta untuk trip jalan?",
        answer:
          "Trip berjalan dengan minimal 10 peserta. Jika belum mencapai minimal, kami akan menghubungi Anda untuk opsi reschedule atau refund penuh.",
      },
      {
        question: "Apa yang tidak termasuk dalam harga?",
        answer:
          "Visa, tip guide & driver, pengeluaran pribadi (souvenir, dll), dan asuransi perjalanan tidak termasuk. Semua yang termasuk sudah dicantumkan di detail masing-masing trip.",
      },
      {
        question: "Bagaimana jaminan makanan halal?",
        answer:
          "Kami hanya menggunakan restoran dengan sertifikasi halal atau yang telah diverifikasi oleh tim kami. Menu sudah diatur sedemikian rupa sehingga Anda tidak perlu khawatir soal makanan selama perjalanan.",
      },
      {
        question: "Apakah ada guide berbahasa Indonesia?",
        answer:
          "Ya, semua trip kami dilengkapi dengan guide profesional yang berbahasa Indonesia. Anda tidak perlu khawatir soal bahasa selama di Turki.",
      },
      {
        question: "Berapa lama durasi trip biasanya?",
        answer:
          "Open trip umumnya 7–10 hari. Private trip bisa disesuaikan sesuai keinginan Anda, mulai dari 5 hari hingga 2 minggu. Paket Umrah biasanya 9–12 hari.",
      },
    ],
  },
  {
    category: "Open Trip vs Private Trip",
    slug: "open-vs-private",
    items: [
      {
        question: "Apa bedanya Open Trip dan Private Trip?",
        answer:
          "Open Trip adalah trip bersama dengan peserta lain, jadwal sudah tetap, harga lebih terjangkau. Private Trip adalah perjalanan eksklusif untuk grup Anda sendiri, jadwal dan itinerary bisa disesuaikan sepenuhnya.",
      },
      {
        question: "Open Trip cocok untuk siapa?",
        answer:
          "Open Trip cocok untuk solo traveler, pasangan, atau kelompok kecil yang ingin berhemat dan berkenalan dengan traveler lain. Suasana lebih ramai dan seru!",
      },
      {
        question: "Private Trip bisa untuk berapa orang?",
        answer:
          "Private Trip bisa mulai dari 2 orang. Tidak ada batas maksimal — semakin banyak peserta, harga per orang bisa lebih hemat.",
      },
    ],
  },
  {
    category: "Umrah",
    slug: "umrah",
    items: [
      {
        question: "Apa saja yang termasuk dalam paket Umrah?",
        answer:
          "Paket kami sudah termasuk tiket pesawat, akomodasi hotel di Makkah & Madinah, transportasi, visa Umrah, makan, dan pendampingan guide berbahasa Indonesia selama perjalanan.",
      },
      {
        question: "Apakah ada pembimbing ibadah?",
        answer:
          "Ya, setiap rombongan Umrah kami dilengkapi dengan pembimbing ibadah berpengalaman yang akan membimbing mulai dari niat hingga tawaf wada.",
      },
      {
        question: "Kapan jadwal keberangkatan Umrah?",
        answer:
          "Jadwal keberangkatan bervariasi. Hubungi kami via WhatsApp untuk informasi jadwal terbaru dan ketersediaan kuota.",
      },
    ],
  },
]
