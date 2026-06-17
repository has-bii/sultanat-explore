"use client"

import { useSuspenseQuery } from "@tanstack/react-query"

import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { type UserFilters, getUsersQueryOptions } from "../../queries"
import { UserTableRow } from "./row"

interface UserTableProps {
  query: UserFilters
}

export function UserTable({ query }: UserTableProps) {
  const { data: users } = useSuspenseQuery(getUsersQueryOptions(query))

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
            <UserTableRow key={user.id} user={user} />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
