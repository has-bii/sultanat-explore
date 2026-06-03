import { LoginForm } from "@/features/auth"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login Admin — Sultanat Explore",
}

export default function AdminLoginPage() {
  return (
    <>
      <div className="mb-8 text-center">
        <h1 className="text-small-heading font-heading font-bold">Admin Login</h1>
        <p className="mt-2 text-caption text-muted-foreground">
          Masuk ke dashboard admin Sultanat Explore
        </p>
      </div>
      <LoginForm />
    </>
  )
}
