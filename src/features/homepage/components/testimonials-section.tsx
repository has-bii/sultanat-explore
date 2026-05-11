"use client"

import { TestimonialsColumn } from "@/components/ui/testimonials-columns-1"
import { motion } from "motion/react"

const testimonials = [
  {
    text: "Pengalaman yang luar biasa! Tim SultanatExplore sangat profesional dan ramah. Perjalanan ke Cappadocia menjadi momen terindah seumur hidup saya.",
    image: "https://i.pravatar.cc/160?img=47",
    name: "Rina Saputri",
    role: "Jakarta",
  },
  {
    text: "Alhamdulillah, perjalanan Umrah plus Turki bersama SultanatExplore sangat berkesan. Makanan halal dijamin, pembimbing sangat perhatian.",
    image: "https://i.pravatar.cc/160?img=11",
    name: "Ahmad Fauzan",
    role: "Bandung",
  },
  {
    text: "Open trip-nya seru banget! Teman-teman se-grup asyik, guide-nya jago bawa suasana. Pasti bakal join lagi next trip!",
    image: "https://i.pravatar.cc/160?img=32",
    name: "Dewi Lestari",
    role: "Surabaya",
  },
  {
    text: "Private trip yang sangat well-organized. Itinerary lengkap, hotel bagus, dan harganya worth it. Highly recommended!",
    image: "https://i.pravatar.cc/160?img=53",
    name: "Budi Prasetyo",
    role: "Yogyakarta",
  },
  {
    text: "Pertama kali ke Turki dan langsung jatuh cinta. Terima kasih SultanatExplore yang sudah mengatur semuanya dengan sempurna.",
    image: "https://i.pravatar.cc/160?img=25",
    name: "Siti Nurhaliza",
    role: "Medan",
  },
  {
    text: "Paket Umrah-nya lengkap banget. Dari akomodasi sampai ziarah semuanya teratur. Insya Allah akan ikut lagi tahun depan.",
    image: "https://i.pravatar.cc/160?img=60",
    name: "Hasan Basri",
    role: "Semarang",
  },
  {
    text: "Harga terjangkau tapi fasilitas gak murahan. Trip ke Istanbul dan Pamukkale seru parah. Dua jempol deh!",
    image: "https://i.pravatar.cc/160?img=44",
    name: "Maya Putri",
    role: "Makassar",
  },
  {
    text: "Guide-nya orang Indonesia yang sudah lama tinggal di Turki, jadi tahu banget spot-spot keren yang gak turis lain tahu.",
    image: "https://i.pravatar.cc/160?img=15",
    name: "Rizky Aditya",
    role: "Palembang",
  },
  {
    text: "Dari awal booking sampai pulang, pelayanannya konsisten. Fast respond, detail, dan sangat membantu. Terima kasih SultanatExplore!",
    image: "https://i.pravatar.cc/160?img=28",
    name: "Fatimah Azzahra",
    role: "Balikpapan",
  },
]

const firstColumn = testimonials.slice(0, 3)
const secondColumn = testimonials.slice(3, 6)
const thirdColumn = testimonials.slice(6, 9)

export function TestimonialsSection() {
  return (
    <section className="bg-background my-20 relative">
      <div className="container z-10 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-135 mx-auto"
        >
          <div className="flex justify-center">
            <div className="border py-1 px-4 rounded-lg">Testimoni</div>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter mt-5">
            Kata Mereka
          </h2>
          <p className="text-center mt-5 opacity-75">
            Testimoni dari traveler Indonesia yang telah berpetualang bersama kami.
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 mt-10 mask-[linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-185 overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn
            testimonials={secondColumn}
            className="hidden md:block"
            duration={19}
          />
          <TestimonialsColumn
            testimonials={thirdColumn}
            className="hidden lg:block"
            duration={17}
          />
        </div>
      </div>
    </section>
  )
}
