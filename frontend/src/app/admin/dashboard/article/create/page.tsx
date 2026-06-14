import { Suspense } from "react"

import { Header, HeaderBreadcrumb, HeaderBreadcrumbItem, HeaderLeft } from "@/components/header"
import { MainPage, MainPageContent } from "@/components/main-page"
import { CreateArticlePage } from "@/features/article/pages/create-article.page"
import { TiptapEditorSkeleton } from "@/components/tiptap"

const breadcrumb: HeaderBreadcrumbItem = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
  },
  {
    label: "Artikel",
    href: "/admin/dashboard/article",
  },
  {
    label: "Tambah Artikel",
  },
]

export default function Page() {
  return (
    <MainPage>
      <Header>
        <HeaderLeft>
          <HeaderBreadcrumb items={breadcrumb} />
        </HeaderLeft>
      </Header>
      <MainPageContent>
        <Suspense fallback={<div className="mx-auto mt-10 w-full max-w-3xl"><TiptapEditorSkeleton /></div>}>
          <CreateArticlePage />
        </Suspense>
      </MainPageContent>
    </MainPage>
  )
}
