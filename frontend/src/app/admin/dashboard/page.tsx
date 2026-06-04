"use client"

import { Header, HeaderBreadcrumb, HeaderLeft } from "@/components/header"
import { MainPage, MainPageContent } from "@/components/main-page"

export default function AdminDashboardPage() {
  return (
    <MainPage>
      <Header>
        <HeaderLeft>
          <HeaderBreadcrumb items={[{ label: "Dashboard" }]} />
        </HeaderLeft>
      </Header>
      <MainPageContent>
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="bg-muted/50 aspect-video rounded-xl" />
          <div className="bg-muted/50 aspect-video rounded-xl" />
          <div className="bg-muted/50 aspect-video rounded-xl" />
        </div>
        <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
      </MainPageContent>
    </MainPage>
  )
}
