"use client"

import { BadgeCheck, Bell, ChevronsUpDown, CreditCard, LogOut, Sparkles } from "lucide-react"
import { useMemo } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function NavUser() {
  const router = useRouter()
  const { data } = authClient.useSession()

  const user = useMemo(() => {
    if (!data)
      return {
        avatar: undefined,
        name: "Loading...",
        email: "Loading...",
      }

    return {
      name: data.user.name,
      email: data.user.email,
      avatar: data.user.image || undefined,
    }
  }, [data])

  const handleLogout = () => {
    const promise = new Promise<{ message: string }>(async (resolve, reject) => {
      const { error } = await authClient.signOut()
      if (error) {
        reject(new Error(error.message || "Failed to logout!"))
      }
      resolve({ message: "Logged out successfully" })
    })

    toast.promise(promise, {
      loading: "Logging out...",
      success: ({ message }) => {
        return message
      },
      error: (err) => {
        if (err instanceof Error) return err.message
        return "Unexpected error has occurred"
      },
      finally: () => {
        router.push("/admin/login")
      },
    })
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side="right"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
