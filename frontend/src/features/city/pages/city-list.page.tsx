"use client"

import { Plus } from "lucide-react"
import { Suspense } from "react"

import { TableSkeleton } from "@/components/table-skeleton"
import { Button } from "@/components/ui/button"
import Link from "next/link"

import { CityFilters } from "../components/filter"
import { CityTable } from "../components/table"
import { useCityFilters } from "../hooks/use-city-filters"
import { type GetCitiesQuery } from "../queries"

export function CityListPage() {
  const { query } = useCityFilters()

  const tableQuery: GetCitiesQuery = {
    limit: "10",
    featured: query.featured || undefined,
    order: query.order,
    search: query.search || undefined,
    sort: query.sort || undefined,
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center gap-2">
        <Suspense>
          <CityFilters />
        </Suspense>
        <Button asChild>
          <Link href="/admin/dashboard/city/create">
            <Plus data-icon="inline-start" />
            <span>Tambah</span>
          </Link>
        </Button>
      </div>

      <Suspense fallback={<TableSkeleton rowCount={5} columns={6} />}>
        <CityTable query={tableQuery} />
      </Suspense>
    </div>
  )
}
