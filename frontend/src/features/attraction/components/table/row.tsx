"use client"

import { Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item"
import { TableCell, TableRow } from "@/components/ui/table"
import { blurhashToDataUrl } from "@/features/image/lib/blurhash"
import Image from "next/image"

import type { GetAttractionsResponse } from "../../queries"

type Attraction = NonNullable<GetAttractionsResponse["data"]["data"][number]>

interface Props {
  attraction: Attraction
  onUpdate: (id: string) => void
  onDelete: (id: string, name: string) => void
}

export function AttractionTableRow({ attraction, onUpdate, onDelete }: Props) {
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
        <div className="inline-flex items-center gap-1">
          <Button size="sm" variant="secondary" onClick={() => onUpdate(attraction.id)}>
            <Pencil data-icon="inline-start" />
            <span>Edit</span>
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(attraction.id, attraction.name)}
          >
            <Trash2 data-icon="inline-start" />
            <span>Hapus</span>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}
