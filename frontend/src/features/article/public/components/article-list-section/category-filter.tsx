"use client"

import { use } from "react"

import { Button } from "@/components/ui/button"
import { useQueryState } from "nuqs"

import { fetchCategory } from "../../lib/fetch"

type Props = {
  dataPromise: ReturnType<typeof fetchCategory>
}

export function CategoryFilter({ dataPromise }: Props) {
  const data = use(dataPromise)
  const [category, setCategory] = useQueryState("category")

  const onChange = (categorySlug: string) => {
    setCategory((prev) => (prev === categorySlug ? null : categorySlug))
  }

  return (
    <div className="flex items-center gap-2">
      {data.map((data) => (
        <Button
          key={data.id}
          size="sm"
          variant={data.slug === category ? "default" : "outline"}
          onClick={() => onChange(data.slug)}
        >
          {data.name}
        </Button>
      ))}
    </div>
  )
}
