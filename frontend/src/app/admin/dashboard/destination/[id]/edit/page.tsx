"use client"

import { Header, HeaderBreadcrumb, HeaderBreadcrumbItem, HeaderLeft } from "@/components/header"
import { MainPage, MainPageContent } from "@/components/main-page"
import { QueryBoundary } from "@/components/query-boundary"
import { DestinationSkeleton } from "@/features/destination/components/destination-skeleton"
import { EditDestinationPage } from "@/features/destination/pages/edit-destination.page"
import { useParams } from "next/navigation"

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
        <QueryBoundary loadingFallback={<DestinationSkeleton />}>
          <EditDestinationPage destinationId={id} />
        </QueryBoundary>
      </MainPageContent>
    </MainPage>
  )
}
