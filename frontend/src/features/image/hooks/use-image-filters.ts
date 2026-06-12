"use client"

import { parseAsString, parseAsStringLiteral, useQueryStates } from "nuqs"

export function useImageFilters() {
  const [query, setQuery] = useQueryStates({
    search: parseAsString.withDefault(""),
    order: parseAsStringLiteral(["asc", "desc"]).withDefault("desc"),
    sort: parseAsStringLiteral(["createdAt"]).withDefault("createdAt"),
    featured: parseAsStringLiteral(["true", "false"]),
  })

  const onSearchChange = (search: string) => {
    setQuery((prev) => ({ ...prev, search }))
  }

  const onSortOrderChange = (value: string) => {
    const [sort, order] = value.split("-")

    if (sort !== "createdAt") return
    if (order !== "asc" && order !== "desc") return

    setQuery((prev) => ({ ...prev, sort, order }))
  }

  const onFeaturedChange = (featured: "true" | "false" | null) => {
    setQuery((prev) => ({ ...prev, featured }))
  }

  const methods = {
    onSearchChange,
    onFeaturedChange,
    onSortOrderChange,
  }

  return {
    query,
    methods,
  }
}
