"use client"

import { parseAsString, useQueryState } from "nuqs"

export function useImageFilters() {
  const [search, setSearch] = useQueryState("search", parseAsString.withDefault(""))
  const [sort, setSort] = useQueryState("sort", parseAsString.withDefault("createdAt"))
  const [order, setOrder] = useQueryState("order", parseAsString.withDefault("desc"))

  const clearSearch = () => setSearch(null)

  return {
    search,
    setSearch,
    sort,
    setSort,
    order,
    setOrder,
    clearSearch,
  }
}
