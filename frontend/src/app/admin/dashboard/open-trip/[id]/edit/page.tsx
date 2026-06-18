import { Suspense } from "react"

import { Header, HeaderBreadcrumb, HeaderBreadcrumbItem, HeaderLeft } from "@/components/header"
import { MainPage, MainPageContent } from "@/components/main-page"
import { EditOpenTripPageSkeleton } from "@/features/open-trip/components/edit-skeleton"
import { EditOpenTripPage } from "@/features/open-trip/pages/edit-open-trip.page"

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
    label: "Edit Open Trip",
  },
]

interface Props {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: Props) {
  const { id } = await params

  return (
    <MainPage>
      <Header>
        <HeaderLeft>
          <HeaderBreadcrumb items={breadcrumb} />
        </HeaderLeft>
      </Header>
      <MainPageContent>
        <Suspense fallback={<EditOpenTripPageSkeleton />}>
          <EditOpenTripPage openTripId={id} />
        </Suspense>
      </MainPageContent>
    </MainPage>
  )
}
