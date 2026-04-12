"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Lock,
  ShieldCheck,
} from "lucide-react";

export default function ResetPasswordClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const API_BASE = useMemo(
    () => (process.env.NEXT_PUBLIC_API_BASE_URL || "").trim(),
    []
  );

  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [successText, setSuccessText] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorText("");
    setSuccessText("");

    if (!API_BASE) {
      setErrorText("Frontend API base URL is not configured.");
      return;
    }

    if (!token) {
      setErrorText("Reset token is missing or invalid.");
      return;
    }

    if (!newPassword.trim()) {
      setErrorText("Enter a new password.");
      return;
    }

    if (newPassword.length < 8) {
      setErrorText("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorText("Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);

      const res = await fetch(`${API_BASE}/api/v1/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          new_password: newPassword,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErrorText(data.detail || "Unable to reset password.");
        return;
      }

      setSuccessText(data.message || "Password has been reset successfully.");

      setTimeout(() => {
        router.replace("/admin/login");
      }, 1800);
    } catch {
      setErrorText("Unable to connect to the server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <div className="mx-auto flex min-h-screen max-w-5xl items-center px-4 py-10 sm:px-6">
        <div className="grid w-full gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="hidden rounded-[2rem] bg-slate-950 p-8 text-white shadow-2xl lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/75">
                <ShieldCheck className="h-4 w-4 text-red-400" />
                Secure Password Recovery
              </div>

              <h1 className="mt-6 text-5xl font-extrabold leading-[1.02] tracking-tight">
                Reset Admin Password
              </h1>

              <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
                Create a new password for your GAHTO admin account and regain secure access.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-slate-200">
              Reset links are time-limited and can only be used once.
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-900 text-white shadow-sm">
                  <ShieldCheck className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-950">Set New Password</h2>
                  <p className="text-sm text-slate-500">
                    Secure admin account recovery
                  </p>
                </div>
              </div>

              <Link
                href="/admin/login"
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-900"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back to login</span>
              </Link>
            </div>

            {!token && (
              <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                Invalid reset link. Please request a new password reset token.
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  New password
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 focus-within:border-blue-900">
                  <Lock className="h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-transparent text-sm outline-none"
                    placeholder="Enter new password"
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Confirm new password
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 focus-within:border-blue-900">
                  <Lock className="h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-transparent text-sm outline-none"
                    placeholder="Confirm new password"
                    autoComplete="new-password"
                  />
                </div>
              </div>

              {errorText && (
                <div className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{errorText}</span>
                </div>
              )}

              {successText && (
                <div className="flex items-start gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{successText}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !token}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-900 px-5 py-3.5 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Resetting password...</span>
                  </>
                ) : (
                  <span>Reset Password</span>
                )}
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}