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
                className="font-heading text-small-heading mt-10 font-bold tracking-tight first:mt-0"
              >
                {block.text}
              </h2>
            )

          case "paragraph":
            return (
              <p key={i} className="text-muted-foreground mt-4 text-base leading-relaxed">
                {block.text}
              </p>
            )

          case "list":
            return (
              <ul key={i} className="mt-4 space-y-2">
                {block.items.map((item, j) => (
                  <li
                    key={j}
                    className="text-muted-foreground flex items-start gap-3 text-base leading-relaxed"
                  >
                    <span className="bg-primary mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            )

          case "tip":
            return (
              <div key={i} className="border-primary/10 bg-primary/5 mt-6 rounded-xl border p-5">
                <div className="text-primary flex items-center gap-2 text-sm font-bold">
                  <Lightbulb className="h-4 w-4" />
                  {block.title}
                </div>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{block.text}</p>
              </div>
            )

          case "quote":
            return (
              <blockquote key={i} className="border-primary mt-8 border-l-4 pl-6">
                <Quote className="text-primary/40 h-5 w-5" />
                <p className="mt-2 text-lg leading-relaxed font-medium italic">
                  &ldquo;{block.text}&rdquo;
                </p>
                {block.author && (
                  <cite className="text-muted-foreground mt-2 block text-sm not-italic">
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
