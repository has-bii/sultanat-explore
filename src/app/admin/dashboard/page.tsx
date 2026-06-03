"use client"

import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

export default function AdminDashboardPage() {
  const { isPending, data } = authClient.useSession()
  const router = useRouter()

  const handleLogout = async () => {
    await authClient.signOut()
    router.push("/admin/login")
  }

  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-small-heading font-heading font-bold">Dashboard</h1>
        {data && (
          <>
            <p className="text-caption text-muted-foreground mt-2">
              Selamat datang, {data.user.name}
            </p>
            <Button className="mt-4" onClick={handleLogout}>
              Logout
            </Button>
          </>
        )}

        {isPending && <p className="text-caption text-muted-foreground mt-2">Loading...</p>}
      </div>
    </div>
  )
}
