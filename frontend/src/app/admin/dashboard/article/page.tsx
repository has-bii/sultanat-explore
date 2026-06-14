import { Suspense } from "react"

import { Header, HeaderBreadcrumb, HeaderBreadcrumbItem, HeaderLeft } from "@/components/header"
import { MainPage, MainPageContent } from "@/components/main-page"
import { ArticleListPage } from "@/features/article/pages/article-list.page"
import { ArticleTableSkeleton } from "@/features/article/components/article-table-skeleton"

const breadcrumb: HeaderBreadcrumbItem = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
  },
  {
    label: "Artikel",
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
        <Suspense fallback={<ArticleTableSkeleton />}>
          <ArticleListPage />
        </Suspense>
      </MainPageContent>
    </MainPage>
  )
}
