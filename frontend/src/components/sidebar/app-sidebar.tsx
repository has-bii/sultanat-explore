"use client"

import { Home, Image, PinIcon } from "lucide-react"
import * as React from "react"

import { NavMain } from "@/components/sidebar/nav-main"
import { NavUser } from "@/components/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { NavSkeleton } from "./nav-skeleton"
import { SidebarHeaderItem } from "./sidebar-header-item"

const navMain = [
  {
    title: "Destinasi",
    url: "/admin/dashboard/destination",
    icon: PinIcon,
    items: [
      {
        title: "Kategori",
        url: "/admin/dashboard/destination/category",
      },
      {
        title: "Kota",
        url: "/admin/dashboard/destination/city",
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
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarHeaderItem />
      </SidebarHeader>
      <SidebarContent>
        <React.Suspense fallback={<NavSkeleton length={1} />}>
          <NavDashboard />
        </React.Suspense>
        <React.Suspense fallback={<NavSkeleton label="Platform" length={navMain.length} />}>
          <NavMain items={navMain} />
        </React.Suspense>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

export function NavDashboard() {
  const pathname = usePathname()

  const isActive = pathname === "/admin/dashboard"

  return (
    <SidebarGroup>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild isActive={isActive}>
            <Link href="/admin/dashboard">
              <Home />
              <span>Dashboard</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}
