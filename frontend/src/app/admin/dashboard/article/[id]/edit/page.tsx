import { Suspense } from "react"

import { Header, HeaderBreadcrumb, HeaderBreadcrumbItem, HeaderLeft } from "@/components/header"
import { MainPage, MainPageContent } from "@/components/main-page"
import { EditArticlePage } from "@/features/article/pages/edit-article.page"
import { EditArticlePageSkeleton } from "@/features/article/components/edit-article-page-skeleton"

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
    label: "Edit Artikel",
  },
]

interface Props {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: Props) {
  const { id } = await params

  return (
    <MainPage>
      <Header>
        <HeaderLeft>
          <HeaderBreadcrumb items={breadcrumb} />
        </HeaderLeft>
      </Header>
      <MainPageContent>
        <Suspense fallback={<EditArticlePageSkeleton />}>
          <EditArticlePage articleId={id} />
        </Suspense>
      </MainPageContent>
    </MainPage>
  )
}
