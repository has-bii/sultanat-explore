import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function AdminDashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/admin/login")
  }

  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-small-heading font-heading font-bold">Dashboard</h1>
        <p className="mt-2 text-caption text-muted-foreground">
          Selamat datang, {session.user.name ?? session.user.email}
        </p>
      </div>
    </div>
  )
}
