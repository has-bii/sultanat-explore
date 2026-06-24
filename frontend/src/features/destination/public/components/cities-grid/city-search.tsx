"use client"

import { SearchIcon } from "lucide-react"
import { useEffect, useState } from "react"

import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { parseAsString, useQueryState } from "nuqs"

const DEBOUNCE_MS = 500

export function CitySearch() {
  const [search, setSearch] = useQueryState(
    "search",
    parseAsString.withDefault("").withOptions({ shallow: true }),
  )
  const [local, setLocal] = useState(search)

  // Debounced commit to nuqs -> Grid refetches once after pause.
  useEffect(() => {
    const t = setTimeout(() => {
      if (local !== search) setSearch(local)
    }, DEBOUNCE_MS)
    return () => clearTimeout(t)
  }, [local, search, setSearch])

  return (
    <InputGroup className="max-w-md">
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
      <InputGroupInput
        placeholder="Cari kota..."
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setSearch(e.currentTarget.value)
          }
        }}
      />
    </InputGroup>
  )
}