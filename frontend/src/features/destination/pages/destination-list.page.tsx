"use client"

import { Plus } from "lucide-react"
import { Suspense } from "react"

import { Button } from "@/components/ui/button"
import dynamic from "next/dynamic"
import Link from "next/link"

import { DestinationFilters } from "../components/destination-filters"
import { DestinationTableSkeleton } from "../components/destination-table-skeleton"

const DestinationTable = dynamic(() => import("../components/destination-table"), {
  ssr: false,
  loading: DestinationTableSkeleton,
})

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
      <DestinationTable />
    </div>
  )
}
