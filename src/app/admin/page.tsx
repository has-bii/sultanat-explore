import { auth } from "@backend/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function AdminIndexPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  redirect(session ? "/admin/dashboard" : "/admin/login")
}
