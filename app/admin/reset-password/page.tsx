"use client";

export const dynamic = "force-dynamic";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token") || "";

  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!API_BASE) {
      setError("API base not configured");
      return;
    }

    if (!token) {
      setError("Invalid reset link");
      return;
    }

    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/api/v1/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          new_password: password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Reset failed");
        return;
      }

      setMessage("Password reset successful. Redirecting to login...");

      setTimeout(() => {
        router.push("/admin/login");
      }, 2000);
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg">
        <h1 className="text-xl font-bold mb-4">Reset Password</h1>

        {!token && (
          <p className="text-red-600 text-sm">
            Invalid or missing reset token.
          </p>
        )}

        {token && (
          <form onSubmit={handleReset} className="space-y-4">
            <input
              type="password"
              placeholder="New password"
              className="w-full border rounded-xl px-4 py-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="Confirm password"
              className="w-full border rounded-xl px-4 py-3"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />

            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}

            {message && (
              <div className="text-green-600 text-sm">{message}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-900 text-white py-3 rounded-xl font-semibold"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}