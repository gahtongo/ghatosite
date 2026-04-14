"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuthApi } from "../../hooks/useAuthApi";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Eye,
  Loader2,
  RefreshCw,
  ShieldAlert,
  XCircle,
} from "lucide-react";

type ReportItem = {
  id: number;
  case_type: string;
  urgency: string;
  description: string;
  location?: string | null;
  incident_time?: string | null;
  additional_notes?: string | null;
  is_anonymous: boolean;
  reporter_name?: string | null;
  reporter_email?: string | null;
  reporter_phone?: string | null;
  status: string;
  ai_severity_score?: number | null;
  ai_summary?: string | null;
  escalation_status: string;
  created_at: string;
  updated_at: string;
};

type ReportStatus = "new" | "in_review" | "resolved" | "archived";

const statusOptions: ReportStatus[] = [
  "new",
  "in_review",
  "resolved",
  "archived",
];

export default function AdminReportsPage() {
  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

  const [reports, setReports] = useState<ReportItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusText, setStatusText] = useState("");
  const [errorText, setErrorText] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [urgencyFilter, setUrgencyFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const authFetch = useAuthApi();

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      setErrorText("");

      const params = new URLSearchParams();

      if (statusFilter !== "all") {
        params.set("status_filter", statusFilter);
      }

      if (urgencyFilter !== "all") {
        params.set("urgency_filter", urgencyFilter);
      }

      const query = params.toString();
      const url = `${API_BASE}/api/v1/reports/admin${query ? `?${query}` : ""}`;

      const res = await authFetch(url, {
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorText(data.detail || "Failed to load reports workspace.");
        setReports([]);
        return;
      }

      setReports(Array.isArray(data) ? data : []);
    } catch {
      setErrorText("Unable to load reports workspace right now.");
      setReports([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [API_BASE, statusFilter, urgencyFilter]);

  const handleStatusUpdate = async (
    reportId: number,
    nextStatus: ReportStatus
  ) => {
    try {
      setUpdatingId(reportId);
      setStatusText("");
      setErrorText("");

      const res = await authFetch(`${API_BASE}/api/v1/reports/admin/${reportId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorText(data.detail || "Failed to update report status.");
        return;
      }

      setStatusText("Report status updated successfully.");
      setReports((prev) =>
        prev.map((item) =>
          item.id === reportId ? { ...item, ...data } : item
        )
      );
    } catch {
      setErrorText("Unable to update report status right now.");
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

  const getUrgencyClasses = (urgency: string) => {
    const normalized = urgency.trim().toLowerCase();

    if (normalized === "urgent") {
      return "bg-red-50 text-red-700 border-red-200";
    }

    if (normalized === "medium") {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }

    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  const getStatusClasses = (status: string) => {
    const normalized = status.trim().toLowerCase();

    if (normalized === "new") {
      return "bg-red-50 text-red-700";
    }

    if (normalized === "in_review") {
      return "bg-blue-50 text-blue-700";
    }

    if (normalized === "resolved") {
      return "bg-emerald-50 text-emerald-700";
    }

    return "bg-slate-100 text-slate-700";
  };

  const stats = useMemo(() => {
    return {
      total: reports.length,
      urgent: reports.filter(
        (item) => item.urgency.trim().toLowerCase() === "urgent"
      ).length,
      newCount: reports.filter(
        (item) => item.status.trim().toLowerCase() === "new"
      ).length,
      inReview: reports.filter(
        (item) => item.status.trim().toLowerCase() === "in_review"
      ).length,
      resolved: reports.filter(
        (item) => item.status.trim().toLowerCase() === "resolved"
      ).length,
    };
  }, [reports]);

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-900">
              Reports Workspace
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
              Review submitted case reports
            </h2>
            <p className="mt-4 max-w-3xl leading-relaxed text-slate-600">
              Monitor incoming public reports, review urgency, update workflow
              status, and prepare this workspace for later AI-assisted triage
              and escalation support.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {[
              { label: "Total", value: stats.total },
              { label: "Urgent", value: stats.urgent },
              { label: "New", value: stats.newCount },
              { label: "Review", value: stats.inReview },
              { label: "Resolved", value: stats.resolved },
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

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-lg font-bold text-slate-900">Case Queue</p>
            <p className="mt-1 text-sm text-slate-500">
              Filter and manage submitted reports from the public reporting flow
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-900 sm:w-[180px]"
              >
                <option value="all">All statuses</option>
                <option value="new">New</option>
                <option value="in_review">In review</option>
                <option value="resolved">Resolved</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Urgency
              </label>
              <select
                value={urgencyFilter}
                onChange={(e) => setUrgencyFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-900 sm:w-[180px]"
              >
                <option value="all">All urgency</option>
                <option value="urgent">Urgent</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <button
              onClick={fetchReports}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="mt-6 flex min-h-[240px] items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
            <div className="inline-flex items-center gap-3 text-slate-600">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading reports...</span>
            </div>
          </div>
        ) : reports.length > 0 ? (
          <div className="mt-6 grid gap-4">
            {reports.map((report) => {
              const expanded = expandedId === report.id;

              return (
                <div
                  key={report.id}
                  className="rounded-[1.5rem] border border-slate-200 bg-white p-5 transition hover:shadow-sm"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${getUrgencyClasses(
                            report.urgency
                          )}`}
                        >
                          {report.urgency}
                        </span>

                        <span
                          className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${getStatusClasses(
                            report.status
                          )}`}
                        >
                          {report.status.replaceAll("_", " ")}
                        </span>

                        <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-700">
                          {report.case_type}
                        </span>

                        <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-700">
                          {formatDate(report.created_at)}
                        </span>
                      </div>

                      <div className="mt-4 flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                          {report.urgency.trim().toLowerCase() === "urgent" ? (
                            <ShieldAlert className="h-5 w-5" />
                          ) : (
                            <AlertTriangle className="h-5 w-5" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <h3 className="text-xl font-bold text-slate-950">
                            Case #{report.id}
                          </h3>
                          <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-700">
                            {report.description}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        <div className="rounded-2xl bg-slate-50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                            Reporter
                          </p>
                          <p className="mt-2 text-sm font-medium text-slate-800">
                            {report.is_anonymous
                              ? "Anonymous"
                              : report.reporter_name || "Not provided"}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                            Location
                          </p>
                          <p className="mt-2 text-sm font-medium text-slate-800">
                            {report.location || "Not provided"}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                            Incident Time
                          </p>
                          <p className="mt-2 text-sm font-medium text-slate-800">
                            {report.incident_time || "Not provided"}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                            Escalation
                          </p>
                          <p className="mt-2 text-sm font-medium capitalize text-slate-800">
                            {report.escalation_status || "pending"}
                          </p>
                        </div>
                      </div>

                      {expanded && (
                        <div className="mt-4 grid gap-4 lg:grid-cols-2">
                          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                              Contact details
                            </p>
                            <div className="mt-3 space-y-2 text-sm text-slate-700">
                              <p>
                                <span className="font-semibold text-slate-900">
                                  Name:
                                </span>{" "}
                                {report.reporter_name || "Not provided"}
                              </p>
                              <p>
                                <span className="font-semibold text-slate-900">
                                  Email:
                                </span>{" "}
                                {report.reporter_email || "Not provided"}
                              </p>
                              <p>
                                <span className="font-semibold text-slate-900">
                                  Phone:
                                </span>{" "}
                                {report.reporter_phone || "Not provided"}
                              </p>
                            </div>
                          </div>

                          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                              Additional notes
                            </p>
                            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-700">
                              {report.additional_notes || "No additional notes."}
                            </p>
                          </div>

                          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 lg:col-span-2">
                            <div className="flex items-center gap-2">
                              <Clock3 className="h-4 w-4 text-slate-500" />
                              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                                AI triage placeholder
                              </p>
                            </div>

                            <div className="mt-3 grid gap-4 sm:grid-cols-2">
                              <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                                  AI severity score
                                </p>
                                <p className="mt-2 text-sm font-medium text-slate-800">
                                  {report.ai_severity_score ?? "Not available yet"}
                                </p>
                              </div>

                              <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                                  AI summary
                                </p>
                                <p className="mt-2 text-sm leading-7 text-slate-700">
                                  {report.ai_summary ||
                                    "AI-assisted summary will appear here once the triage layer is connected."}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-3 lg:w-[290px] lg:justify-end">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedId((prev) =>
                            prev === report.id ? null : report.id
                          )
                        }
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        <Eye className="h-4 w-4" />
                        <span>{expanded ? "Hide details" : "View details"}</span>
                      </button>

                      {statusOptions.map((nextStatus) => {
                        if (nextStatus === report.status) return null;

                        const label =
                          nextStatus === "in_review"
                            ? "Mark Review"
                            : nextStatus === "resolved"
                            ? "Mark Resolved"
                            : nextStatus === "archived"
                            ? "Archive"
                            : "Mark New";

                        const classes =
                          nextStatus === "in_review"
                            ? "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                            : nextStatus === "resolved"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : nextStatus === "archived"
                            ? "border-slate-300 text-slate-700 hover:bg-slate-50"
                            : "border-red-200 bg-red-50 text-red-700 hover:bg-red-100";

                        return (
                          <button
                            key={`${report.id}-${nextStatus}`}
                            type="button"
                            disabled={updatingId === report.id}
                            onClick={() =>
                              handleStatusUpdate(report.id, nextStatus)
                            }
                            className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition disabled:opacity-70 ${classes}`}
                          >
                            {updatingId === report.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : nextStatus === "resolved" ? (
                              <CheckCircle2 className="h-4 w-4" />
                            ) : nextStatus === "in_review" ? (
                              <Clock3 className="h-4 w-4" />
                            ) : nextStatus === "archived" ? (
                              <XCircle className="h-4 w-4" />
                            ) : (
                              <AlertTriangle className="h-4 w-4" />
                            )}
                            <span>{label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-slate-600">
            No reports found yet.
          </div>
        )}
      </section>
    </div>
  );
}