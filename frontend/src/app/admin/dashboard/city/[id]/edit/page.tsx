"use client"

import { Header, HeaderBreadcrumb, HeaderBreadcrumbItem, HeaderLeft } from "@/components/header"
import { MainPage, MainPageContent } from "@/components/main-page"
import { EditCityPage } from "@/features/city/pages/edit-city.page"
import { useParams } from "next/navigation"

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
    label: "Edit Kota",
  },
]

export default function Page() {
  const { id } = useParams<{ id: string }>()
  return (
    <MainPage>
      <Header>
        <HeaderLeft>
          <HeaderBreadcrumb items={breadcrumb} />
        </HeaderLeft>
      </Header>
      <MainPageContent>
        <EditCityPage cityId={id} />
      </MainPageContent>
    </MainPage>
  )
}
