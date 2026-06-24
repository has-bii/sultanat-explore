"use client"

import { use } from "react"

import { Button } from "@/components/ui/button"
import { useQueryState } from "nuqs"

import { fetchCityCategories } from "../../lib/fetch"

interface Props {
  dataPromise: ReturnType<typeof fetchCityCategories>
}

export function CategoryFilter({ dataPromise }: Props) {
  const data = use(dataPromise)
  const [category, setCategory] = useQueryState("category")

  const onCategoryChange = (slug: string | null) => {
    setCategory((prev) => (slug === prev ? null : slug))
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {data.map((cat) => (
        <Button
          key={cat.id}
          size="sm"
          variant={cat.slug === category ? "default" : "outline"}
          onClick={() => onCategoryChange(cat.slug)}
        >
          {cat.name}
        </Button>
      ))}
    </div>
  )
}
