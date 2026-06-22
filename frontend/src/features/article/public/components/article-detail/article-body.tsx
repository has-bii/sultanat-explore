import type { JSONContent } from "@tiptap/core"

import { renderArticleContent } from "../../lib/render-content"

type Props = { content: JSONContent | null | undefined }

/** Server component — renders Tiptap JSON to HTML via generateHTML. */
export function ArticleBody({ content }: Props) {
  const html = renderArticleContent(content)
  if (!html) return null

  return <div className="prose-article" dangerouslySetInnerHTML={{ __html: html }} />
}
