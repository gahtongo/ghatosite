"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const isPublicAdminRoute = useMemo(() => {
    return (
      pathname === "/admin/login" ||
      pathname === "/admin/reset-password"
    );
  }, [pathname]);

  useEffect(() => {
    if (isPublicAdminRoute) {
      setCheckingAuth(false);
      return;
    }

    const token = localStorage.getItem("gahto_admin_token");

    if (!token) {
      router.replace("/admin/login");
      return;
    }

    setCheckingAuth(false);
  }, [isPublicAdminRoute, pathname, router]);

  if (isPublicAdminRoute) {
    return <>{children}</>;
  }

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 text-slate-600 shadow-sm">
          Checking admin access...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar
        mobileOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col lg:pl-72">
        <AdminHeader onOpenMobileNav={() => setIsMobileNavOpen(true)} />
        <main className="flex-1 px-4 py-5 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}