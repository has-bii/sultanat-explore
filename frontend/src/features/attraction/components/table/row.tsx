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
import Image from "next/image"

import type { GetAttractionsResponse } from "../../queries"
import { useAttractionDialogStore } from "../../stores/attraction-dialog.store"
import { useDeleteAttractionDialogStore } from "../../stores/delete-attraction-dialog.store"

type Attraction = NonNullable<GetAttractionsResponse["data"]["data"][number]>

interface AttractionTableRowProps {
  attraction: Attraction
}

export function AttractionTableRow({ attraction }: AttractionTableRowProps) {
  const { onOpen: openEdit } = useAttractionDialogStore()
  const { onOpen: openDelete } = useDeleteAttractionDialogStore()

  return (
    <TableRow>
      <TableCell className="pl-4">
        <Item className="p-0">
          <ItemMedia variant="image">
            <Image
              src={attraction.image.url}
              alt={attraction.name}
              width={40}
              height={40}
              placeholder="blur"
              blurDataURL={blurhashToDataUrl(attraction.image.blurHash)}
            />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{attraction.name}</ItemTitle>
            <ItemDescription className="max-w-xl truncate">
              {attraction.description}
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
            <DropdownMenuItem onClick={() => openEdit(attraction.id)}>
              <Pencil />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => openDelete({ id: attraction.id, name: attraction.name })}
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
