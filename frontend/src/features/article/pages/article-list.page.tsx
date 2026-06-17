"use client"

import { Plus } from "lucide-react"
import { Suspense } from "react"

import { TableSkeleton } from "@/components/table-skeleton"
import { Button } from "@/components/ui/button"
import Link from "next/link"

import { ArticleFilters } from "../components/filter"
import { ArticleTable } from "../components/table"

export function ArticleListPage() {
  return (
    <>
      <div className="flex items-center gap-2">
        <ArticleFilters />
        <Button asChild>
          <Link href="/admin/dashboard/article/create">
            <Plus data-icon="inline-start" />
            <span>Tambah</span>
          </Link>
        </Button>
      </div>

      <Suspense fallback={<TableSkeleton rowCount={5} columns={5} />}>
        <ArticleTable />
      </Suspense>
    </>
  )
}
