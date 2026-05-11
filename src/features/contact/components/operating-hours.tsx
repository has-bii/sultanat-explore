import { Clock } from "lucide-react"

export function OperatingHours() {
  return (
    <div className="rounded-2xl border border-border/50 bg-card p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Clock className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold">Jam Operasional</h3>
          <p className="text-sm text-muted-foreground">
            Waktu Indonesia Barat (WIB)
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {[
          { day: "Senin – Jumat", hours: "09:00 – 21:00", active: true },
          { day: "Sabtu", hours: "09:00 – 18:00", active: true },
          { day: "Minggu", hours: "10:00 – 16:00", active: true },
        ].map((schedule) => (
          <div
            key={schedule.day}
            className="flex items-center justify-between text-sm"
          >
            <span className="text-muted-foreground">{schedule.day}</span>
            <span className="font-medium">{schedule.hours}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-xl bg-[#25D366]/5 p-3">
        <p className="text-xs leading-relaxed text-muted-foreground">
          💬 <strong className="text-foreground">Di luar jam kerja?</strong>{" "}
          Tetap kirim pesan WhatsApp — kami akan membalas sesegera mungkin pada
          hari kerja berikutnya.
        </p>
      </div>
    </div>
  )
}
