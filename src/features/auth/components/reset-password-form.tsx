"use client";

import { useAppForm } from "@/lib/form";
import { authClient } from "@/lib/auth-client";
import { resetPasswordSchema } from "@/features/auth/dto/auth.schema";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

function ResetPasswordFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [formError, setFormError] = useState<string | null>(null);

  const form = useAppForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    } as const,
    validators: {
      onSubmit: ({ value }) => {
        const result = resetPasswordSchema.safeParse(value);
        if (!result.success) return result.error.issues;
      },
    },
    onSubmit: async ({ value }) => {
      setFormError(null);
      if (!token) {
        setFormError(
          "Token reset tidak ditemukan. Request ulang dari link forgot password."
        );
        return;
      }
      const { error } = await authClient.resetPassword({
        newPassword: value.password,
        token,
      });
      if (error) {
        setFormError(error.message ?? "Gagal reset password.");
        return;
      }
      router.push("/admin/login");
    },
  });

  if (!token) {
    return (
      <div className="text-center text-sm text-destructive">
        Token reset tidak valid atau sudah kadaluarsa.{" "}
        <a
          href="/admin/forgot-password"
          className="underline underline-offset-4"
        >
          Request ulang
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="flex flex-col gap-6"
    >
      <form.AppField name="password">
        {(field) => (
          <field.TextField
            field={field}
            label="Password Baru"
            type="password"
            placeholder="Minimal 8 karakter"
          />
        )}
      </form.AppField>

      <form.AppField name="confirmPassword">
        {(field) => (
          <field.TextField
            field={field}
            label="Konfirmasi Password"
            type="password"
            placeholder="Ulangi password"
          />
        )}
      </form.AppField>

      {formError && (
        <div role="alert" className="text-sm text-destructive">
          {formError}
        </div>
      )}

      <form.SubmitButton form={form} label="Reset Password" pendingLabel="Memproses..." />
    </form>
  );
}

export function ResetPasswordForm() {
  return (
    <Suspense>
      <ResetPasswordFormInner />
    </Suspense>
  );
}
