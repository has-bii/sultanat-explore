import { ArrowUpRight, Camera, Mail, MessageCircle } from "lucide-react"

const WHATSAPP_LINK =
  "https://wa.me/6281234567890?text=Halo%20SultanatExplore%2C%20saya%20tertarik%20untuk%20berwisata%20ke%20Turki"

const CONTACTS = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    description: "Respon cepat dalam hitungan menit. Cara termudah menghubungi kami.",
    action: "Chat Sekarang",
    href: WHATSAPP_LINK,
    color: "bg-[#25D366]/10 text-[#25D366]",
    hoverBg: "hover:bg-[#25D366]/15",
  },
  {
    icon: Camera,
    label: "Instagram",
    description: "Follow @sultanatexplore untuk inspirasi travel dan update trip terbaru.",
    action: "Ikuti Kami",
    href: "https://instagram.com/sultanatexplore",
    color: "bg-[#E4405F]/10 text-[#E4405F]",
    hoverBg: "hover:bg-[#E4405F]/15",
  },
  {
    icon: Mail,
    label: "Email",
    description: "Untuk inquiry formal, kerjasama bisnis, atau pertanyaan detail.",
    action: "Kirim Email",
    href: "mailto:hello@sultanatexplore.com",
    color: "bg-primary/10 text-primary",
    hoverBg: "hover:bg-primary/15",
  },
]

export function ContactCards() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-heading text-subheading font-bold tracking-tight">Saluran Kami</h2>
        <p className="mt-1 text-muted-foreground">Pilih cara yang paling nyaman untuk Anda</p>
      </div>

      <div className="space-y-3">
        {CONTACTS.map((contact) => (
          <a
            key={contact.label}
            href={contact.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`group flex items-start gap-4 rounded-2xl border border-border/50 bg-card p-5 transition-all ${contact.hoverBg}`}
          >
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${contact.color}`}
            >
              <contact.icon className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{contact.label}</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
              <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                {contact.description}
              </p>
              <span className="mt-2 inline-block text-sm font-medium text-primary transition-opacity group-hover:opacity-80">
                {contact.action} →
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
