"use client"

import { useSuspenseQuery } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import { getCategoriesQueryOptions } from "@/features/category/queries"
import { useQueryState } from "nuqs"

export function CategoryFilter() {
  const [category, setCategory] = useQueryState("category")
  const { data } = useSuspenseQuery(getCategoriesQueryOptions())

  const categoryIdOnChange = (slug: string | null) => {
    setCategory((prev) => (slug === prev ? null : slug))
  }

  return (
    <div className="flex items-center gap-2">
      {data.map((data) => (
        <Button
          key={data.id}
          size="sm"
          variant={data.slug === category ? "default" : "outline"}
          onClick={() => categoryIdOnChange(data.slug)}
        >
          {data.name}
        </Button>
      ))}
    </div>
  )
}
