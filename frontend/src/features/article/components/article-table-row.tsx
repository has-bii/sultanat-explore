"use client"

import { Eye } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Item, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item"
import { TableCell, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import Link from "next/link"

import type { GetArticlesResponse } from "../queries"

type Article = NonNullable<GetArticlesResponse["data"]["data"][number]>

export function ArticleTableRow({ article }: { article: Article }) {
  return (
    <TableRow>
      <TableCell className="pl-4">
        <Item className="p-0">
          <ItemContent>
            <ItemTitle className="max-w-sm truncate">{article.title}</ItemTitle>
            <ItemDescription className="max-w-sm truncate">{article.excerpt}</ItemDescription>
          </ItemContent>
        </Item>
      </TableCell>
      <TableCell className="text-muted-foreground">{article.category?.name ?? "—"}</TableCell>
      <TableCell className="text-muted-foreground">{article.author.name}</TableCell>
      <TableCell className="text-center">
        <Badge variant={article.published ? "default" : "secondary"}>
          {article.published ? "Diterbitkan" : "Draf"}
        </Badge>
      </TableCell>
      <TableCell className="text-muted-foreground text-right text-sm">
        {article.publishedAt ? format(article.publishedAt, "pp, PP", { locale: id }) : "-"}
      </TableCell>
      <TableCell className="w-[120px] text-center">
        <Button size="sm" asChild>
          <Link href={`/admin/dashboard/article/${article.id}/edit`}>
            <Eye data-icon="inline-start" />
            <span>Buka</span>
          </Link>
        </Button>
      </TableCell>
    </TableRow>
  )
}
