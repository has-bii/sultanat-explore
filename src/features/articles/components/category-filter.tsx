import { categoryLabels, categoryOrder } from "../data"

const ALL = "semua"

const tabs = [
  { value: ALL, label: "Semua" },
  ...categoryOrder.map((cat) => ({ value: cat, label: categoryLabels[cat] })),
]

export function CategoryFilter({
  active,
  onChange,
}: {
  active: string
  onChange: (value: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            active === tab.value
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
