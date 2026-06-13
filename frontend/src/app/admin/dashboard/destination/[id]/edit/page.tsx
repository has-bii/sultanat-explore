"use client"

import { Header, HeaderBreadcrumb, HeaderBreadcrumbItem, HeaderLeft } from "@/components/header"
import { MainPage, MainPageContent } from "@/components/main-page"
import { EditDestinationPageSkeleton } from "@/features/destination/components/edit-destination-page-skeleton"
import dynamic from "next/dynamic"
import { useParams } from "next/navigation"

const EditDestinationPage = dynamic(
  () => import("@/features/destination/pages/edit-destination.page"),
  { ssr: false, loading: EditDestinationPageSkeleton },
)

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
    label: "Edit Destinasi",
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
        <EditDestinationPage destinationId={id} />
      </MainPageContent>
    </MainPage>
  )
}
