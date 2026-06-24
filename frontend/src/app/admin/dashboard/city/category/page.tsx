import { Header, HeaderBreadcrumb, HeaderBreadcrumbItem, HeaderLeft } from "@/components/header"
import { MainPage, MainPageContent } from "@/components/main-page"
import { CityCategoryListPage } from "@/features/city-category/pages/city-category-list.page"

const breadcrumb: HeaderBreadcrumbItem = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
  },
  {
    label: "Kota",
    href: "/admin/dashboard/city",
  },
  {
    label: "Kategori",
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
        <CityCategoryListPage />
      </MainPageContent>
    </MainPage>
  )
}