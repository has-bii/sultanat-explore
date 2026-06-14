"use client"

import { Image, PinIcon } from "lucide-react"
import { Suspense } from "react"

import { NavMain } from "@/components/sidebar/nav-main"
import { NavUserSkeleton } from "@/components/sidebar/nav-user-skeleton"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

import { ClientOnly } from "../client-only"
import { NavDashboard } from "./nav-dashboard"
import { NavSkeleton } from "./nav-skeleton"
import { NavUser } from "./nav-user"
import { SidebarHeaderItem } from "./sidebar-header-item"

const navMain = [
  {
    title: "Destinasi",
    url: "/admin/dashboard/destination",
    icon: PinIcon,
    items: [
      {
        title: "Overview",
        url: "/admin/dashboard/destination",
      },
      {
        title: "Atraksi",
        url: "/admin/dashboard/destination/attraction",
      },
    ],
  },
  {
    title: "Foto",
    url: "/admin/dashboard/image",
    icon: Image,
    items: [
      {
        title: "Overview",
        url: "/admin/dashboard/image",
      },
    ],
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarHeaderItem />
      </SidebarHeader>
      <SidebarContent>
        <Suspense fallback={<NavSkeleton length={1} />}>
          <NavDashboard />
        </Suspense>
        <Suspense fallback={<NavSkeleton label="Platform" length={navMain.length} />}>
          <NavMain items={navMain} />
        </Suspense>
      </SidebarContent>
      <SidebarFooter>
        <ClientOnly>
          <Suspense fallback={<NavUserSkeleton />}>
            <NavUser />
          </Suspense>
        </ClientOnly>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
