"use client"

import { useSuspenseInfiniteQuery } from "@tanstack/react-query"
import { FileText } from "lucide-react"

import { ButtonLoading } from "@/components/button-loading"
import { TableEmpty } from "@/components/table-empty"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { type GetArticlesQuery, getArticlesQueryOptions } from "../../queries"
import { ArticleTableRow } from "./row"

interface ArticleTableProps {
  query: GetArticlesQuery
}

export function ArticleTable({ query }: ArticleTableProps) {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery(
    getArticlesQueryOptions({ ...query, limit: query.limit ?? "10" }),
  )
  const articles = data.pages.flatMap((p) => p.data)

  if (articles.length === 0) {
    const hasFilters = query.search || query.published || query.category

    return (
      <TableEmpty
        icon={FileText}
        title={hasFilters ? "Tidak ada hasil" : "Belum ada artikel"}
        description={
          hasFilters
            ? "Coba ubah filter atau kata kunci pencarian."
            : "Buat artikel pertama untuk mulai berbagi cerita."
        }
      />
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-2xl border">
        <Table>
          <TableHeader className="bg-accent">
            <TableRow>
              <TableHead className="pl-4">Artikel</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Penulis</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Unggulan</TableHead>
              <TableHead className="text-right">Diterbitkan</TableHead>
              <TableHead className="sr-only">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles.map((article) => (
              <ArticleTableRow key={article.id} article={article} />
            ))}
          </TableBody>
        </Table>
      </div>
      {hasNextPage && (
        <ButtonLoading
          size="lg"
          className="mx-auto w-fit"
          onClick={() => fetchNextPage()}
          isLoading={isFetchingNextPage}
        >
          Muat lebih banyak
        </ButtonLoading>
      )}
    </div>
  )
}
