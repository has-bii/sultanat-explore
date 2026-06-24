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

import type { GetCityCategoriesResponse } from "../../queries"
import { useCityCategoryDialogStore } from "../../stores/city-category-dialog.store"
import { useDeleteCityCategoryDialogStore } from "../../stores/delete-city-category-dialog.store"

type CityCategory = NonNullable<GetCityCategoriesResponse["data"]>[number]

interface CityCategoryTableRowProps {
  category: CityCategory
}

export function CityCategoryTableRow({ category }: CityCategoryTableRowProps) {
  const { onOpen: openEdit } = useCityCategoryDialogStore()
  const { onOpen: openDelete } = useDeleteCityCategoryDialogStore()

  return (
    <TableRow>
      <TableCell className="pl-4 font-medium">{category.name}</TableCell>
      <TableCell className="text-muted-foreground">{category.slug}</TableCell>
      <TableCell className="w-[100px]">
        <div className="flex items-center justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => openEdit({ id: category.id, name: category.name })}>
                <Pencil />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => openDelete({ id: category.id, name: category.name })}
                variant="destructive"
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
