"use client"

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Item, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item"
import { TableCell, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import Link from "next/link"

import type { GetOpenTripsResponse } from "../../queries"
import { useDeleteOpenTripDialogStore } from "../../stores/delete-open-trip-dialog.store"

type OpenTrip = NonNullable<GetOpenTripsResponse["data"]["data"][number]>

export function OpenTripTableRow({ openTrip }: { openTrip: OpenTrip }) {
  const { onOpen: openDelete } = useDeleteOpenTripDialogStore()

  const statusVariant =
    openTrip.status === "published"
      ? "default"
      : openTrip.status === "archived"
        ? "outline"
        : "secondary"

  return (
    <TableRow>
      <TableCell className="pl-4">
        <Item className="p-0">
          <ItemContent>
            <ItemTitle className="max-w-sm truncate">{openTrip.title}</ItemTitle>
            <ItemDescription className="max-w-sm truncate">{openTrip.excerpt}</ItemDescription>
          </ItemContent>
        </Item>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(openTrip.price)}
      </TableCell>
      <TableCell className="text-center">
        <Badge variant={statusVariant}>
          {openTrip.status === "published"
            ? "Diterbitkan"
            : openTrip.status === "archived"
              ? "Diarsipkan"
              : "Draf"}
        </Badge>
      </TableCell>
      <TableCell className="text-muted-foreground text-sm">
        {openTrip.startAt ? format(new Date(openTrip.startAt), "PP", { locale: id }) : "—"}
        {" → "}
        {openTrip.endAt ? format(new Date(openTrip.endAt), "PP", { locale: id }) : "—"}
      </TableCell>
      <TableCell className="w-[120px] text-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/admin/dashboard/open-trip/${openTrip.id}/edit`}>
                <Pencil />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openDelete(openTrip.id)} variant="destructive">
              <Trash2 />
              Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}
