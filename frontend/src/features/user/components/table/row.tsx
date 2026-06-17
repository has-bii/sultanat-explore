"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import { Loader, Trash2 } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TableCell, TableRow } from "@/components/ui/table"
import { getAuthSessionQueryOptions } from "@/features/auth/query"
import { format } from "date-fns"
import { id } from "date-fns/locale"

import { useUpdateUserRole } from "../../mutations/update-user-role.mutation"
import type { User } from "../../queries"
import { useDeleteUserDialogStore } from "../../stores/delete-user-dialog.store"

interface UserTableRowProps {
  user: User
}

function getRoleLabel(role: string) {
  return role === "admin" ? "Admin" : "Author"
}

export function UserTableRow({ user }: UserTableRowProps) {
  const { data: session } = useSuspenseQuery(getAuthSessionQueryOptions())
  const { onOpen: openDelete } = useDeleteUserDialogStore()

  const isCurrent = user.id === session.user.id

  const updateUserRole = useUpdateUserRole()
  const isRolePending = updateUserRole.isPending && updateUserRole.variables?.id === user.id

  const handleRoleChange = (value: string) => {
    if (value === user.role) return
    updateUserRole.mutate({ id: user.id, input: { role: value as "admin" | "author" } })
  }

  return (
    <TableRow>
      <TableCell className="pl-4">
        <div className="flex items-center gap-3">
          <Avatar size="sm">
            <AvatarImage src={user.avatar ?? undefined} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{isCurrent ? "Anda" : user.name}</span>
        </div>
      </TableCell>
      <TableCell className="text-muted-foreground">{user.email}</TableCell>
      <TableCell>
        <Select
          value={user.role}
          onValueChange={handleRoleChange}
          disabled={isCurrent || isRolePending}
        >
          <SelectTrigger size="sm" className="w-32">
            {isRolePending && <Loader className="mr-2 size-4 animate-spin" />}
            <SelectValue>{getRoleLabel(user.role)}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="author">Author</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell className="text-muted-foreground text-sm">
        {format(user.createdAt, "pp, PP", { locale: id })}
      </TableCell>
      <TableCell className="w-[120px]">
        <Button
          variant="destructive"
          size="sm"
          disabled={isCurrent}
          onClick={() => openDelete({ id: user.id, name: user.name })}
        >
          <Trash2 data-icon="inline-start" />
          <span>Hapus</span>
        </Button>
      </TableCell>
    </TableRow>
  )
}
