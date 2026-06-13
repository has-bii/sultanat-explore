"use client"

import { parseAsString, parseAsStringLiteral, useQueryStates } from "nuqs"

export function useAttractionFilters() {
  const [query, setQuery] = useQueryStates({
    search: parseAsString.withDefault(""),
    order: parseAsStringLiteral(["asc", "desc"]).withDefault("desc"),
    sort: parseAsStringLiteral(["name", "createdAt"]).withDefault("createdAt"),
  })

  const onSearchChange = (search: string) => {
    setQuery((prev) => ({ ...prev, search }))
  }

  const onSortOrderChange = (value: string) => {
    const [sort, order] = value.split("-")

    if (sort !== "name" && sort !== "createdAt") return
    if (order !== "asc" && order !== "desc") return

    setQuery((prev) => ({ ...prev, sort, order }))
  }

  const methods = {
    onSearchChange,
    onSortOrderChange,
  }

  return {
    query,
    methods,
  }
}
