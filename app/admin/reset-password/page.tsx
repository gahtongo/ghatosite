import { Suspense } from "react";
import ResetPasswordClient from "./ResetPasswordClient";

export const dynamic = "force-dynamic";

function ResetPasswordFallback() {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <div className="mx-auto flex min-h-screen max-w-5xl items-center px-4 py-10 sm:px-6">
        <div className="w-full rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-6 w-40 rounded bg-slate-200" />
            <div className="h-4 w-64 rounded bg-slate-200" />
            <div className="mt-8 h-12 w-full rounded-2xl bg-slate-200" />
            <div className="h-12 w-full rounded-2xl bg-slate-200" />
            <div className="h-12 w-full rounded-2xl bg-slate-200" />
          </div>
        </div>
      </div>
    </main>
  );
}

export default function AdminResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordClient />
    </Suspense>
  );
}