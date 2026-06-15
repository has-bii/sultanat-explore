"use client"

import { Plus } from "lucide-react"
import { Suspense } from "react"

import { Button } from "@/components/ui/button"

import { CategoryDialog } from "../components/dialog"
import { useCategoryDialogStore } from "../stores/category-dialog.store"
import { CategoryTable } from "../components/table"
import { TableSkeleton } from "@/components/table-skeleton"

export function CategoryListPage() {
  const open = useCategoryDialogStore((s) => s.onOpen)

  return (
    <>
      <div className="flex items-center gap-2">
        <Button onClick={() => open(null)} className="ml-auto">
          <Plus data-icon="inline-start" />
          <span>Tambah</span>
        </Button>
      </div>

      <Suspense fallback={<TableSkeleton rowCount={5} columns={4} />}>
        <CategoryTable />
      </Suspense>

      <CategoryDialog />
    </>
  )
}
