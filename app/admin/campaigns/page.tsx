"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuthApi } from "@/hooks/useAuthApi";
import {
  CalendarDays,
  CheckCircle2,
  Edit3,
  HeartHandshake,
  Loader2,
  Megaphone,
  Plus,
  Save,
  Sparkles,
  Star,
  StarOff,
  Trash2,
  Users,
  X,
  XCircle,
} from "lucide-react";

type Campaign = {
  id: number;
  title: string;
  slug: string;
  subtitle?: string | null;
  summary?: string | null;
  description: string;
  image_url?: string | null;
  donation_link?: string | null;
  volunteer_link?: string | null;
  status: string;
  display_order: number;
  is_featured: boolean;
  start_date?: string | null;
  end_date?: string | null;
  created_at: string;
  updated_at: string;
};

type CampaignFormState = {
  title: string;
  subtitle: string;
  summary: string;
  description: string;
  image_url: string;
  donation_link: string;
  volunteer_link: string;
  status: string;
  display_order: number;
  is_featured: boolean;
  start_date: string;
  end_date: string;
};

const initialForm: CampaignFormState = {
  title: "",
  subtitle: "",
  summary: "",
  description: "",
  image_url: "",
  donation_link: "",
  volunteer_link: "",
  status: "draft",
  display_order: 0,
  is_featured: false,
  start_date: "",
  end_date: "",
};

export default function AdminCampaignsPage() {
  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

  const authFetch = useAuthApi();

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [form, setForm] = useState<CampaignFormState>(initialForm);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [togglingFeaturedId, setTogglingFeaturedId] = useState<number | null>(
    null
  );

  const [statusText, setStatusText] = useState("");
  const [errorText, setErrorText] = useState("");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCampaignId, setEditingCampaignId] = useState<number | null>(
    null
  );
  const [editForm, setEditForm] = useState<CampaignFormState>(initialForm);
  const [isUpdatingCampaign, setIsUpdatingCampaign] = useState(false);

  const fetchCampaigns = async () => {
    try {
      setIsLoading(true);
      setErrorText("");

      const res = await authFetch(`${API_BASE}/api/v1/campaigns/admin/all`, {
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorText(data.detail || "Failed to load campaigns.");
        setCampaigns([]);
        return;
      }

      setCampaigns(Array.isArray(data) ? data : []);
    } catch {
      setErrorText("Unable to load campaigns right now.");
      setCampaigns([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [API_BASE]);

  const stats = useMemo(() => {
    return {
      total: campaigns.length,
      active: campaigns.filter((item) => item.status === "active").length,
      featured: campaigns.filter((item) => item.is_featured).length,
      draft: campaigns.filter((item) => item.status === "draft").length,
    };
  }, [campaigns]);

  const handleChange = (
    key: keyof CampaignFormState,
    value: string | boolean | number
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleEditChange = (
    key: keyof CampaignFormState,
    value: string | boolean | number
  ) => {
    setEditForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const formatDateTime = (value?: string | null) => {
    if (!value) return "Not set";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Not set";

    return new Intl.DateTimeFormat("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const toDateInputValue = (value?: string | null) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toISOString().slice(0, 10);
  };

  const normalizeOptional = (value: string) => {
    const trimmed = value.trim();
    return trimmed === "" ? null : trimmed;
  };

  const resetCreateForm = () => {
    setForm({
      ...initialForm,
      display_order: campaigns.length,
    });
  };

  const openEditModal = (campaign: Campaign) => {
    setEditingCampaignId(campaign.id);
    setEditForm({
      title: campaign.title || "",
      subtitle: campaign.subtitle || "",
      summary: campaign.summary || "",
      description: campaign.description || "",
      image_url: campaign.image_url || "",
      donation_link: campaign.donation_link || "",
      volunteer_link: campaign.volunteer_link || "",
      status: campaign.status || "draft",
      display_order: campaign.display_order ?? 0,
      is_featured: campaign.is_featured,
      start_date: toDateInputValue(campaign.start_date),
      end_date: toDateInputValue(campaign.end_date),
    });
    setIsEditModalOpen(true);
    setStatusText("");
    setErrorText("");
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingCampaignId(null);
    setEditForm(initialForm);
  };

  const handleCreateCampaign = async () => {
    setStatusText("");
    setErrorText("");

    if (!form.title.trim() || !form.description.trim()) {
      setErrorText("Title and description are required.");
      return;
    }

    try {
      setIsSaving(true);

      const payload = {
        title: form.title.trim(),
        subtitle: normalizeOptional(form.subtitle),
        summary: normalizeOptional(form.summary),
        description: form.description.trim(),
        image_url: normalizeOptional(form.image_url),
        donation_link: normalizeOptional(form.donation_link),
        volunteer_link: normalizeOptional(form.volunteer_link),
        status: form.status,
        display_order: Number(form.display_order) || 0,
        is_featured: form.is_featured,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
      };

      const res = await authFetch(`${API_BASE}/api/v1/campaigns/admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorText(data.detail || "Failed to create campaign.");
        return;
      }

      setStatusText("Campaign created successfully.");
      resetCreateForm();
      fetchCampaigns();
    } catch {
      setErrorText("Unable to create campaign right now.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateCampaign = async () => {
    if (!editingCampaignId) return;

    setStatusText("");
    setErrorText("");

    if (!editForm.title.trim() || !editForm.description.trim()) {
      setErrorText("Title and description are required.");
      return;
    }

    try {
      setIsUpdatingCampaign(true);

      const payload = {
        title: editForm.title.trim(),
        subtitle: normalizeOptional(editForm.subtitle),
        summary: normalizeOptional(editForm.summary),
        description: editForm.description.trim(),
        image_url: normalizeOptional(editForm.image_url),
        donation_link: normalizeOptional(editForm.donation_link),
        volunteer_link: normalizeOptional(editForm.volunteer_link),
        status: editForm.status,
        display_order: Number(editForm.display_order) || 0,
        is_featured: editForm.is_featured,
        start_date: editForm.start_date || null,
        end_date: editForm.end_date || null,
      };

      const res = await authFetch(
        `${API_BASE}/api/v1/campaigns/admin/${editingCampaignId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setErrorText(data.detail || "Failed to update campaign.");
        return;
      }

      setStatusText("Campaign updated successfully.");
      closeEditModal();
      fetchCampaigns();
    } catch {
      setErrorText("Unable to update campaign right now.");
    } finally {
      setIsUpdatingCampaign(false);
    }
  };

  const handleDeleteCampaign = async (campaignId: number) => {
    const confirmed = window.confirm(
      "Delete this campaign? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      setDeletingId(campaignId);
      setStatusText("");
      setErrorText("");

      const res = await authFetch(
        `${API_BASE}/api/v1/campaigns/admin/${campaignId}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setErrorText(data.detail || "Failed to delete campaign.");
        return;
      }

      setStatusText("Campaign deleted successfully.");
      fetchCampaigns();
    } catch {
      setErrorText("Unable to delete campaign right now.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleFeatured = async (campaign: Campaign) => {
    try {
      setTogglingFeaturedId(campaign.id);
      setStatusText("");
      setErrorText("");

      const res = await authFetch(
        `${API_BASE}/api/v1/campaigns/admin/${campaign.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            is_featured: !campaign.is_featured,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setErrorText(data.detail || "Failed to update featured status.");
        return;
      }

      setStatusText(
        campaign.is_featured
          ? "Campaign removed from featured spotlight."
          : "Campaign marked as featured."
      );
      fetchCampaigns();
    } catch {
      setErrorText("Unable to update featured status right now.");
    } finally {
      setTogglingFeaturedId(null);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-900">
                Campaign Management
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                Launch and manage public campaigns
              </h2>
              <p className="mt-4 max-w-3xl leading-relaxed text-slate-600">
                Create structured campaigns for awareness, survivor support,
                fundraising, volunteering, and community action. Keep featured
                initiatives visible and control what appears on the public
                campaigns page.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "Total", value: stats.total },
                { label: "Active", value: stats.active },
                { label: "Featured", value: stats.featured },
                { label: "Draft", value: stats.draft },
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
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-lg font-bold text-slate-900">
                Create Campaign
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Add a new campaign with support links, timeline, image, and
                publishing settings.
              </p>
            </div>

            <div className="hidden rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-violet-700 md:block">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Sparkles className="h-4 w-4" />
                <span>Premium campaign workflow</span>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-5">
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
                  placeholder="Campaign title"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={form.subtitle}
                  onChange={(e) => handleChange("subtitle", e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-900"
                  placeholder="Short supporting line"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Summary
              </label>
              <textarea
                rows={3}
                value={form.summary}
                onChange={(e) => handleChange("summary", e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-900"
                placeholder="Short public summary"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Description
              </label>
              <textarea
                rows={6}
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-900"
                placeholder="Full campaign description"
              />
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Image URL
                </label>
                <input
                  type="text"
                  value={form.image_url}
                  onChange={(e) => handleChange("image_url", e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-900"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Donation Link
                </label>
                <input
                  type="text"
                  value={form.donation_link}
                  onChange={(e) => handleChange("donation_link", e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-900"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Volunteer Link
                </label>
                <input
                  type="text"
                  value={form.volunteer_link}
                  onChange={(e) =>
                    handleChange("volunteer_link", e.target.value)
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-900"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-4">
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
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Display Order
                </label>
                <input
                  type="number"
                  value={form.display_order}
                  onChange={(e) =>
                    handleChange("display_order", Number(e.target.value))
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-900"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Start Date
                </label>
                <input
                  type="date"
                  value={form.start_date}
                  onChange={(e) => handleChange("start_date", e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  End Date
                </label>
                <input
                  type="date"
                  value={form.end_date}
                  onChange={(e) => handleChange("end_date", e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>
            </div>

            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) => handleChange("is_featured", e.target.checked)}
                className="h-4 w-4 rounded border-slate-300"
              />
              <span className="text-sm font-semibold text-slate-800">
                Mark as featured campaign
              </span>
            </label>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleCreateCampaign}
                disabled={isSaving}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-900 px-5 py-3.5 font-semibold text-white transition hover:bg-blue-800 disabled:opacity-70"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    <span>Create Campaign</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={resetCreateForm}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 px-5 py-3.5 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <XCircle className="h-4 w-4" />
                <span>Reset Form</span>
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-900">
              <Megaphone className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900">
                Campaign Directory
              </p>
              <p className="text-sm text-slate-500">
                Edit, feature, or remove existing campaigns
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="mt-6 flex min-h-[220px] items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
              <div className="inline-flex items-center gap-3 text-slate-600">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Loading campaigns...</span>
              </div>
            </div>
          ) : campaigns.length > 0 ? (
            <div className="mt-6 grid gap-4">
              {campaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="rounded-[1.5rem] border border-slate-200 bg-white p-5 transition hover:shadow-sm"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${
                            campaign.status === "active"
                              ? "bg-emerald-50 text-emerald-700"
                              : campaign.status === "archived"
                              ? "bg-slate-100 text-slate-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {campaign.status}
                        </span>

                        <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-700">
                          order {campaign.display_order}
                        </span>

                        {campaign.is_featured && (
                          <span className="rounded-full bg-red-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-red-600">
                            featured
                          </span>
                        )}
                      </div>

                      <h3 className="mt-4 text-xl font-bold text-slate-950">
                        {campaign.title}
                      </h3>

                      {campaign.subtitle && (
                        <p className="mt-2 text-sm font-medium text-slate-700">
                          {campaign.subtitle}
                        </p>
                      )}

                      <p className="mt-3 text-sm leading-relaxed text-slate-600">
                        {campaign.summary || campaign.description}
                      </p>

                      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        <div className="rounded-2xl bg-slate-50 p-4">
                          <div className="flex items-center gap-2 text-slate-500">
                            <CalendarDays className="h-4 w-4" />
                            <p className="text-xs font-semibold uppercase tracking-[0.14em]">
                              Start Date
                            </p>
                          </div>
                          <p className="mt-2 text-sm font-medium text-slate-800">
                            {formatDateTime(campaign.start_date)}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4">
                          <div className="flex items-center gap-2 text-slate-500">
                            <CalendarDays className="h-4 w-4" />
                            <p className="text-xs font-semibold uppercase tracking-[0.14em]">
                              End Date
                            </p>
                          </div>
                          <p className="mt-2 text-sm font-medium text-slate-800">
                            {formatDateTime(campaign.end_date)}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4">
                          <div className="flex items-center gap-2 text-slate-500">
                            <HeartHandshake className="h-4 w-4" />
                            <p className="text-xs font-semibold uppercase tracking-[0.14em]">
                              Donation Link
                            </p>
                          </div>
                          <p className="mt-2 truncate text-sm font-medium text-slate-800">
                            {campaign.donation_link || "Not set"}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4">
                          <div className="flex items-center gap-2 text-slate-500">
                            <Users className="h-4 w-4" />
                            <p className="text-xs font-semibold uppercase tracking-[0.14em]">
                              Volunteer Link
                            </p>
                          </div>
                          <p className="mt-2 truncate text-sm font-medium text-slate-800">
                            {campaign.volunteer_link || "Not set"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 lg:w-[320px] lg:justify-end">
                      <button
                        type="button"
                        onClick={() => openEditModal(campaign)}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        <Edit3 className="h-4 w-4" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        disabled={togglingFeaturedId === campaign.id}
                        onClick={() => handleToggleFeatured(campaign)}
                        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:opacity-70 ${
                          campaign.is_featured
                            ? "border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                            : "border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                        }`}
                      >
                        {togglingFeaturedId === campaign.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : campaign.is_featured ? (
                          <StarOff className="h-4 w-4" />
                        ) : (
                          <Star className="h-4 w-4" />
                        )}
                        <span>
                          {campaign.is_featured ? "Unfeature" : "Feature"}
                        </span>
                      </button>

                      <button
                        type="button"
                        disabled={deletingId === campaign.id}
                        onClick={() => handleDeleteCampaign(campaign.id)}
                        className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-70"
                      >
                        {deletingId === campaign.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-slate-600">
              No campaigns found yet. Create the first one above.
            </div>
          )}
        </section>
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
          <div className="relative max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl">
            <div className="border-b border-slate-200 bg-gradient-to-r from-blue-950 via-blue-900 to-slate-950 px-6 py-5 text-white sm:px-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100/90">
                    Premium Edit Modal
                  </p>
                  <h3 className="mt-2 text-2xl font-bold tracking-tight">
                    Edit Campaign
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm text-blue-100/90">
                    Refine the campaign details, update its public links,
                    control scheduling, and keep its presentation polished.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeEditModal}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white transition hover:bg-white/15"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="max-h-[calc(92vh-108px)] overflow-y-auto px-6 py-6 sm:px-8">
              <div className="grid gap-5">
                <div className="grid gap-5 lg:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Title
                    </label>
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) =>
                        handleEditChange("title", e.target.value)
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-900"
                      placeholder="Campaign title"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Subtitle
                    </label>
                    <input
                      type="text"
                      value={editForm.subtitle}
                      onChange={(e) =>
                        handleEditChange("subtitle", e.target.value)
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-900"
                      placeholder="Short supporting line"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Summary
                  </label>
                  <textarea
                    rows={3}
                    value={editForm.summary}
                    onChange={(e) =>
                      handleEditChange("summary", e.target.value)
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-900"
                    placeholder="Short public summary"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Description
                  </label>
                  <textarea
                    rows={6}
                    value={editForm.description}
                    onChange={(e) =>
                      handleEditChange("description", e.target.value)
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-900"
                    placeholder="Full campaign description"
                  />
                </div>

                <div className="grid gap-5 lg:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Image URL
                    </label>
                    <input
                      type="text"
                      value={editForm.image_url}
                      onChange={(e) =>
                        handleEditChange("image_url", e.target.value)
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-900"
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Donation Link
                    </label>
                    <input
                      type="text"
                      value={editForm.donation_link}
                      onChange={(e) =>
                        handleEditChange("donation_link", e.target.value)
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-900"
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Volunteer Link
                    </label>
                    <input
                      type="text"
                      value={editForm.volunteer_link}
                      onChange={(e) =>
                        handleEditChange("volunteer_link", e.target.value)
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-900"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="grid gap-5 lg:grid-cols-4">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Status
                    </label>
                    <select
                      value={editForm.status}
                      onChange={(e) =>
                        handleEditChange("status", e.target.value)
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-900"
                    >
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={editForm.display_order}
                      onChange={(e) =>
                        handleEditChange(
                          "display_order",
                          Number(e.target.value)
                        )
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-900"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={editForm.start_date}
                      onChange={(e) =>
                        handleEditChange("start_date", e.target.value)
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-900"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={editForm.end_date}
                      onChange={(e) =>
                        handleEditChange("end_date", e.target.value)
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-900"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={editForm.is_featured}
                    onChange={(e) =>
                      handleEditChange("is_featured", e.target.checked)
                    }
                    className="h-4 w-4 rounded border-slate-300"
                  />
                  <span className="text-sm font-semibold text-slate-800">
                    Keep this campaign featured
                  </span>
                </label>

                <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 px-5 py-3.5 font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    <X className="h-4 w-4" />
                    <span>Cancel</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleUpdateCampaign}
                    disabled={isUpdatingCampaign}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-900 px-5 py-3.5 font-semibold text-white transition hover:bg-blue-800 disabled:opacity-70"
                  >
                    {isUpdatingCampaign ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Saving Changes...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Save Campaign</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}