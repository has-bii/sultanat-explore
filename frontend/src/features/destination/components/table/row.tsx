"use client"

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item"
import { TableCell, TableRow } from "@/components/ui/table"
import { blurhashToDataUrl } from "@/features/image/lib/blurhash"
import { PLACEHOLDER_BLURHASH } from "@/features/image/lib/placeholder-blurhash"
import Image from "next/image"

import type { GetDestinationsResponse } from "../../queries"
import { useDestinationDialogStore } from "../../stores/destination-dialog.store"
import { useDeleteDestinationDialogStore } from "../../stores/delete-destination-dialog.store"

type DestinationItem = NonNullable<GetDestinationsResponse["data"]["data"][number]>

interface DestinationTableRowProps {
  destination: DestinationItem
}

export function DestinationTableRow({ destination }: DestinationTableRowProps) {
  const { onOpen: openEdit } = useDestinationDialogStore()
  const { onOpen: openDelete } = useDeleteDestinationDialogStore()

  return (
    <TableRow>
      <TableCell className="pl-4">
        <Item className="p-0">
          <ItemMedia variant="image">
            <Image
              src={destination.image.url}
              alt={destination.name}
              width={40}
              height={40}
              placeholder="blur"
              blurDataURL={blurhashToDataUrl(PLACEHOLDER_BLURHASH)}
            />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{destination.name}</ItemTitle>
            <ItemDescription className="max-w-xl truncate">
              {destination.description}
            </ItemDescription>
          </ItemContent>
        </Item>
      </TableCell>
      <TableCell className="w-[120px] text-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => openEdit(destination.id)}>
              <Pencil />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => openDelete({ id: destination.id, name: destination.name })}
            >
              <Trash2 />
              Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}
