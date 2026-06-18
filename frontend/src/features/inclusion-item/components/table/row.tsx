"use client"

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TableCell, TableRow } from "@/components/ui/table"

import type { GetInclusionItemsResponse } from "../../queries"
import { useInclusionItemDialogStore } from "../../stores/inclusion-item-dialog.store"
import { useDeleteInclusionItemDialogStore } from "../../stores/delete-inclusion-item-dialog.store"

type InclusionItem = NonNullable<GetInclusionItemsResponse["data"]>[number]

interface InclusionItemTableRowProps {
  item: InclusionItem
}

export function InclusionItemTableRow({ item }: InclusionItemTableRowProps) {
  const { onOpen: openEdit } = useInclusionItemDialogStore()
  const { onOpen: openDelete } = useDeleteInclusionItemDialogStore()

  return (
    <TableRow>
      <TableCell className="pl-4 font-medium">{item.label}</TableCell>
      <TableCell className="text-muted-foreground">{item.slug}</TableCell>
      <TableCell className="text-muted-foreground">
        {new Date(item.createdAt).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </TableCell>
      <TableCell className="w-[100px]">
        <div className="flex items-center justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => openEdit({ id: item.id, label: item.label })}>
                <Pencil />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => openDelete({ id: item.id, label: item.label })}
              >
                <Trash2 />
                Hapus
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  )
}
