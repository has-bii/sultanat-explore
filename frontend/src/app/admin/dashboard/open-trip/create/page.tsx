import { Header, HeaderBreadcrumb, HeaderBreadcrumbItem, HeaderLeft } from "@/components/header"
import { MainPage, MainPageContent } from "@/components/main-page"
import { CreateOpenTripPage } from "@/features/open-trip/pages/create-open-trip.page"

const breadcrumb: HeaderBreadcrumbItem = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
  },
  {
    label: "Open Trip",
    href: "/admin/dashboard/open-trip",
  },
  {
    label: "Tambah Open Trip",
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
        <CreateOpenTripPage />
      </MainPageContent>
    </MainPage>
  )
}
