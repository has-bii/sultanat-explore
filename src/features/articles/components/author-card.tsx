import type { Author } from "../types"

export function AuthorCard({ author }: { author: Author }) {
  return (
    <div className="flex items-center gap-4 rounded-xl bg-muted p-5">
      <img src={author.avatar} alt={author.name} className="h-12 w-12 rounded-full object-cover" />
      <div>
        <p className="font-heading text-sm font-bold">{author.name}</p>
        <p className="text-sm text-muted-foreground">{author.role}</p>
      </div>
    </div>
  )
}
