"use client"

import { Plus } from "lucide-react"
import { Suspense } from "react"

import { Button } from "@/components/ui/button"

import { CategoryDialog, useCategoryDialogStore } from "../components/category-dialog"
import { CategoryTable } from "../components/category-table"
import { CategoryTableSkeleton } from "../components/category-table-skeleton"

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

      <Suspense fallback={<CategoryTableSkeleton />}>
        <CategoryTable />
      </Suspense>

      <CategoryDialog />
    </>
  )
}
