"use client"

import { parseAsString, useQueryState } from "nuqs"

export function useDestinationFilters() {
  const [search, setSearch] = useQueryState("search", parseAsString.withDefault(""))
  const [featured, setFeatured] = useQueryState("featured", parseAsString.withDefault(""))
  const [sort, setSort] = useQueryState("sort", parseAsString.withDefault("createdAt"))
  const [order, setOrder] = useQueryState("order", parseAsString.withDefault("desc"))

  const clearSearch = () => setSearch(null)

  return {
    search,
    setSearch,
    featured,
    setFeatured,
    sort,
    setSort,
    order,
    setOrder,
    clearSearch,
  }
}
