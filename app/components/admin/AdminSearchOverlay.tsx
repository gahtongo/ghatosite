"use client";

import Link from "next/link";
import { Loader2, Search, X } from "lucide-react";

type SearchMessageItem = {
  id: number;
  name: string;
  email: string;
  message: string;
  status: string;
  created_at: string;
};

type SearchReportItem = {
  id: number;
  case_type: string;
  urgency: string;
  description: string;
  location?: string | null;
  reporter_name?: string | null;
  reporter_email?: string | null;
  status: string;
  created_at: string;
};

type SearchNewsItem = {
  id: number;
  title: string;
  headline?: string | null;
  excerpt?: string | null;
  status: string;
  created_at: string;
};

type SearchCampaignItem = {
  id: number;
  title: string;
  subtitle?: string | null;
  summary?: string | null;
  status: string;
  created_at: string;
};

export type AdminSearchResults = {
  messages: SearchMessageItem[];
  reports: SearchReportItem[];
  news: SearchNewsItem[];
  campaigns: SearchCampaignItem[];
};

type Props = {
  isOpen: boolean;
  query: string;
  onChangeQuery: (value: string) => void;
  onClose: () => void;
  isLoading: boolean;
  results: AdminSearchResults;
};

function ResultShell({
  title,
  subtitle,
  meta,
  href,
  onClose,
}: {
  title: string;
  subtitle: string;
  meta: string;
  href: string;
  onClose: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClose}
      className="block rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-blue-200 hover:bg-blue-50/40"
    >
      <p className="text-sm font-semibold text-slate-950">{title}</p>
      <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-600">
        {subtitle}
      </p>
      <p className="mt-2 text-xs uppercase tracking-[0.14em] text-slate-500">
        {meta}
      </p>
    </Link>
  );
}

export default function AdminSearchOverlay({
  isOpen,
  query,
  onChangeQuery,
  onClose,
  isLoading,
  results,
}: Props) {
  if (!isOpen) return null;

  const totalResults =
    results.messages.length +
    results.reports.length +
    results.news.length +
    results.campaigns.length;

  return (
    <div className="fixed inset-0 z-[70] bg-slate-950/45 backdrop-blur-sm">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl items-start justify-center px-4 py-8 sm:px-6 lg:py-14">
        <div className="w-full overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl">
          <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-900">
                <Search className="h-5 w-5" />
              </div>

              <div className="flex-1">
                <label htmlFor="admin-search-input" className="sr-only">
                  Search admin content
                </label>
                <input
                  id="admin-search-input"
                  autoFocus
                  value={query}
                  onChange={(e) => onChangeQuery(e.target.value)}
                  placeholder="Search messages, reports, news, campaigns..."
                  className="w-full bg-transparent text-base font-medium text-slate-950 outline-none placeholder:text-slate-400"
                />
                <p className="mt-1 text-sm text-slate-500">
                  Unified admin search
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="max-h-[75vh] overflow-y-auto px-5 py-5 sm:px-6">
            {!query.trim() ? (
              <div className="py-12 text-center">
                <p className="text-lg font-semibold text-slate-900">
                  Start typing to search the admin workspace
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Search across messages, reports, news, and campaigns.
                </p>
              </div>
            ) : isLoading ? (
              <div className="flex min-h-[220px] items-center justify-center">
                <div className="inline-flex items-center gap-3 text-slate-600">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Searching admin content...</span>
                </div>
              </div>
            ) : totalResults > 0 ? (
              <div className="space-y-8">
                {results.messages.length > 0 && (
                  <section>
                    <div className="mb-3 flex items-center justify-between gap-4">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-900">
                        Messages
                      </h3>
                      <Link
                        href="/admin/messages"
                        onClick={onClose}
                        className="text-xs font-semibold text-slate-500 hover:text-slate-900"
                      >
                        View all
                      </Link>
                    </div>
                    <div className="grid gap-3">
                      {results.messages.map((item) => (
                        <ResultShell
                          key={`message-${item.id}`}
                          title={`${item.name} • ${item.email}`}
                          subtitle={item.message}
                          meta={`Status: ${item.status}`}
                          href="/admin/messages"
                          onClose={onClose}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {results.reports.length > 0 && (
                  <section>
                    <div className="mb-3 flex items-center justify-between gap-4">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-900">
                        Reports
                      </h3>
                      <Link
                        href="/admin/reports"
                        onClick={onClose}
                        className="text-xs font-semibold text-slate-500 hover:text-slate-900"
                      >
                        View all
                      </Link>
                    </div>
                    <div className="grid gap-3">
                      {results.reports.map((item) => (
                        <ResultShell
                          key={`report-${item.id}`}
                          title={`${item.case_type} • ${item.urgency}`}
                          subtitle={item.description}
                          meta={`Status: ${item.status}${item.location ? ` • ${item.location}` : ""}`}
                          href="/admin/reports"
                          onClose={onClose}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {results.news.length > 0 && (
                  <section>
                    <div className="mb-3 flex items-center justify-between gap-4">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-900">
                        News
                      </h3>
                      <Link
                        href="/admin/news"
                        onClick={onClose}
                        className="text-xs font-semibold text-slate-500 hover:text-slate-900"
                      >
                        View all
                      </Link>
                    </div>
                    <div className="grid gap-3">
                      {results.news.map((item) => (
                        <ResultShell
                          key={`news-${item.id}`}
                          title={item.title}
                          subtitle={item.headline || item.excerpt || "News item"}
                          meta={`Status: ${item.status}`}
                          href="/admin/news"
                          onClose={onClose}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {results.campaigns.length > 0 && (
                  <section>
                    <div className="mb-3 flex items-center justify-between gap-4">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-900">
                        Campaigns
                      </h3>
                      <Link
                        href="/admin/campaigns"
                        onClick={onClose}
                        className="text-xs font-semibold text-slate-500 hover:text-slate-900"
                      >
                        View all
                      </Link>
                    </div>
                    <div className="grid gap-3">
                      {results.campaigns.map((item) => (
                        <ResultShell
                          key={`campaign-${item.id}`}
                          title={item.title}
                          subtitle={item.subtitle || item.summary || "Campaign item"}
                          meta={`Status: ${item.status}`}
                          href="/admin/campaigns"
                          onClose={onClose}
                        />
                      ))}
                    </div>
                  </section>
                )}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-lg font-semibold text-slate-900">
                  No results found
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Try a different keyword or a broader phrase.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}