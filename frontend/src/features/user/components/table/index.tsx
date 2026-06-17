"use client"

import { useSuspenseQuery } from "@tanstack/react-query"

import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getAuthSessionQueryOptions } from "@/features/auth/query"

import { type User, type UserFilters, getUsersQueryOptions } from "../../queries"
import { useDeleteUserDialogStore } from "../../stores/delete-user-dialog.store"
import { UserTableRow } from "./row"

interface Props {
  query: UserFilters
}

export function UserTable({ query }: Props) {
  const { data: users } = useSuspenseQuery(getUsersQueryOptions(query))
  const { data: session } = useSuspenseQuery(getAuthSessionQueryOptions())

  const openDelete = useDeleteUserDialogStore((s) => s.onOpen)

  const currentUserId = session.user.id

  const handleDeleteClick = (user: User) => {
    openDelete({ id: user.id, name: user.name })
  }

  return (
    <div className="overflow-hidden rounded-2xl border">
      <Table>
        <TableHeader className="bg-accent">
          <TableRow>
            <TableHead className="pl-4">Pengguna</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Dibuat</TableHead>
            <TableHead className="sr-only">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <UserTableRow
              key={user.id}
              user={user}
              currentUserId={currentUserId}
              onDeleteClick={handleDeleteClick}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
