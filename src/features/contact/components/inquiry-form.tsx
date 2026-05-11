"use client"

import { useState } from "react"
import { Send, User, Mail, MessageSquare, FileText } from "lucide-react"

const WHATSAPP_BASE = "https://wa.me/6281234567890"

export function InquiryForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const text = [
      `Halo SultanatExplore,`,
      ``,
      `Nama: ${form.name}`,
      form.email ? `Email: ${form.email}` : "",
      `Perihal: ${form.subject}`,
      ``,
      `${form.message}`,
    ]
      .filter(Boolean)
      .join("\n")

    const url = `${WHATSAPP_BASE}?text=${encodeURIComponent(text)}`
    window.open(url, "_blank")
  }

  const inputClasses =
    "w-full rounded-xl border border-border/60 bg-background px-4 py-3 text-sm transition-colors placeholder:text-muted-foreground/60 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/10"

  return (
    <div className="rounded-2xl border border-border/50 bg-card p-6 sm:p-8">
      <div className="mb-6">
        <h2 className="font-heading text-subheading font-bold tracking-tight">
          Kirim Pesan
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Isi form di bawah, kami akan terima via WhatsApp
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div className="relative">
          <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
          <input
            type="text"
            name="name"
            placeholder="Nama lengkap Anda"
            required
            value={form.name}
            onChange={handleChange}
            className={`${inputClasses} pl-10`}
          />
        </div>

        {/* Email */}
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
          <input
            type="email"
            name="email"
            placeholder="Alamat email (opsional)"
            value={form.email}
            onChange={handleChange}
            className={`${inputClasses} pl-10`}
          />
        </div>

        {/* Subject */}
        <div className="relative">
          <FileText className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
          <select
            name="subject"
            required
            value={form.subject}
            onChange={handleChange}
            className={`${inputClasses} pl-10 appearance-none cursor-pointer`}
          >
            <option value="" disabled>
              Pilih topik...
            </option>
            <option value="Open Trip">Open Trip</option>
            <option value="Private Trip">Private Trip</option>
            <option value="Umrah">Paket Umrah</option>
            <option value="Kolaborasi">Kolaborasi</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>

        {/* Message */}
        <div className="relative">
          <MessageSquare className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground/50" />
          <textarea
            name="message"
            placeholder="Tulis pesan Anda di sini..."
            required
            rows={4}
            value={form.message}
            onChange={handleChange}
            className={`${inputClasses} resize-none pl-10`}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-uber-sm transition-all hover:opacity-90 active:scale-[0.98]"
        >
          <Send className="h-4 w-4" />
          Kirim via WhatsApp
        </button>

        <p className="text-center text-xs text-muted-foreground/60">
          Form ini akan membuka WhatsApp dengan pesan yang sudah terisi
        </p>
      </form>
    </div>
  )
}
