"use client"

import { Plus } from "lucide-react"
import { Suspense } from "react"

import { TableSkeleton } from "@/components/table-skeleton"
import { Button } from "@/components/ui/button"
import Link from "next/link"

import { ArticleFilters } from "../components/filter"
import { ArticleTable } from "../components/table"
import { useArticleFilters } from "../hooks/use-article-filters"
import { type GetArticlesQuery } from "../queries"

export function ArticleListPage() {
  const { query } = useArticleFilters()

  const tableQuery: GetArticlesQuery = {
    limit: "10",
    search: query.search || undefined,
    sort: query.sort || undefined,
    order: query.order,
    published: query.published || undefined,
    category: query.category || undefined,
  }

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

      <Suspense fallback={<TableSkeleton rowCount={5} columns={6} />}>
        <ArticleTable query={tableQuery} />
      </Suspense>
    </>
  )
}
