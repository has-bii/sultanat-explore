"use client"

import { Plus } from "lucide-react"
import { Suspense } from "react"

import { TableSkeleton } from "@/components/table-skeleton"
import { Button } from "@/components/ui/button"

import { CityCategoryDialog } from "../components/dialog"
import { DeleteCityCategoryDialog } from "../components/dialog/delete"
import { CityCategoryTable } from "../components/table"
import { useCityCategoryDialogStore } from "../stores/city-category-dialog.store"

export function CityCategoryListPage() {
  const open = useCityCategoryDialogStore((s) => s.onOpen)

  return (
    <>
      <div className="flex items-center gap-2">
        <Button onClick={() => open(null)} className="ml-auto">
          <Plus data-icon="inline-start" />
          <span>Tambah</span>
        </Button>
      </div>

      <Suspense fallback={<TableSkeleton rowCount={5} columns={3} />}>
        <CityCategoryTable />
      </Suspense>

      <CityCategoryDialog />
      <DeleteCityCategoryDialog />
    </>
  )
}