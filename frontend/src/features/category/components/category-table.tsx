"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import { Pencil } from "lucide-react"
import { FolderOpen } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { getCategoriesQueryOptions } from "../queries"
import { useCategoryDialogStore } from "./category-dialog"
import { DeleteCategoryDialog } from "./delete-category-dialog"

export function CategoryTable() {
  const { data: categories } = useSuspenseQuery(getCategoriesQueryOptions())
  const openDialog = useCategoryDialogStore((s) => s.onOpen)

  if (categories.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FolderOpen />
          </EmptyMedia>
          <EmptyTitle>Belum ada kategori</EmptyTitle>
          <EmptyDescription>Buat kategori pertama untuk mengelompokkan artikel</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button onClick={() => openDialog(null)}>Tambah Kategori</Button>
        </EmptyContent>
      </Empty>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border">
      <Table>
        <TableHeader className="bg-accent">
          <TableRow>
            <TableHead className="pl-4">Nama Kategori</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead className="text-center">Jumlah Artikel</TableHead>
            <TableHead className="sr-only">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((cat) => (
            <TableRow key={cat.id}>
              <TableCell className="pl-4 font-medium">{cat.name}</TableCell>
              <TableCell className="text-muted-foreground">{cat.slug}</TableCell>
              <TableCell className="text-center">{cat._count.articles}</TableCell>
              <TableCell className="w-[100px]">
                <div className="flex items-center justify-center gap-1">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => openDialog({ id: cat.id, name: cat.name })}
                  >
                    <Pencil data-icon="inline-start" />
                    <span>Edit</span>
                  </Button>
                  <DeleteCategoryDialog categoryId={cat.id} categoryName={cat.name} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
