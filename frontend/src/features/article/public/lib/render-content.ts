import type { JSONContent } from "@tiptap/core"
import { generateHTML } from "@tiptap/html"
import ImageExtension from "@tiptap/extension-image"
import StarterKit from "@tiptap/starter-kit"

// Must match the editor's extension set (components/tiptap/tiptap-editor.tsx)
// so custom nodes/marks render with the same shape.
const extensions = [
  StarterKit.configure({
    heading: { levels: [2, 3] },
    codeBlock: false,
  }),
  ImageExtension.configure({
    inline: false,
    allowBase64: false,
  }),
]

/** Renders Tiptap JSON content to an HTML string (server-safe, no editor instance). */
export function renderArticleContent(content: JSONContent | null | undefined): string {
  if (!content) return ""
  try {
    return generateHTML(content, extensions)
  } catch {
    return ""
  }
}
