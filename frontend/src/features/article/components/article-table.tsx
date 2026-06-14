"use client"

import { useSuspenseInfiniteQuery } from "@tanstack/react-query"
import { FileText, Plus } from "lucide-react"

import { ButtonLoading } from "@/components/button-loading"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"

import { useArticleFilters } from "../hooks/use-article-filters"
import { type GetArticlesQuery, getArticlesQueryOptions } from "../queries"
import { ArticleTableRow } from "./article-table-row"

const ARTICLE_PAGE_SIZE = "10"

export function ArticleTable() {
  const { query } = useArticleFilters()

  const parsedQuery: GetArticlesQuery = {
    limit: ARTICLE_PAGE_SIZE,
    search: query.search || undefined,
    sort: query.sort || undefined,
    order: query.order,
    published: query.published || undefined,
    category: query.category || undefined,
  }

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery(
    getArticlesQueryOptions(parsedQuery),
  )
  const articles = data.pages.flatMap((p) => p.data)

  // Empty state — no results with filters
  if (articles.length === 0 && (query.search || query.published || query.category)) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FileText />
          </EmptyMedia>
          <EmptyTitle>Tidak ada hasil</EmptyTitle>
          <EmptyDescription>Coba ubah filter atau kata kunci pencarian</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  // Empty state — no articles at all
  if (articles.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FileText />
          </EmptyMedia>
          <EmptyTitle>Belum ada artikel</EmptyTitle>
          <EmptyDescription>Buat artikel pertama untuk mulai berbagi cerita</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild>
            <Link href="/admin/dashboard/article/create">
              <Plus data-icon="inline-start" />
              <span>Tambah</span>
            </Link>
          </Button>
        </EmptyContent>
      </Empty>
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
          Muat lagi
        </ButtonLoading>
      )}
    </div>
  )
}
