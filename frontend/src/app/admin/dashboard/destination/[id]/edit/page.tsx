"use client"

import { Suspense } from "react"

import { Header, HeaderBreadcrumb, HeaderBreadcrumbItem, HeaderLeft } from "@/components/header"
import { MainPage, MainPageContent } from "@/components/main-page"
import { EditDestinationPageSkeleton } from "@/features/destination/components/edit-destination-page-skeleton"
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
        <Suspense fallback={<EditDestinationPageSkeleton />}>
          <EditDestinationPage destinationId={id} />
        </Suspense>
      </MainPageContent>
    </MainPage>
  )
}
