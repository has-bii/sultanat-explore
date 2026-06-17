"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import { Users } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { getAuthSessionQueryOptions } from "@/features/auth/query"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function NavAdmin() {
  const { data } = useSuspenseQuery(getAuthSessionQueryOptions())
  const pathname = usePathname()

  const user = data.user as unknown as { role: string }

  if (user.role !== "admin") return null

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Admin</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild isActive={pathname.startsWith("/admin/dashboard/user")}>
            <Link href="/admin/dashboard/user">
              <Users />
              <span>Pengguna</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}
