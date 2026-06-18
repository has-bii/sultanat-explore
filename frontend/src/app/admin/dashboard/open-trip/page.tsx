import { Suspense } from "react"

import { Header, HeaderBreadcrumb, HeaderBreadcrumbItem, HeaderLeft } from "@/components/header"
import { MainPage, MainPageContent } from "@/components/main-page"
import { TableSkeleton } from "@/components/table-skeleton"
import { OpenTripListPage } from "@/features/open-trip/pages/open-trip-list.page"

const breadcrumb: HeaderBreadcrumbItem = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
  },
  {
    label: "Open Trip",
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
        <Suspense fallback={<TableSkeleton rowCount={5} columns={5} />}>
          <OpenTripListPage />
        </Suspense>
      </MainPageContent>
    </MainPage>
  )
}
