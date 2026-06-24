"use client"

import { useSuspenseQuery } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import { getCityCategoriesQueryOptions } from "@/features/city-category/queries"
import { useQueryState } from "nuqs"

export function CategoryFilter() {
  const [category, setCategory] = useQueryState("category")
  const { data } = useSuspenseQuery(getCityCategoriesQueryOptions())

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