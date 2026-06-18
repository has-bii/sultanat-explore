"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import { Package } from "lucide-react"

import { TableEmpty } from "@/components/table-empty"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { getInclusionItemsQueryOptions } from "../../queries"
import { InclusionItemTableRow } from "./row"

export function InclusionItemTable() {
  const { data: items } = useSuspenseQuery(getInclusionItemsQueryOptions())

  if (items.length === 0) {
    return (
      <TableEmpty
        icon={Package}
        title="Belum ada inclusion item"
        description="Buat inclusion item pertama untuk digunakan di open trip."
      />
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border">
      <Table>
        <TableHeader className="bg-accent">
          <TableRow>
            <TableHead className="pl-4">Label</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Dibuat</TableHead>
            <TableHead className="sr-only">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <InclusionItemTableRow key={item.id} item={item} />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
