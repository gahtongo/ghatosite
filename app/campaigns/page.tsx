"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Eye,
  HeartHandshake,
  Lightbulb,
  Megaphone,
  ShieldCheck,
  Users,
  Loader2,
  X,
} from "lucide-react";

type CampaignItem = {
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

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignItem | null>(null);
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);

  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setIsLoading(true);

        const res = await fetch(`${API_BASE}/api/v1/campaigns/public`, {
          cache: "no-store",
        });

        if (!res.ok) {
          setCampaigns([]);
          return;
        }

        const data: CampaignItem[] = await res.json();
        setCampaigns(data);
      } catch {
        setCampaigns([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaigns();
  }, [API_BASE]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isDescriptionModalOpen) {
        closeDescriptionModal();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isDescriptionModalOpen]);

  const getCampaignIcon = (title: string, summary?: string | null) => {
    const text = `${title} ${summary || ""}`.toLowerCase();

    if (
      text.includes("rescue") ||
      text.includes("reintegration") ||
      text.includes("support") ||
      text.includes("survivor")
    ) {
      return HeartHandshake;
    }

    if (
      text.includes("awareness") ||
      text.includes("campaign") ||
      text.includes("migration")
    ) {
      return Megaphone;
    }

    if (
      text.includes("school") ||
      text.includes("campus") ||
      text.includes("education") ||
      text.includes("outreach")
    ) {
      return Lightbulb;
    }

    if (
      text.includes("community") ||
      text.includes("watch") ||
      text.includes("child") ||
      text.includes("labour")
    ) {
      return Users;
    }

    return ShieldCheck;
  };

  const normalizeImageUrl = (url?: string | null) => {
    if (!url) return null;

    const trimmed = url.trim();
    if (!trimmed) return null;

    // Handle Google Drive images
    if (trimmed.includes("drive.google.com")) {
      const fileIdMatch =
        trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/) ||
        trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);

      if (fileIdMatch?.[1]) {
        return `https://drive.google.com/uc?export=view&id=${fileIdMatch[1]}`;
      }
    }

    // Return direct image URLs as-is
    if (/\.(jpg|jpeg|png|gif|webp|svg)($|\?)/i.test(trimmed)) {
      return trimmed;
    }

    // Return other URLs (might be valid)
    return trimmed;
  };

  const featuredCampaign = useMemo(
    () => campaigns.find((item) => item.is_featured) || campaigns[0],
    [campaigns]
  );

  const supportingCampaigns = useMemo(() => {
    if (!featuredCampaign) return [];
    return campaigns.filter((item) => item.id !== featuredCampaign.id);
  }, [campaigns, featuredCampaign]);

  const openDescriptionModal = (campaign: CampaignItem) => {
    setSelectedCampaign(campaign);
    setIsDescriptionModalOpen(true);
  };

  const closeDescriptionModal = () => {
    setIsDescriptionModalOpen(false);
    setSelectedCampaign(null);
  };

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

  return (
    <main className="bg-white text-black overflow-x-hidden">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-black text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.18),transparent_28%),radial-gradient(circle_at_left_center,rgba(255,255,255,0.06),transparent_34%)]" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] sm:text-xs font-medium uppercase tracking-[0.18em] text-white/90 backdrop-blur-md">
            <Megaphone className="h-4 w-4 text-red-400" />
            Awareness. Prevention. Action.
          </div>

          <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
            Our Campaigns
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-gray-300 leading-relaxed">
            Driving awareness, prevention, survivor support, and rescue through
            focused initiatives designed for vulnerable communities and at-risk populations.
          </p>
        </div>
      </section>

      {/* FEATURED CAMPAIGN */}
      {featuredCampaign && (
        <section className="py-12 sm:py-14 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 items-stretch rounded-[2rem] border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="relative min-h-[280px] lg:min-h-full bg-gradient-to-br from-blue-950 via-blue-900 to-black">
                {(() => {
                  const featuredImageUrl = normalizeImageUrl(featuredCampaign?.image_url);
                  return featuredImageUrl ? (
                    <img
                      src={featuredImageUrl}
                      alt={featuredCampaign.title}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : null;
                })()}

                <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/30 to-black/60" />

                <div className="relative z-10 flex h-full flex-col justify-end p-6 sm:p-8">
                  <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-md">
                    <span className="h-2 w-2 rounded-full bg-red-400" />
                    Featured Campaign
                  </div>

                  <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    {featuredCampaign.title}
                  </h2>

                  {featuredCampaign.subtitle && (
                    <p className="mt-3 text-lg text-gray-200">
                      {featuredCampaign.subtitle}
                    </p>
                  )}
                </div>
              </div>

              <div className="p-6 sm:p-8 flex flex-col justify-center">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-900">
                  Active Initiative
                </p>

                <p className="mt-4 text-gray-600 leading-relaxed text-sm sm:text-base">
                  {truncateText(featuredCampaign.summary || featuredCampaign.description)}
                </p>

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => openDescriptionModal(featuredCampaign)}
                    className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100 transition"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View Description</span>
                  </button>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <Link
                    href={featuredCampaign.donation_link || "/donate"}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3.5 text-sm font-semibold text-white hover:bg-red-700 transition"
                  >
                    <HeartHandshake className="h-4 w-4" />
                    <span>Support Campaign</span>
                  </Link>

                  <Link
                    href={featuredCampaign.volunteer_link || "/contact"}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition"
                  >
                    <ArrowRight className="h-4 w-4" />
                    <span>Contribute an Idea</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CAMPAIGNS LIST */}
      <section className="py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="flex min-h-[220px] items-center justify-center rounded-3xl border border-slate-200 bg-white">
              <div className="flex items-center gap-3 text-gray-600">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Loading campaigns...</span>
              </div>
            </div>
          ) : supportingCampaigns.length > 0 ? (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
              {supportingCampaigns.map((campaign) => {
                const Icon = getCampaignIcon(
                  campaign.title,
                  campaign.summary || campaign.description
                );

                return (
                  <div
                    key={campaign.id}
                    className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-red-50 text-blue-900 group-hover:scale-105 transition">
                      <Icon className="h-5 w-5" />
                    </div>

                    <h3 className="mt-5 text-xl font-bold text-gray-900">
                      {campaign.title}
                    </h3>

                    <p className="mt-3 text-gray-600 text-sm sm:text-base leading-relaxed">
                      {truncateText(campaign.summary || campaign.description)}
                    </p>

                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => openDescriptionModal(campaign)}
                        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View Description</span>
                      </button>
                    </div>

                    <div className="mt-4 flex flex-col sm:flex-row gap-3">
                      <Link
                        href={campaign.donation_link || "/donate"}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700 transition"
                      >
                        <HeartHandshake className="h-4 w-4" />
                        <span>Support Campaign</span>
                      </Link>

                      <Link
                        href={campaign.volunteer_link || "/contact"}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition"
                      >
                        <ArrowRight className="h-4 w-4" />
                        <span>Contribute an Idea</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : campaigns.length === 1 && featuredCampaign ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <p className="text-gray-600">
                More campaigns will appear here as new initiatives are published.
              </p>
            </div>
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <p className="text-gray-600">
                No active campaigns are published yet.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* IDEA / SUPPORT STRIP */}
      <section className="bg-gray-50 py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-sm text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Want to support or shape a campaign?
          </h2>

          <p className="mt-4 max-w-2xl mx-auto text-gray-600 leading-relaxed text-sm sm:text-base">
            You can help fund an existing initiative or send in campaign ideas,
            partnership proposals, and community-driven concepts for future action.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/donate"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-900 px-6 py-3.5 font-semibold text-white hover:bg-blue-800 transition"
            >
              <HeartHandshake className="h-5 w-5" />
              <span>Go to Donate</span>
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-6 py-3.5 font-semibold text-gray-900 hover:bg-gray-50 transition"
            >
              <Lightbulb className="h-5 w-5" />
              <span>Send Us an Idea</span>
            </Link>
          </div>
        </div>
      </section>

      {/* DESCRIPTION MODAL */}
      {isDescriptionModalOpen && selectedCampaign && (
        <div 
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={closeDescriptionModal}
        >
          <div 
            className="relative max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-slate-200 bg-gradient-to-r from-blue-950 via-blue-900 to-slate-950 px-6 py-5 text-white sm:px-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100/90">
                    Campaign Details
                  </p>
                  <h3 className="mt-2 text-2xl font-bold tracking-tight">
                    {selectedCampaign.title}
                  </h3>
                  {selectedCampaign.subtitle && (
                    <p className="mt-1 text-sm text-blue-100/90">
                      {selectedCampaign.subtitle}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={closeDescriptionModal}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white transition hover:bg-white/15"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="max-h-[calc(90vh-120px)] overflow-y-auto px-6 py-6 sm:px-8">
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {selectedCampaign.description}
                </p>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  href={selectedCampaign.donation_link || "/donate"}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700 transition"
                >
                  <HeartHandshake className="h-4 w-4" />
                  <span>Support Campaign</span>
                </Link>

                <Link
                  href={selectedCampaign.volunteer_link || "/contact"}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition"
                >
                  <ArrowRight className="h-4 w-4" />
                  <span>Contribute an Idea</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}