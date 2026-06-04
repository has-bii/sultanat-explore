"use client"

import { parseAsString, useQueryState } from "nuqs"

export function useImageFilters() {
  const [search, setSearch] = useQueryState("search", parseAsString.withDefault(""))
  const [sort, setSort] = useQueryState("sort", parseAsString.withDefault("createdAt"))
  const [order, setOrder] = useQueryState("order", parseAsString.withDefault("desc"))
  const [cursor, setCursor] = useQueryState("cursor", parseAsString.withDefault(""))
  const [selected, setSelected] = useQueryState("selected", parseAsString.withDefault(""))

  const clearSearch = () => setSearch(null)
  const clearCursor = () => setCursor(null)

  return {
    search,
    setSearch,
    sort,
    setSort,
    order,
    setOrder,
    cursor,
    setCursor,
    selected,
    setSelected,
    clearSearch,
    clearCursor,
  }
}
