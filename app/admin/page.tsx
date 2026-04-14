"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthApi } from "@/hooks/useAuthApi";
import {
  AlertTriangle,
  FileWarning,
  Loader2,
  Megaphone,
  Newspaper,
  Settings,
  Users,
} from "lucide-react";

type DashboardStats = {
  total_admins: number;
  total_settings: number;
  total_reports: number;
  urgent_reports: number;
  total_news: number;
  published_news: number;
  total_campaigns: number;
  active_campaigns: number;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

  const authFetch = useAuthApi();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setIsLoading(true);

        const res = await authFetch(`${API_BASE}/api/v1/admin/dashboard`, {
          cache: "no-store",
        });

        const data = await res.json();

        if (!res.ok) return;

        setStats(data.stats || null);
        setMessage(data.message || "");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, [API_BASE]);

  const cards = [
    {
      label: "Total Reports",
      value: stats?.total_reports ?? 0,
      icon: FileWarning,
      tone: "bg-red-50 text-red-600",
    },
    {
      label: "Urgent Reports",
      value: stats?.urgent_reports ?? 0,
      icon: AlertTriangle,
      tone: "bg-amber-50 text-amber-600",
    },
    {
      label: "Published News",
      value: stats?.published_news ?? 0,
      icon: Newspaper,
      tone: "bg-blue-50 text-blue-700",
    },
    {
      label: "Active Campaigns",
      value: stats?.active_campaigns ?? 0,
      icon: Megaphone,
      tone: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Settings Entries",
      value: stats?.total_settings ?? 0,
      icon: Settings,
      tone: "bg-violet-50 text-violet-700",
    },
    {
      label: "Admin Users",
      value: stats?.total_admins ?? 0,
      icon: Users,
      tone: "bg-slate-100 text-slate-700",
    },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-900">
          Operations Overview
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
          {message || "Welcome to GAHTO Admin"}
        </h2>
        <p className="mt-3 max-w-3xl text-slate-600 leading-relaxed">
          This workspace is where your team manages press coverage, live updates,
          campaigns, reports, and contact settings.
        </p>
      </section>

      {isLoading ? (
        <div className="flex min-h-[240px] items-center justify-center rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="inline-flex items-center gap-3 text-slate-600">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading dashboard...</span>
          </div>
        </div>
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {cards.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.label}
                  className="rounded-[1.75rem] border border-slate-200 bg-white p-4 sm:p-5 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-500">
                        {card.label}
                      </p>
                      <p className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-slate-950">
                        {card.value}
                      </p>
                    </div>

                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.tone}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </section>

          <section className="grid gap-4 lg:grid-cols-3">
            <Link
              href="/admin/news"
              className="rounded-[1.75rem] border border-slate-200 bg-white p-5 sm:p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <p className="text-lg font-bold text-slate-900">Manage News</p>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Publish press coverage, live ticker updates, homepage stories,
                and future news archive content.
              </p>
            </Link>

            <Link
              href="/admin/campaigns"
              className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <p className="text-lg font-bold text-slate-900">Manage Campaigns</p>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Control campaign cards, featured initiatives, donation links,
                and active/inactive public campaign visibility.
              </p>
            </Link>

            <Link
              href="/admin/settings"
              className="rounded-[1.75rem] border border-slate-200 bg-white p-5 sm:p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <p className="text-lg font-bold text-slate-900">Manage Settings</p>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Update WhatsApp, emergency lines, office numbers, email,
                Facebook, Twitter/X, and other public contact settings.
              </p>
            </Link>
          </section>
        </>
      )}
    </div>
  );
}