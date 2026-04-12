"use client";

import { Bell, CheckCheck, Loader2 } from "lucide-react";

export type AdminNotificationItem = {
  id: number;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  related_type?: string | null;
  related_id?: number | null;
  created_at: string;
  updated_at: string;
};

type Props = {
  isOpen: boolean;
  isLoading: boolean;
  notifications: AdminNotificationItem[];
  unreadCount: number;
  markingId: number | null;
  onClose: () => void;
  onMarkRead: (id: number) => void;
  onMarkAllRead: () => void;
};

export default function AdminNotificationsPanel({
  isOpen,
  isLoading,
  notifications,
  unreadCount,
  markingId,
  onClose,
  onMarkRead,
  onMarkAllRead,
}: Props) {
  if (!isOpen) return null;

  const formatDate = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Unknown date";

    return new Intl.DateTimeFormat("en-NG", {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <>
      <button
        type="button"
        aria-label="Close notifications panel"
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/10"
      />

      <div className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-[360px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-2xl">
        <div className="border-b border-slate-200 px-5 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-900">
                Notifications
              </p>
              <h3 className="mt-1 text-lg font-bold text-slate-950">
                Admin activity
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                {unreadCount} unread
              </p>
            </div>

            <button
              type="button"
              onClick={onMarkAllRead}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <CheckCheck className="h-4 w-4" />
              <span>Mark all read</span>
            </button>
          </div>
        </div>

        <div className="max-h-[420px] overflow-y-auto">
          {isLoading ? (
            <div className="flex min-h-[180px] items-center justify-center px-6 py-8">
              <div className="inline-flex items-center gap-3 text-slate-600">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Loading notifications...</span>
              </div>
            </div>
          ) : notifications.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {notifications.map((item) => (
                <div key={item.id} className="px-5 py-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
                        item.is_read ? "bg-slate-300" : "bg-red-500"
                      }`}
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900">
                            {item.title}
                          </p>
                          <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-500">
                            {item.type.replaceAll("_", " ")}
                          </p>
                        </div>

                        <span className="shrink-0 text-xs text-slate-400">
                          {formatDate(item.created_at)}
                        </span>
                      </div>

                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {item.message}
                      </p>

                      {!item.is_read && (
                        <button
                          type="button"
                          disabled={markingId === item.id}
                          onClick={() => onMarkRead(item.id)}
                          className="mt-3 inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-800 transition hover:bg-blue-100 disabled:opacity-70"
                        >
                          {markingId === item.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Bell className="h-4 w-4" />
                          )}
                          <span>Mark read</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                <Bell className="h-5 w-5" />
              </div>
              <p className="mt-4 font-semibold text-slate-900">
                No notifications yet
              </p>
              <p className="mt-1 text-sm text-slate-500">
                New system activity will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}