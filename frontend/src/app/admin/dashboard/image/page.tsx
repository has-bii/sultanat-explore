import { Header, HeaderBreadcrumb, HeaderBreadcrumbItem, HeaderLeft } from "@/components/header"
import { MainPage, MainPageContent } from "@/components/main-page"
import { LibraryPage } from "@/features/image"

const breadcrumb: HeaderBreadcrumbItem = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
  },
  {
    label: "Foto",
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
        <LibraryPage />
      </MainPageContent>
    </MainPage>
  )
}
