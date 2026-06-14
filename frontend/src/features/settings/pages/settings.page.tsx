import { Suspense } from "react"

import { Separator } from "@/components/ui/separator"

import { PasswordSection } from "../components/password-section"
import { ProfileSection } from "../components/profile-section"

export function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Pengaturan</h2>
        <p className="text-muted-foreground">Kelola profil dan keamanan akun Anda.</p>
      </div>

      <Separator />

      <Suspense fallback={<div>Memuat...</div>}>
        <ProfileSection />
      </Suspense>

      <Separator />

      <Suspense fallback={<div>Memuat...</div>}>
        <PasswordSection />
      </Suspense>
    </div>
  )
}
