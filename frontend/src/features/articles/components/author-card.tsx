import Image from "next/image"

import type { Author } from "../types"

export function AuthorCard({ author }: { author: Author }) {
  return (
    <div className="bg-muted flex items-center gap-4 rounded-xl p-5">
      <Image
        src={author.avatar}
        alt={author.name}
        width={48}
        height={48}
        className="rounded-full object-cover"
      />
      <div>
        <p className="font-heading text-sm font-bold">{author.name}</p>
        <p className="text-muted-foreground text-sm">{author.role}</p>
      </div>
    </div>
  )
}
