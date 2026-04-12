"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, Loader2, Lock, Mail, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();

  const API_BASE = useMemo(
    () => (process.env.NEXT_PUBLIC_API_BASE_URL || "").trim(),
    []
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetLink, setResetLink] = useState("");

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setErrorText("");

    if (!API_BASE) {
      setErrorText("Frontend API base URL is not configured.");
      return;
    }

    if (!email.trim() || !password.trim()) {
      setErrorText("Enter your admin email and password.");
      return;
    }

    try {
      setIsLoading(true);

      const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.access_token) {
        setErrorText(data.detail || "Login failed. Please check your credentials.");
        return;
      }

      localStorage.setItem("gahto_admin_token", data.access_token);
      router.replace("/admin");
    } catch {
      setErrorText("Unable to connect to the server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetRequest = async (e: FormEvent) => {
    e.preventDefault();
    setResetMessage("");
    setResetError("");
    setResetLink("");

    if (!API_BASE) {
      setResetError("Frontend API base URL is not configured.");
      return;
    }

    if (!resetEmail.trim()) {
      setResetError("Enter the admin email address.");
      return;
    }

    try {
      setResetLoading(true);

      const res = await fetch(`${API_BASE}/api/v1/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: resetEmail.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setResetError(data.detail || "Unable to submit password reset request.");
        return;
      }

      setResetMessage(
        data.message ||
          "If the account exists, a password reset link has been sent to the email address."
      );

      if (data.reset_link) {
        setResetLink(data.reset_link);
      }
    } catch {
      setResetError("Unable to connect to the server. Please try again.");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center px-4 py-10 sm:px-6">
        <div className="grid w-full items-stretch gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="hidden rounded-[2rem] bg-slate-950 p-8 text-white shadow-2xl lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/75">
                <ShieldCheck className="h-4 w-4 text-red-400" />
                Secure Admin Access
              </div>

              <h1 className="mt-6 text-5xl font-extrabold leading-[1.02] tracking-tight">
                GAHTO Admin
              </h1>

              <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
                Access the operational workspace for reports, contact messages,
                campaigns, site settings, and newsroom management.
              </p>
            </div>

            <div className="grid gap-4">
              {[
                "Review incoming reports and contact submissions",
                "Manage campaigns, updates, and public information",
                "Maintain verified support and emergency contact channels",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-slate-200"
                >
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-900 text-white shadow-sm">
                  <ShieldCheck className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-950">Admin Sign In</h2>
                  <p className="text-sm text-slate-500">
                    Authorized personnel only
                  </p>
                </div>
              </div>

              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-900"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back to site</span>
              </Link>
            </div>

            <form onSubmit={handleLogin} className="mt-8 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email address
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 focus-within:border-blue-900">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent text-sm outline-none"
                    placeholder="Enter admin email"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Password
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 focus-within:border-blue-900">
                  <Lock className="h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent text-sm outline-none"
                    placeholder="Enter password"
                    autoComplete="current-password"
                  />
                </div>
              </div>

              {errorText && (
                <div className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{errorText}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-900 px-5 py-3.5 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-5 border-t border-slate-200 pt-5">
              <button
                type="button"
                onClick={() => {
                  setShowReset((prev) => !prev);
                  setResetMessage("");
                  setResetError("");
                  setResetLink("");
                }}
                className="text-sm font-semibold text-blue-900 transition hover:text-blue-700"
              >
                Forgot password?
              </button>

              {showReset && (
                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">
                    Request password reset
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Enter the admin email address to receive a secure reset link.
                  </p>

                  <form onSubmit={handleResetRequest} className="mt-4 space-y-3">
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="Enter admin email"
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-900"
                      autoComplete="email"
                    />

                    {resetError && (
                      <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {resetError}
                      </div>
                    )}

                    {resetMessage && (
                      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        {resetMessage}
                      </div>
                    )}

                    {resetLink && (
                      <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
                        <p className="font-semibold">Reset link generated</p>
                        <a
                          href={resetLink}
                          className="mt-2 block break-all font-medium underline underline-offset-2"
                        >
                          {resetLink}
                        </a>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={resetLoading}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {resetLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <span>Send reset link</span>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}