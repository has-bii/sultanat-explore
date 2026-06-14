import { Suspense } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

import { PasswordSection } from "../components/password-section"
import { ProfileSection } from "../components/profile-section"
import { ProfileSectionSkeleton } from "../components/profile-section-skeleton"

export function SettingsPage() {
  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Pengaturan</h2>
        <p className="text-muted-foreground">Kelola profil dan keamanan akun Anda.</p>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Profil</CardTitle>
          <CardDescription>Kelola informasi profil Anda.</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<ProfileSectionSkeleton />}>
            <ProfileSection />
          </Suspense>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Keamanan</CardTitle>
          <CardDescription>Ubah kata sandi akun Anda.</CardDescription>
        </CardHeader>
        <CardContent>
          <PasswordSection />
        </CardContent>
      </Card>
    </div>
  )
}
