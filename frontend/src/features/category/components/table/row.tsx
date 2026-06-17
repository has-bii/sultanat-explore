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

import type { GetCategoriesResponse } from "../../queries"
import { useCategoryDialogStore } from "../../stores/category-dialog.store"
import { useDeleteCategoryDialogStore } from "../../stores/delete-category-dialog.store"

type Category = NonNullable<GetCategoriesResponse["data"]>[number]

interface CategoryTableRowProps {
  category: Category
}

export function CategoryTableRow({ category }: CategoryTableRowProps) {
  const { onOpen: openEdit } = useCategoryDialogStore()
  const { onOpen: openDelete } = useDeleteCategoryDialogStore()

  return (
    <TableRow>
      <TableCell className="pl-4 font-medium">{category.name}</TableCell>
      <TableCell className="text-muted-foreground">{category.slug}</TableCell>
      <TableCell className="text-center">{category._count.articles}</TableCell>
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
