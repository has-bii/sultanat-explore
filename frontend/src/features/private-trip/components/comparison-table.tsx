import { comparisonItems } from "../data"

export function ComparisonTable() {
  return (
    <section className="bg-muted/30 py-20 lg:py-24">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <span className="text-primary text-xs font-semibold tracking-widest uppercase">
            Perbandingan
          </span>
          <h2 className="font-heading mt-2 text-3xl font-bold tracking-tight">
            Open Trip vs Private Trip
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Pilih jenis perjalanan yang paling sesuai kebutuhan Anda
          </p>
        </div>

        <div className="shadow-uber-sm mt-10 overflow-hidden rounded-2xl border">
          {/* Header */}
          <div className="bg-primary text-primary-foreground grid grid-cols-3 border-b">
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
                <span className="text-muted-foreground text-sm">{item.openTrip}</span>
              </div>
              <div className="bg-primary/[0.03] flex items-center justify-center px-4 py-3">
                <span className="text-primary text-sm font-medium">{item.privateTrip}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
