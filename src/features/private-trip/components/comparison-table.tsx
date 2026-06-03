import { comparisonItems } from "../data"

export function ComparisonTable() {
  return (
    <section className="bg-muted/30 py-20 lg:py-24">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Perbandingan
          </span>
          <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight">
            Open Trip vs Private Trip
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Pilih jenis perjalanan yang paling sesuai kebutuhan Anda
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border shadow-uber-sm">
          {/* Header */}
          <div className="grid grid-cols-3 border-b bg-primary text-primary-foreground">
            <div className="px-4 py-3 text-sm font-semibold">Fitur</div>
            <div className="px-4 py-3 text-center text-sm font-semibold">Open Trip</div>
            <div className="px-4 py-3 text-center text-sm font-semibold">Private Trip</div>
          </div>

          {/* Rows */}
          {comparisonItems.map((item, i) => (
            <div
              key={item.feature}
              className={`grid grid-cols-3 ${i < comparisonItems.length - 1 ? "border-b" : ""}`}
            >
              <div className="px-4 py-3 text-sm font-medium">{item.feature}</div>
              <div className="flex items-center justify-center px-4 py-3">
                <span className="text-sm text-muted-foreground">{item.openTrip}</span>
              </div>
              <div className="flex items-center justify-center bg-primary/[0.03] px-4 py-3">
                <span className="text-sm font-medium text-primary">{item.privateTrip}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
