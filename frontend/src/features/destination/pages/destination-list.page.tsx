"use client"

import { Plus } from "lucide-react"
import { Suspense } from "react"

import { TableSkeleton } from "@/components/table-skeleton"
import { Button } from "@/components/ui/button"
import Link from "next/link"

import { DestinationFilters } from "../components/filter"
import { DestinationTable } from "../components/table"
import { useDestinationFilters } from "../hooks/use-destination-filters"
import { type GetDestinationsQuery } from "../queries"

export function DestinationListPage() {
  const { query } = useDestinationFilters()

  const tableQuery: GetDestinationsQuery = {
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
          <DestinationFilters />
        </Suspense>
        <Button asChild>
          <Link href="/admin/dashboard/destination/create">
            <Plus data-icon="inline-start" />
            <span>Tambah</span>
          </Link>
        </Button>
      </div>

      <Suspense fallback={<TableSkeleton rowCount={5} columns={6} />}>
        <DestinationTable query={tableQuery} />
      </Suspense>
    </div>
  )
}
