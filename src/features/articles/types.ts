export type ArticleCategory = "tips-perjalanan" | "panduan" | "destinasi" | "kuliner" | "umrah" | "inspirasi"

export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] }
  | { type: "tip"; title: string; text: string }
  | { type: "quote"; text: string; author?: string }

export type Article = {
  id: string
  slug: string
  title: string
  excerpt: string
  thumbnail: string
  content: ContentBlock[]
  category: ArticleCategory
  date: string
  author: Author
  readingTime: number
  featured: boolean
  metaTitle: string
  metaDescription: string
}

export type Author = {
  name: string
  role: string
  avatar: string
}
