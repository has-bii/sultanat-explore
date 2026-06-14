"use client"

import { Plus } from "lucide-react"
import { Suspense } from "react"

import { Button } from "@/components/ui/button"
import Link from "next/link"

import { DestinationFilters } from "../components/destination-filters"
import { DestinationTable } from "../components/destination-table"
import { DestinationTableSkeleton } from "../components/destination-table-skeleton"

export function DestinationListPage() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      {/* Toolbar: filters + create button */}
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

      {/* Table */}
      <Suspense fallback={<DestinationTableSkeleton />}>
        <DestinationTable />
      </Suspense>
    </div>
  )
}
