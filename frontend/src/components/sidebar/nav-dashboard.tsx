"use client"

import { Home } from "lucide-react"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar"

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
