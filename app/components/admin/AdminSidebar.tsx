"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Newspaper,
  Megaphone,
  Settings,
  FileWarning,
  Mail,
  LogOut,
  ShieldCheck,
} from "lucide-react";

export default function AdminSidebar({
  mobileOpen = false,
  onClose,
}: {
  mobileOpen?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const items = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      label: "News",
      href: "/admin/news",
      icon: Newspaper,
    },
    {
      label: "Campaigns",
      href: "/admin/campaigns",
      icon: Megaphone,
    },
    {
      label: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
    {
      label: "Reports",
      href: "/admin/reports",
      icon: FileWarning,
    },
    {
      label: "Messages",
      href: "/admin/messages",
      icon: Mail,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("gahto_admin_token");
    router.replace("/admin/login");
  };

  return (
    <>
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:w-72 lg:flex-col lg:border-r lg:border-slate-200 lg:bg-white">
        <div className="flex h-full flex-col overflow-hidden">
          <div className="border-b border-slate-200 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-900 text-white shadow-sm">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900">GAHTO Admin</p>
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                  Operations Console
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-5">
            <nav>
              <div className="space-y-2">
                {items.map((item) => {
                  const Icon = item.icon;
                  const active =
                    item.href === "/admin"
                      ? pathname === "/admin"
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                        active
                          ? "bg-blue-900 text-white shadow-sm"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </nav>

            <div className="mt-6 border-t border-slate-200 pt-4">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-red-50 hover:text-red-600"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="absolute inset-0 bg-slate-950/40"
            onClick={onClose}
          />
          <aside className="relative h-full w-72 overflow-hidden border-r border-slate-200 bg-white shadow-xl">
            <div className="flex h-full flex-col overflow-hidden">
              <div className="border-b border-slate-200 px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-900 text-white shadow-sm">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-900">GAHTO Admin</p>
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                      Operations Console
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-5">
                <nav>
                  <div className="space-y-2">
                    {items.map((item) => {
                      const Icon = item.icon;
                      const active =
                        item.href === "/admin"
                          ? pathname === "/admin"
                          : pathname.startsWith(item.href);

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={onClose}
                          className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                            active
                              ? "bg-blue-900 text-white shadow-sm"
                              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </nav>

                <div className="mt-6 border-t border-slate-200 pt-4">
                  <button
                    onClick={() => {
                      onClose?.();
                      handleLogout();
                    }}
                    className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-red-50 hover:text-red-600"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}