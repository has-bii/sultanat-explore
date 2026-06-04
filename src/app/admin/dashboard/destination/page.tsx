import { Header, HeaderBreadcrumb, HeaderBreadcrumbItem, HeaderLeft } from "@/components/header"
import { MainPage, MainPageContent } from "@/components/main-page"

const breadcrumb: HeaderBreadcrumbItem = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
  },
  {
    label: "Destinasi",
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
      <MainPageContent></MainPageContent>
    </MainPage>
  )
}
