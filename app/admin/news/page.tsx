"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useAuthApi } from "../../../hooks/useAuthApi";
import {
  CheckCircle2,
  Loader2,
  Newspaper,
  Pencil,
  Plus,
  Sparkles,
  Trash2,
  XCircle,
} from "lucide-react";

type NewsItem = {
  id: number;
  title: string;
  slug: string;
  headline?: string | null;
  excerpt?: string | null;
  content: string;
  category: string;
  featured_image_url?: string | null;
  video_url?: string | null;
  external_link?: string | null;
  is_featured: boolean;
  show_in_ticker: boolean;
  ticker_order: number;
  status: string;
  published_at?: string | null;
  created_by_admin_id?: number | null;
  created_at: string;
  updated_at: string;
};

type NewsFormState = {
  title: string;
  headline: string;
  excerpt: string;
  content: string;
  category: string;
  featured_image_url: string;
  video_url: string;
  external_link: string;
  is_featured: boolean;
  show_in_ticker: boolean;
  ticker_order: number;
  status: string;
};

const initialForm: NewsFormState = {
  title: "",
  headline: "",
  excerpt: "",
  content: "",
  category: "press-coverage",
  featured_image_url: "",
  video_url: "",
  external_link: "",
  is_featured: false,
  show_in_ticker: false,
  ticker_order: 0,
  status: "draft",
};

export default function AdminNewsPage() {
  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

  const [items, setItems] = useState<NewsItem[]>([]);
  const [form, setForm] = useState<NewsFormState>(initialForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [errorText, setErrorText] = useState("");
  const [aiSuggestion, setAiSuggestion] = useState<null | {
    headline: string;
    excerpt: string;
    ticker: string;
  }>(null);

  const authFetch = useAuthApi();

  const fetchNews = async () => {
    try {
      setIsLoading(true);
      setErrorText("");

      const res = await authFetch(`${API_BASE}/api/v1/news/admin/all`, {
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorText(data.detail || "Failed to load news items.");
        return;
      }

      setItems(data);
    } catch {
      setErrorText("Unable to load news items right now.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [API_BASE]);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setAiSuggestion(null);
    setStatusText("");
    setErrorText("");
  };

  const handleChange = (
    key: keyof NewsFormState,
    value: string | boolean | number
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleEdit = (item: NewsItem) => {
    setEditingId(item.id);
    setAiSuggestion(null);
    setStatusText("");
    setErrorText("");

    setForm({
      title: item.title || "",
      headline: item.headline || "",
      excerpt: item.excerpt || "",
      content: item.content || "",
      category: item.category || "press-coverage",
      featured_image_url: item.featured_image_url || "",
      video_url: item.video_url || "",
      external_link: item.external_link || "",
      is_featured: item.is_featured,
      show_in_ticker: item.show_in_ticker,
      ticker_order: item.ticker_order || 0,
      status: item.status || "draft",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Delete this news item? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      const res = await authFetch(`${API_BASE}/api/v1/news/admin/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorText(data.detail || "Failed to delete news item.");
        return;
      }

      setStatusText("News item deleted successfully.");
      if (editingId === id) resetForm();
      fetchNews();
    } catch {
      setErrorText("Unable to delete news item right now.");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatusText("");
    setErrorText("");

    if (!form.title.trim() || !form.content.trim()) {
      setErrorText("Title and content are required.");
      return;
    }

    try {
      setIsSaving(true);

      const payload = {
        title: form.title,
        headline: form.headline || null,
        excerpt: form.excerpt || null,
        content: form.content,
        category: form.category,
        featured_image_url: form.featured_image_url || null,
        video_url: form.video_url || null,
        external_link: form.external_link || null,
        is_featured: form.is_featured,
        show_in_ticker: form.show_in_ticker,
        ticker_order: Number(form.ticker_order) || 0,
        status: form.status,
      };

      const url = editingId
        ? `${API_BASE}/api/v1/news/admin/${editingId}`
        : `${API_BASE}/api/v1/news/admin`;

      const method = editingId ? "PUT" : "POST";

      const res = await authFetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorText(data.detail || "Failed to save news item.");
        return;
      }

      setStatusText(
        editingId
          ? "News item updated successfully."
          : "News item created successfully."
      );
      resetForm();
      fetchNews();
    } catch {
      setErrorText("Unable to save news item right now.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleOptimizeWithAI = async () => {
    setStatusText("");
    setErrorText("");

    if (!form.title.trim() || !form.content.trim()) {
      setErrorText("Title and content are required for AI optimization.");
      return;
    }

    try {
      setStatusText("Optimizing with AI...");

      const res = await fetch(`${API_BASE}/api/v1/ai/optimize-content`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: form.title,
          headline: form.headline || null,
          excerpt: form.excerpt || null,
          content: form.content,
          category: form.category,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorText(data.detail || "AI optimization failed.");
        return;
      }

      setAiSuggestion({
        headline: data.headline,
        excerpt: data.excerpt,
        ticker: data.ticker,
      });

      setStatusText("AI optimization complete.");
    } catch (err) {
      setErrorText("Unable to connect to AI optimizer.");
    }
  };

  const stats = useMemo(() => {
    return {
      total: items.length,
      published: items.filter((item) => item.status === "published").length,
      featured: items.filter((item) => item.is_featured).length,
      ticker: items.filter((item) => item.show_in_ticker).length,
    };
  }, [items]);

  const normalizeMediaUrl = (url?: string | null) => {
    if (!url) return null;

    const trimmed = url.trim();

    if (!trimmed) return null;

    if (trimmed.includes("drive.google.com")) {
      const fileIdMatch =
        trimmed.match(/\/d\/([^/]+)/) ||
        trimmed.match(/[?&]id=([^&]+)/);

      if (fileIdMatch?.[1]) {
        return `https://drive.google.com/uc?export=download&id=${fileIdMatch[1]}`;
      }
    }

    return trimmed;
  };

  const previewImageUrl = normalizeMediaUrl(form.featured_image_url);
  const previewVideoUrl = normalizeMediaUrl(form.video_url);

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-900">
              News Management
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
              Publish press coverage and updates
            </h2>
            <p className="mt-4 max-w-3xl text-slate-600 leading-relaxed">
              Create homepage stories, media coverage, live ticker items, and
              breaking updates. This is also where AI-assisted presentation
              suggestions will later improve headlines and excerpts.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Total", value: stats.total },
              { label: "Published", value: stats.published },
              { label: "Featured", value: stats.featured },
              { label: "In Ticker", value: stats.ticker },
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

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-bold text-slate-900">
              {editingId ? "Edit News Item" : "Create News Item"}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Fill the content carefully, then choose whether it should be featured or shown in the ticker.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleOptimizeWithAI}
              className="inline-flex items-center gap-2 rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm font-semibold text-violet-700 transition hover:bg-violet-100"
            >
              <Sparkles className="h-4 w-4" />
              <span>Optimize with AI</span>
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <XCircle className="h-4 w-4" />
                <span>Cancel Edit</span>
              </button>
            )}
          </div>
        </div>

        {(statusText || errorText) && (
          <div className="mt-5 space-y-3">
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

        {aiSuggestion && (
          <div className="mt-5 rounded-[1.75rem] border border-violet-200 bg-violet-50 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-violet-700">
              AI Suggestion Preview
            </p>

            <div className="mt-4 grid gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Suggested headline
                </p>
                <p className="mt-2 text-slate-900 font-medium">
                  {aiSuggestion.headline}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Suggested excerpt
                </p>
                <p className="mt-2 text-slate-700">{aiSuggestion.excerpt}</p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Suggested ticker headline
                </p>
                <p className="mt-2 text-slate-700">{aiSuggestion.ticker}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      headline: aiSuggestion.headline,
                      excerpt: aiSuggestion.excerpt,
                    }))
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-800 transition"
                >
                  <Plus className="h-4 w-4" />
                  <span>Apply suggestion</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAiSuggestion(null)}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-white transition"
                >
                  <span>Dismiss</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 grid gap-5">
          <div className="grid gap-5 lg:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Title
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-900"
                placeholder="Enter full story title"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Headline
              </label>
              <input
                type="text"
                value={form.headline}
                onChange={(e) => handleChange("headline", e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-900"
                placeholder="Short headline for cards or press display"
              />
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => handleChange("category", e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-900"
              >
                <option value="press-coverage">Press Coverage</option>
                <option value="rescue-update">Rescue Update</option>
                <option value="breaking">Breaking</option>
                <option value="campaign">Campaign</option>
                <option value="awareness">Awareness</option>
                <option value="general">General</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => handleChange("status", e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-900"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Excerpt
            </label>
            <textarea
              rows={3}
              value={form.excerpt}
              onChange={(e) => handleChange("excerpt", e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-900"
              placeholder="Short summary for homepage cards and previews"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Content
            </label>
            <textarea
              rows={8}
              value={form.content}
              onChange={(e) => handleChange("content", e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-900"
              placeholder="Write the full story or press update"
            />
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Featured Image URL
              </label>
              <p className="mb-2 text-xs text-slate-500">
                Use a direct image link or a Google Drive file link.
              </p>
              <input
                type="text"
                value={form.featured_image_url}
                onChange={(e) => handleChange("featured_image_url", e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-900"
                placeholder="https://..."
              />
              {previewImageUrl && (
                <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                  <img
                    src={previewImageUrl}
                    alt="Featured preview"
                    className="h-40 w-full object-cover"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Video URL
              </label>
              <p className="mb-2 text-xs text-slate-500">
                Use a direct video link or a Google Drive file link that points to the actual file.
              </p>
              <input
                type="text"
                value={form.video_url}
                onChange={(e) => handleChange("video_url", e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-900"
                placeholder="https://..."
              />
              {previewVideoUrl && (
                <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                  <video
                    src={previewVideoUrl}
                    controls
                    playsInline
                    preload="metadata"
                    className="h-40 w-full object-cover"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                External Link
              </label>
              <input
                type="text"
                value={form.external_link}
                onChange={(e) => handleChange("external_link", e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-900"
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Ticker Order
              </label>
              <input
                type="number"
                value={form.ticker_order}
                onChange={(e) =>
                  handleChange("ticker_order", Number(e.target.value))
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-900"
                placeholder="0"
              />
            </div>

            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) => handleChange("is_featured", e.target.checked)}
                className="h-4 w-4 rounded border-slate-300"
              />
              <span className="text-sm font-semibold text-slate-800">
                Mark as featured
              </span>
            </label>

            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <input
                type="checkbox"
                checked={form.show_in_ticker}
                onChange={(e) =>
                  handleChange("show_in_ticker", e.target.checked)
                }
                className="h-4 w-4 rounded border-slate-300"
              />
              <span className="text-sm font-semibold text-slate-800">
                Show in live ticker
              </span>
            </label>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-900 px-5 py-3.5 font-semibold text-white transition hover:bg-blue-800 disabled:opacity-70"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : editingId ? (
                <>
                  <Pencil className="h-4 w-4" />
                  <span>Update News Item</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  <span>Create News Item</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 px-5 py-3.5 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <XCircle className="h-4 w-4" />
              <span>Reset Form</span>
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-900">
            <Newspaper className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900">Published and Draft Items</p>
            <p className="text-sm text-slate-500">
              Edit, review, or remove existing news content
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="mt-6 flex min-h-[180px] items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
            <div className="inline-flex items-center gap-3 text-slate-600">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading news list...</span>
            </div>
          </div>
        ) : items.length > 0 ? (
          <div className="mt-6 grid gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="rounded-[1.5rem] border border-slate-200 bg-white p-5 transition hover:shadow-sm"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-700">
                        {item.category}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${
                          item.status === "published"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {item.status}
                      </span>

                      {item.is_featured && (
                        <span className="rounded-full bg-red-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-red-600">
                          featured
                        </span>
                      )}

                      {item.show_in_ticker && (
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-700">
                          ticker
                        </span>
                      )}
                    </div>

                    <h3 className="mt-4 text-xl font-bold text-slate-950">
                      {item.title}
                    </h3>

                    {item.headline && (
                      <p className="mt-2 text-sm font-medium text-slate-700">
                        {item.headline}
                      </p>
                    )}

                    <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                      {item.excerpt || item.content.slice(0, 180) + "..."}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3 lg:justify-end">
                    <button
                      type="button"
                      onClick={() => handleEdit(item)}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      <Pencil className="h-4 w-4" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-slate-600">
            No news items found yet. Create the first one above.
          </div>
        )}
      </section>
    </div>
  );
}