"use client"

import { ChevronsUpDown } from "lucide-react"

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"

export function NavUserSkeleton() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg">
          <Skeleton className="size-10 shrink-0 rounded-full border" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4 border" />
            <Skeleton className="h-4 w-full border" />
          </div>
          <ChevronsUpDown className="size-4" />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
