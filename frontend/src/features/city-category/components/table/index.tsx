"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import { FolderOpen } from "lucide-react"

import { TableEmpty } from "@/components/table-empty"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { getCityCategoriesQueryOptions } from "../../queries"
import { CityCategoryTableRow } from "./row"

export function CityCategoryTable() {
  const { data: categories } = useSuspenseQuery(getCityCategoriesQueryOptions())

  if (categories.length === 0) {
    return (
      <TableEmpty
        icon={FolderOpen}
        title="Belum ada kategori kota"
        description="Buat kategori pertama untuk mengelompokkan kota."
      />
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border">
      <Table>
        <TableHeader className="bg-accent">
          <TableRow>
            <TableHead className="pl-4">Nama Kategori</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead className="sr-only">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((cat) => (
            <CityCategoryTableRow key={cat.id} category={cat} />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}