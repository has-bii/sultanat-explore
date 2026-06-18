"use client"

import { Plus } from "lucide-react"
import { Suspense } from "react"

import { TableSkeleton } from "@/components/table-skeleton"
import { Button } from "@/components/ui/button"
import Link from "next/link"

import { OpenTripFilters } from "../components/filter"
import { DeleteOpenTripDialog } from "../components/dialog/delete"
import { OpenTripTable } from "../components/table"
import { useOpenTripFilters } from "../hooks/use-open-trip-filters"
import { type GetOpenTripsQuery } from "../queries"

export function OpenTripListPage() {
  const { query } = useOpenTripFilters()

  const tableQuery: GetOpenTripsQuery = {
    limit: "10",
    sort: query.sort || undefined,
    order: query.order,
    status: query.status || undefined,
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <OpenTripFilters />
        <Button asChild>
          <Link href="/admin/dashboard/open-trip/create">
            <Plus data-icon="inline-start" />
            <span>Tambah</span>
          </Link>
        </Button>
      </div>

      <Suspense fallback={<TableSkeleton rowCount={5} columns={5} />}>
        <OpenTripTable query={tableQuery} />
      </Suspense>

      <DeleteOpenTripDialog />
    </>
  )
}
