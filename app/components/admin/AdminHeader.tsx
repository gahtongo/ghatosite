"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuthApi } from "@/hooks/useAuthApi";
import { Bell, Loader2, Menu, Search } from "lucide-react";
import AdminNotificationsPanel, {
  type AdminNotificationItem,
} from "./AdminNotificationsPanel";
import AdminSearchOverlay, {
  type AdminSearchResults,
} from "./AdminSearchOverlay";

const emptyResults: AdminSearchResults = {
  messages: [],
  reports: [],
  news: [],
  campaigns: [],
};

export default function AdminHeader({
  onOpenMobileNav,
}: {
  onOpenMobileNav: () => void;
}) {
  const pathname = usePathname();
  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AdminNotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationsLoading, setIsNotificationsLoading] = useState(false);
  const [markingNotificationId, setMarkingNotificationId] = useState<number | null>(
    null
  );

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] =
    useState<AdminSearchResults>(emptyResults);
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  const searchTimerRef = useRef<number | null>(null);

  const authFetch = useAuthApi();

  const pageTitle = useMemo(() => {
    if (pathname === "/admin") return "Dashboard";
    if (pathname.startsWith("/admin/news")) return "News Manager";
    if (pathname.startsWith("/admin/campaigns")) return "Campaign Manager";
    if (pathname.startsWith("/admin/settings")) return "Settings";
    if (pathname.startsWith("/admin/reports")) return "Reports";
    if (pathname.startsWith("/admin/messages")) return "Messages";
    return "Admin";
  }, [pathname]);

  const fetchUnreadCount = async () => {
    try {
      const res = await authFetch(
        `${API_BASE}/api/v1/admin/notifications/unread-count`,
        {
          cache: "no-store",
        }
      );

      const data = await res.json();
      if (!res.ok) return;

      setUnreadCount(data.unread_count || 0);
    } catch {
      // Silent on header helper fetch
    }
  };

  const fetchNotifications = async () => {
    try {
      setIsNotificationsLoading(true);

      const res = await authFetch(`${API_BASE}/api/v1/admin/notifications?limit=10`, {
        cache: "no-store",
      });

      const data = await res.json();
      if (!res.ok) return;

      setNotifications(data.items || []);
      setUnreadCount(data.unread_count || 0);
    } catch {
      // Silent on header helper fetch
    } finally {
      setIsNotificationsLoading(false);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
  }, [API_BASE]);

  useEffect(() => {
    if (!isNotificationsOpen) return;
    fetchNotifications();
  }, [isNotificationsOpen]);

  useEffect(() => {
    if (!isSearchOpen) return;

    if (searchTimerRef.current) {
      window.clearTimeout(searchTimerRef.current);
    }

    if (!searchQuery.trim()) {
      setSearchResults(emptyResults);
      setIsSearchLoading(false);
      return;
    }

    searchTimerRef.current = window.setTimeout(async () => {
      try {
        setIsSearchLoading(true);

        const res = await authFetch(
          `${API_BASE}/api/v1/admin/search?q=${encodeURIComponent(
            searchQuery
          )}&limit_per_group=6`,
          {
            cache: "no-store",
          }
        );

        const data = await res.json();

        if (!res.ok) {
          setSearchResults(emptyResults);
          return;
        }

        setSearchResults({
          messages: data.messages || [],
          reports: data.reports || [],
          news: data.news || [],
          campaigns: data.campaigns || [],
        });
      } catch {
        setSearchResults(emptyResults);
      } finally {
        setIsSearchLoading(false);
      }
    }, 300);

    return () => {
      if (searchTimerRef.current) {
        window.clearTimeout(searchTimerRef.current);
      }
    };
  }, [API_BASE, isSearchOpen, searchQuery]);

  const handleMarkNotificationRead = async (id: number) => {
    try {
      setMarkingNotificationId(id);

      const res = await authFetch(
        `${API_BASE}/api/v1/admin/notifications/${id}/read`,
        {
          method: "PATCH",
        }
      );

      if (!res.ok) return;

      setNotifications((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, is_read: true } : item
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      // Silent on header helper action
    } finally {
      setMarkingNotificationId(null);
    }
  };

  const handleMarkAllNotificationsRead = async () => {
    try {
      const res = await authFetch(
        `${API_BASE}/api/v1/admin/notifications/mark-all-read`,
        {
          method: "PATCH",
        }
      );

      if (!res.ok) return;

      setNotifications((prev) =>
        prev.map((item) => ({ ...item, is_read: true }))
      );
      setUnreadCount(0);
    } catch {
      // Silent on header helper action
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenMobileNav}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                GAHTO Admin
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
                {pageTitle}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-500 transition hover:bg-slate-100 md:flex"
            >
              <Search className="h-4 w-4" />
              <span className="text-sm font-medium">Search admin</span>
            </button>

            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 md:hidden"
            >
              <Search className="h-4 w-4" />
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsNotificationsOpen((prev) => !prev)}
                className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute right-2 top-2 inline-flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </button>

              <AdminNotificationsPanel
                isOpen={isNotificationsOpen}
                isLoading={isNotificationsLoading}
                notifications={notifications}
                unreadCount={unreadCount}
                markingId={markingNotificationId}
                onClose={() => setIsNotificationsOpen(false)}
                onMarkRead={handleMarkNotificationRead}
                onMarkAllRead={handleMarkAllNotificationsRead}
              />
            </div>

            <div className="hidden items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 sm:flex">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-900 text-sm font-bold text-white">
                A
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Admin</p>
                <p className="text-xs text-slate-500">Authenticated session</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <AdminSearchOverlay
        isOpen={isSearchOpen}
        query={searchQuery}
        onChangeQuery={setSearchQuery}
        onClose={() => {
          setIsSearchOpen(false);
          setSearchQuery("");
          setSearchResults(emptyResults);
          setIsSearchLoading(false);
        }}
        isLoading={isSearchLoading}
        results={searchResults}
      />
    </>
  );
}