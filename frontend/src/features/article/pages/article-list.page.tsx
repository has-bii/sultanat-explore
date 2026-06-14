"use client"

import { Plus } from "lucide-react"
import { Suspense } from "react"

import { Button } from "@/components/ui/button"
import Link from "next/link"

import { ArticleFilters } from "../components/article-filters"
import { ArticleTable } from "../components/article-table"
import { ArticleTableSkeleton } from "../components/article-table-skeleton"

export function ArticleListPage() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center gap-2">
        <ArticleFilters />
        <Button asChild>
          <Link href="/admin/dashboard/article/create">
            <Plus data-icon="inline-start" />
            <span>Tambah</span>
          </Link>
        </Button>
      </div>

      <Suspense fallback={<ArticleTableSkeleton />}>
        <ArticleTable />
      </Suspense>
    </div>
  )
}
