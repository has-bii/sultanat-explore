"use client"

import { Header, HeaderBreadcrumb, HeaderBreadcrumbItem, HeaderLeft } from "@/components/header"
import { MainPage, MainPageContent } from "@/components/main-page"
import { DestinationSkeleton } from "@/features/destination/components/destination-skeleton"
import dynamic from "next/dynamic"
import { useParams } from "next/navigation"

const EditDestinationPage = dynamic(
  () =>
    import("@/features/destination/pages/edit-destination.page").then((m) => ({
      default: m.EditDestinationPage,
    })),
  { ssr: false, loading: () => <DestinationSkeleton /> },
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
