"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuthApi } from "@/hooks/useAuthApi";
import {
  CheckCircle2,
  Loader2,
  Mail,
  RefreshCw,
  XCircle,
} from "lucide-react";

type ContactMessage = {
  id: number;
  name: string;
  email: string;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export default function AdminMessagesPage() {
  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusText, setStatusText] = useState("");
  const [errorText, setErrorText] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const authFetch = useAuthApi();

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      setErrorText("");

      const res = await authFetch(`${API_BASE}/api/v1/contact-messages/admin`, {
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorText(data.detail || "Failed to load admin inbox.");
        return;
      }

      setMessages(data);
    } catch {
      setErrorText("Unable to load admin inbox right now.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [API_BASE]);

  const handleStatusUpdate = async (messageId: number, status: string) => {
    try {
      setUpdatingId(messageId);
      setStatusText("");
      setErrorText("");

      const res = await authFetch(
        `${API_BASE}/api/v1/contact-messages/admin/${messageId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setErrorText(data.detail || "Failed to update message status.");
        return;
      }

      setStatusText("Message status updated successfully.");
      fetchMessages();
    } catch {
      setErrorText("Unable to update message status right now.");
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (value: string) => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "Unknown date";

    return new Intl.DateTimeFormat("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  };

  const stats = useMemo(() => {
    return {
      total: messages.length,
      newCount: messages.filter((item) => item.status === "new").length,
      read: messages.filter((item) => item.status === "read").length,
      replied: messages.filter((item) => item.status === "replied").length,
    };
  }, [messages]);

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-900">
              Messages Inbox
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
              Public contact form submissions
            </h2>
            <p className="mt-4 max-w-3xl text-slate-600 leading-relaxed">
              Review inbound messages from the website, mark them as read,
              replied, or archived, and keep track of important outreach.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Total", value: stats.total },
              { label: "New", value: stats.newCount },
              { label: "Read", value: stats.read },
              { label: "Replied", value: stats.replied },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  {item.label}
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-950">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {(statusText || errorText) && (
        <div className="space-y-3">
          {statusText && (
            <div className="flex items-start gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{statusText}</span>
            </div>
          )}

          {errorText && (
            <div className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{errorText}</span>
            </div>
          )}
        </div>
      )}

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-900">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900">Inbox</p>
              <p className="text-sm text-slate-500">
                Manage incoming public contact submissions
              </p>
            </div>
          </div>

          <button
            onClick={fetchMessages}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>

        {isLoading ? (
          <div className="mt-6 flex min-h-[220px] items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
            <div className="inline-flex items-center gap-3 text-slate-600">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading messages...</span>
            </div>
          </div>
        ) : messages.length > 0 ? (
          <div className="mt-6 grid gap-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className="rounded-[1.5rem] border border-slate-200 bg-white p-5 transition hover:shadow-sm"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${
                          message.status === "new"
                            ? "bg-red-50 text-red-600"
                            : message.status === "read"
                            ? "bg-amber-50 text-amber-700"
                            : message.status === "replied"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {message.status}
                      </span>

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-700">
                        {formatDate(message.created_at)}
                      </span>
                    </div>

                    <h3 className="mt-4 text-xl font-bold text-slate-950">
                      {message.name}
                    </h3>

                    <p className="mt-1 text-sm font-medium text-blue-900 break-all">
                      {message.email}
                    </p>

                    <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                      <p className="whitespace-pre-line text-sm leading-7 text-slate-700">
                        {message.message}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 lg:w-[260px] lg:justify-end">
                    <button
                      type="button"
                      disabled={updatingId === message.id}
                      onClick={() => handleStatusUpdate(message.id, "read")}
                      className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-700 transition hover:bg-amber-100 disabled:opacity-70"
                    >
                      {updatingId === message.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4" />
                      )}
                      <span>Mark Read</span>
                    </button>

                    <button
                      type="button"
                      disabled={updatingId === message.id}
                      onClick={() => handleStatusUpdate(message.id, "replied")}
                      className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-70"
                    >
                      {updatingId === message.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Mail className="h-4 w-4" />
                      )}
                      <span>Mark Replied</span>
                    </button>

                    <button
                      type="button"
                      disabled={updatingId === message.id}
                      onClick={() => handleStatusUpdate(message.id, "archived")}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-70"
                    >
                      {updatingId === message.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                      <span>Archive</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-slate-600">
            No contact messages found yet.
          </div>
        )}
      </section>
    </div>
  );
}