"use client"

import { Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item"
import { Switch } from "@/components/ui/switch"
import { TableCell, TableRow } from "@/components/ui/table"
import { blurhashToDataUrl } from "@/features/image/lib/blurhash"
import Image from "next/image"
import Link from "next/link"

import { useUpdateDestination } from "../mutations/update-destination.mutation"
import type { GetDestinationsResponse } from "../queries"

type Destination = NonNullable<GetDestinationsResponse["data"]["data"][number]>

export function DestinationTableRow({ dest }: { dest: Destination }) {
  const { mutate, isPending } = useUpdateDestination(dest.id)

  return (
    <TableRow>
      <TableCell className="pl-4">
        <Item className="p-0">
          <ItemMedia variant="image">
            <Image
              src={dest.image.url}
              alt={dest.name}
              width={40}
              height={40}
              placeholder="blur"
              blurDataURL={blurhashToDataUrl(dest.image.blurHash)}
            />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{dest.name}</ItemTitle>
            <ItemDescription>{dest.tagline}</ItemDescription>
          </ItemContent>
        </Item>
      </TableCell>
      <TableCell className="text-muted-foreground">{dest.tagline}</TableCell>
      <TableCell className="text-center">
        <Switch
          checked={dest.featured}
          disabled={isPending}
          onCheckedChange={(checked) => mutate({ featured: checked })}
        />
      </TableCell>
      <TableCell className="text-center">{dest._count.attractions}</TableCell>
      <TableCell className="text-center">{dest._count.images}</TableCell>
      <TableCell className="w-[120px] text-center">
        <Button size="sm" asChild>
          <Link href={`/admin/dashboard/destination/${dest.id}/edit`}>
            <Eye data-icon="inline-start" />
            <span>Open</span>
          </Link>
        </Button>
      </TableCell>
    </TableRow>
  )
}
