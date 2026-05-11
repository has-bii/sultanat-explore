import { Lightbulb, Quote } from "lucide-react"
import type { ContentBlock } from "../types"

export function ArticleBody({ content }: { content: ContentBlock[] }) {
  return (
    <div className="prose-article">
      {content.map((block, i) => {
        switch (block.type) {
          case "heading":
            return (
              <h2
                key={i}
                className="mt-10 font-heading text-small-heading font-bold tracking-tight first:mt-0"
              >
                {block.text}
              </h2>
            )

          case "paragraph":
            return (
              <p key={i} className="mt-4 text-base leading-relaxed text-muted-foreground">
                {block.text}
              </p>
            )

          case "list":
            return (
              <ul key={i} className="mt-4 space-y-2">
                {block.items.map((item, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-3 text-base leading-relaxed text-muted-foreground"
                  >
                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            )

          case "tip":
            return (
              <div
                key={i}
                className="mt-6 rounded-xl border border-primary/10 bg-primary/5 p-5"
              >
                <div className="flex items-center gap-2 text-sm font-bold text-primary">
                  <Lightbulb className="h-4 w-4" />
                  {block.title}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {block.text}
                </p>
              </div>
            )

          case "quote":
            return (
              <blockquote
                key={i}
                className="mt-8 border-l-4 border-primary pl-6"
              >
                <Quote className="h-5 w-5 text-primary/40" />
                <p className="mt-2 text-lg font-medium italic leading-relaxed">
                  &ldquo;{block.text}&rdquo;
                </p>
                {block.author && (
                  <cite className="mt-2 block text-sm text-muted-foreground not-italic">
                    — {block.author}
                  </cite>
                )}
              </blockquote>
            )

          default:
            return null
        }
      })}
    </div>
  )
}
