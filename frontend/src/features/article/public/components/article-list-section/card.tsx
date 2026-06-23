import { ArrowRight, Calendar } from "lucide-react"

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GetArticlesResponse } from "@/features/article/queries"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import Image from "next/image"
import Link from "next/link"

interface Props {
  data: GetArticlesResponse["data"]["data"][number]
  priority?: boolean
}

export function ArticleCard({ data, priority }: Props) {
  return (
    <Link href={`/artikel/${data.slug}`} className="group">
      <Card className="pt-0">
        <figure className="relative aspect-16/10 w-full overflow-hidden">
          <Image
            fill
            src={data.image.url}
            alt={data.image.alt ?? data.title}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
          />
          <div className="absolute top-0 left-0 aspect-16/10 w-full bg-linear-to-t from-black/40 to-transparent" />
          <span className="absolute bottom-3 left-3 rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
            {data.category?.name || "Tanpa Kategori"}
          </span>
        </figure>
        <CardHeader>
          <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
            <Calendar className="size-3" />
            {format(data.publishedAt || data.createdAt, "PP", { locale: id })}
          </span>
          <CardTitle className="line-clamp-2">{data.title}</CardTitle>
          <CardDescription className="line-clamp-2">{data.excerpt}</CardDescription>
          <span className="text-primary inline-flex items-center text-xs font-medium">
            Baca artikel
            <ArrowRight className="ml-1 size-3 transition-transform group-hover:translate-x-0.5" />
          </span>
        </CardHeader>
      </Card>
    </Link>
  )
}
