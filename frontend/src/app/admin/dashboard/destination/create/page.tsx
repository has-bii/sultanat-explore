import { Header, HeaderBreadcrumb, HeaderBreadcrumbItem, HeaderLeft } from "@/components/header"
import { MainPage, MainPageContent } from "@/components/main-page"
import { CreateDestinationPage } from "@/features/destination/pages/create-destination.page"

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
    label: "Tambah Destinasi",
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
        <CreateDestinationPage />
      </MainPageContent>
    </MainPage>
  )
}
