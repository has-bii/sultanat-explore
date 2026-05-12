import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "Lupa Password — Sultanat Explore",
};

export default function ForgotPasswordPage() {
  return (
    <>
      <div className="mb-8 text-center">
        <h1 className="text-small-heading font-heading font-bold">Lupa Password</h1>
        <p className="mt-2 text-caption text-muted-foreground">
          Masukkan email untuk menerima link reset password
        </p>
      </div>
      <ForgotPasswordForm />
    </>
  );
}
