import { use } from "react"

import { Button } from "@/components/ui/button"
import Link from "next/link"

import { fetchCityCategories } from "../../lib/fetch"

interface Props {
  dataPromise: ReturnType<typeof fetchCityCategories>
  category: string | null
}

export function CategoryFilter({ dataPromise, category }: Props) {
  const data = use(dataPromise)

  const generateHref = (slug: string) => {
    if (category === slug) return ""
    return `?category=${slug}`
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {data.map((cat) => (
        <Button
          key={cat.id}
          size="sm"
          variant={cat.slug === category ? "default" : "outline"}
          asChild
        >
          <Link href={`/destinations${generateHref(cat.slug)}`} scroll={false}>
            {cat.name}
          </Link>
        </Button>
      ))}
    </div>
  )
}
