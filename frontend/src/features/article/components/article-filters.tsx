"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import { SearchIcon, X } from "lucide-react"
import { Suspense, useEffect, useState } from "react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { getCategoriesQueryOptions } from "@/features/category/queries"
import { BooleanString } from "@/types"

import { useArticleFilters } from "../hooks/use-article-filters"

export function ArticleFilters() {
  const { query, methods } = useArticleFilters()

  const [searchLocal, setSearchLocal] = useState(query.search || "")

  useEffect(() => {
    const timeout = setTimeout(() => methods.onSearchChange(searchLocal), 300)
    return () => clearTimeout(timeout)
  }, [methods, searchLocal])

  return (
    <div className="flex flex-1 flex-wrap items-center gap-2">
      {/* Search */}
      <InputGroup className="flex-1">
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput
          placeholder="Cari artikel..."
          value={searchLocal}
          onChange={(e) => setSearchLocal(e.target.value)}
        />
        {query.search && (
          <InputGroupAddon align="inline-end">
            <InputGroupButton onClick={() => setSearchLocal("")}>
              <X />
            </InputGroupButton>
          </InputGroupAddon>
        )}
      </InputGroup>

      {/* Published filter */}
      <Select
        value={query.published || "all"}
        onValueChange={(value) =>
          methods.onPublishedChange(value === "all" ? null : (value as BooleanString))
        }
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Status</SelectItem>
          <SelectItem value="true">Published</SelectItem>
          <SelectItem value="false">Draft</SelectItem>
        </SelectContent>
      </Select>

      {/* Category filter */}
      <Suspense fallback={<Skeleton className="h-9 w-40 rounded-full border" />}>
        <CategorySelect value={query.category} onChange={methods.onCategoryChange} />
      </Suspense>

      {/* Sort */}
      <Select
        value={`${query.sort}-${query.order}`}
        onValueChange={(value) => methods.onSortOrderChange(value)}
      >
        <SelectTrigger className="w-44">
          <SelectValue placeholder="Urutkan" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="createdAt-desc">Terbaru dibuat</SelectItem>
          <SelectItem value="createdAt-asc">Terlama dibuat</SelectItem>
          <SelectItem value="publishedAt-desc">Terakhir diterbitkan</SelectItem>
          <SelectItem value="publishedAt-asc">Terawal diterbitkan</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

interface CategorySelectProps {
  value: string
  onChange: (value: string | null) => void
}

function CategorySelect({ value, onChange }: CategorySelectProps) {
  const { data: categories } = useSuspenseQuery(getCategoriesQueryOptions())

  return (
    <Select value={value || "all"} onValueChange={(v) => onChange(v === "all" ? null : v)}>
      <SelectTrigger className="w-40">
        <SelectValue placeholder="Kategori" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Semua Kategori</SelectItem>
        {categories.map((cat) => (
          <SelectItem key={cat.id} value={cat.slug}>
            {cat.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
