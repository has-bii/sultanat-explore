"use client"

import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { TableSkeleton } from "@/components/table-skeleton"
import dynamic from "next/dynamic"
import Link from "next/link"

const DestinationFilters = dynamic(
  () =>
    import("../components/destination-filters").then((m) => ({ default: m.DestinationFilters })),
  { ssr: false, loading: () => <Skeleton className="h-9 w-100" /> },
)

const DestinationTable = dynamic(
  () => import("../components/destination-table").then((m) => ({ default: m.DestinationTable })),
  { ssr: false, loading: () => <TableSkeleton rowCount={5} columns={6} /> },
)

export function DestinationListPage() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      {/* Toolbar: filters + create button */}
      <div className="flex flex-wrap items-center gap-2">
        <DestinationFilters />
        <Button asChild className="ml-auto">
          <Link href="/admin/dashboard/destination/create">
            <Plus />
            Tambah
          </Link>
        </Button>
      </div>

      {/* Table */}
      <DestinationTable />
    </div>
  )
}
