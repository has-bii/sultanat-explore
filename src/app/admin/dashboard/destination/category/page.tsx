import { Header, HeaderBreadcrumb, HeaderBreadcrumbItem, HeaderLeft } from "@/components/header"
import { MainPage, MainPageContent } from "@/components/main-page"

const breadcrumb: HeaderBreadcrumbItem = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
  },
  {
    label: "Destinasi",
    href: "/admin/dashboard/destination",
  },
  {
    label: "Kategori",
    href: "/admin/dashboard/destination/category",
  },
]

export default function CategoryPage() {
  return (
    <MainPage>
      <Header>
        <HeaderLeft>
          <HeaderBreadcrumb items={breadcrumb} />
        </HeaderLeft>
      </Header>
      <MainPageContent></MainPageContent>
    </MainPage>
  )
}
