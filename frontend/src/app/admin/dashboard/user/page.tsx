import { Header, HeaderBreadcrumb, HeaderLeft } from "@/components/header"
import { MainPage, MainPageContent } from "@/components/main-page"
import { UserListPage } from "@/features/user/pages/user-list.page"

const breadcrumb = [{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Pengguna" }]

export default function UserPage() {
  return (
    <MainPage>
      <Header>
        <HeaderLeft>
          <HeaderBreadcrumb items={breadcrumb} />
        </HeaderLeft>
      </Header>
      <MainPageContent>
        <UserListPage />
      </MainPageContent>
    </MainPage>
  )
}
