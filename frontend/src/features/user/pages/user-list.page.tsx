"use client"

import { Plus } from "lucide-react"
import { Suspense } from "react"

import { TableSkeleton } from "@/components/table-skeleton"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { UserDialog } from "../components/dialog"
import { DeleteUserDialog } from "../components/dialog/delete"
import { UserTable } from "../components/table"
import { useUserFilters } from "../hooks/use-user-filters"
import { useUserDialogStore } from "../stores/user-dialog.store"

const sortOptions = [
  { value: "createdAt-desc", label: "Terbaru dibuat" },
  { value: "createdAt-asc", label: "Terlama dibuat" },
  { value: "name-asc", label: "Nama A-Z" },
  { value: "name-desc", label: "Nama Z-A" },
]

export function UserListPage() {
  const { query, methods } = useUserFilters()
  const openDialog = useUserDialogStore((s) => s.onOpen)

  const currentSort = `${query.sort}-${query.order}`

  return (
    <>
      <div className="flex items-center gap-2">
        <Select value={currentSort} onValueChange={methods.onSortOrderChange}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Urutkan" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={() => openDialog(null)} className="ml-auto">
          <Plus data-icon="inline-start" />
          <span>Tambah</span>
        </Button>
      </div>

      <Suspense fallback={<TableSkeleton rowCount={5} columns={5} />}>
        <UserTable query={query} />
      </Suspense>

      <UserDialog />
      <DeleteUserDialog />
    </>
  )
}
