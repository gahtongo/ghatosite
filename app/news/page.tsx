"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ExternalLink,
  Loader2,
  Newspaper,
  Megaphone,
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

export default function NewsPage() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);

        const res = await fetch(`${API_BASE}/api/v1/news/public?limit=50`, {
          cache: "no-store",
        });

        if (!res.ok) {
          setNewsItems([]);
          return;
        }

        const data: NewsItem[] = await res.json();
        setNewsItems(data);
      } catch {
        setNewsItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [API_BASE]);

  const formatDate = (value?: string | null) => {
    if (!value) return "Recently published";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Recently published";

    return new Intl.DateTimeFormat("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const normalizeGoogleDriveUrl = (trimmed: string, isVideo = false) => {
    const fileIdMatch =
      trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/) ||
      trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);

    if (!fileIdMatch?.[1]) return null;
    const exportType = isVideo ? "download" : "view";
    return `https://drive.google.com/uc?export=${exportType}&id=${fileIdMatch[1]}`;
  };

  const normalizeImageUrl = (url?: string | null) => {
    if (!url) return null;

    const trimmed = url.trim();
    if (!trimmed) return null;

    // Handle Google Drive images
    if (trimmed.includes("drive.google.com")) {
      const driveUrl = normalizeGoogleDriveUrl(trimmed, false);
      if (driveUrl) return driveUrl;
    }

    // Return direct image URLs as-is
    if (/\.(jpg|jpeg|png|gif|webp|svg)($|\?)/i.test(trimmed)) {
      return trimmed;
    }

    return trimmed;
  };

  const normalizeVideoUrl = (url?: string | null) => {
    if (!url) return null;

    const trimmed = url.trim();
    if (!trimmed) return null;

    // Handle Google Drive videos
    if (trimmed.includes("drive.google.com")) {
      const driveUrl = normalizeGoogleDriveUrl(trimmed, true);
      if (driveUrl) return driveUrl;
    }

    // Return direct video URLs as-is
    if (/\.(mp4|webm|mov|avi|mkv|flv|m3u8)($|\?)/i.test(trimmed)) {
      return trimmed;
    }

    return null;
  };

  const normalizeYouTubeEmbedUrl = (url?: string | null) => {
    if (!url) return null;

    const trimmed = url.trim();
    if (!trimmed) return null;

    // Extract video ID from various YouTube URL formats
    let videoId = null;

    // youtu.be/VIDEO_ID or youtu.be/VIDEO_ID?...
    let match = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/i);
    if (match?.[1]) {
      videoId = match[1];
    }

    // youtube.com/watch?v=VIDEO_ID
    if (!videoId) {
      match = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})/i);
      if (match?.[1]) {
        videoId = match[1];
      }
    }

    // youtube.com/embed/VIDEO_ID
    if (!videoId) {
      match = trimmed.match(/\/embed\/([a-zA-Z0-9_-]{11})/i);
      if (match?.[1]) {
        videoId = match[1];
      }
    }

    // youtube.com/v/VIDEO_ID
    if (!videoId) {
      match = trimmed.match(/\/v\/([a-zA-Z0-9_-]{11})/i);
      if (match?.[1]) {
        videoId = match[1];
      }
    }

    // youtube.com/shorts/VIDEO_ID
    if (!videoId) {
      match = trimmed.match(/\/shorts\/([a-zA-Z0-9_-]{11})/i);
      if (match?.[1]) {
        videoId = match[1];
      }
    }

    if (videoId) {
      return `https://www.youtube-nocookie.com/embed/${videoId}`;
    }

    return null;
  };



  const getCategoryLabel = (category: string) => {
    const normalized = category.toLowerCase();

    if (
      normalized.includes("breaking") ||
      normalized.includes("urgent") ||
      normalized.includes("emergency")
    ) {
      return {
        label: "Breaking",
        classes: "bg-red-50 text-red-600 border-red-200",
      };
    }

    if (normalized.includes("press")) {
      return {
        label: "Press Coverage",
        classes: "bg-violet-50 text-violet-700 border-violet-200",
      };
    }

    if (normalized.includes("rescue")) {
      return {
        label: "Rescue Update",
        classes: "bg-blue-50 text-blue-700 border-blue-200",
      };
    }

    if (normalized.includes("campaign")) {
      return {
        label: "Campaign",
        classes: "bg-amber-50 text-amber-700 border-amber-200",
      };
    }

    if (normalized.includes("awareness")) {
      return {
        label: "Awareness",
        classes: "bg-emerald-50 text-emerald-700 border-emerald-200",
      };
    }

    return {
      label: category || "Update",
      classes: "bg-slate-50 text-slate-700 border-slate-200",
    };
  };

  const featuredNews = useMemo(
    () => newsItems.find((item) => item.is_featured) || newsItems[0],
    [newsItems]
  );

  const otherNews = useMemo(() => {
    if (!featuredNews) return [];
    return newsItems.filter((item) => item.id !== featuredNews.id);
  }, [newsItems, featuredNews]);

  return (
    <main className="bg-white text-black overflow-x-hidden">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-black text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.16),transparent_26%),radial-gradient(circle_at_left_center,rgba(255,255,255,0.05),transparent_34%)]" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-24">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] sm:text-xs font-medium uppercase tracking-[0.18em] text-white/90 backdrop-blur-md">
            <Newspaper className="h-4 w-4 text-red-400" />
            Press. Rescue Updates. Advocacy.
          </div>

          <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
            News & Updates
          </h1>

          <p className="mt-5 max-w-2xl text-base sm:text-lg text-gray-300 leading-relaxed">
            Follow GAHTO’s latest press coverage, rescue updates, advocacy
            efforts, and campaign developments across the region.
          </p>
        </div>
      </section>

      {/* FEATURED */}
      <section className="py-12 sm:py-14 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="flex min-h-[260px] items-center justify-center rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="inline-flex items-center gap-3 text-gray-600">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Loading updates...</span>
              </div>
            </div>
          ) : featuredNews ? (
            <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 items-stretch rounded-[2rem] overflow-hidden border border-slate-200 bg-white shadow-sm">
              <div className="relative min-h-[280px] lg:min-h-full bg-gradient-to-br from-blue-950 via-blue-900 to-black">
                {(() => {
                  const featuredYouTubeUrl = normalizeYouTubeEmbedUrl(featuredNews?.video_url);
                  const featuredVideoUrl = normalizeVideoUrl(featuredNews?.video_url);
                  const featuredImageUrl = normalizeImageUrl(featuredNews?.featured_image_url);

                  return featuredYouTubeUrl ? (
                    <iframe
                      src={featuredYouTubeUrl}
                      title={featuredNews.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="absolute inset-0 h-full w-full"
                    />
                  ) : featuredVideoUrl ? (
                    <video
                      src={featuredVideoUrl}
                      controls
                      playsInline
                      muted
                      autoPlay
                      preload="metadata"
                      poster={featuredImageUrl || undefined}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : featuredImageUrl ? (
                    <img
                      src={featuredImageUrl}
                      alt={featuredNews.title}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : null;
                })()}

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black/45 via-black/20 to-black/60" />

                <div className="pointer-events-none relative z-10 flex h-full flex-col justify-between p-6 sm:p-8 pb-16">
                  <div>
                    <span
                    className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${
                      getCategoryLabel(featuredNews.category).classes
                    } bg-white/95`}
                  >
                    {getCategoryLabel(featuredNews.category).label}
                  </span>

                  <h2 className="mt-4 text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                    {featuredNews.title}
                  </h2>

                  <p className="mt-3 text-sm sm:text-base text-gray-200">
                    {formatDate(
                      featuredNews.published_at || featuredNews.created_at
                    )}
                  </p>
                </div>
              </div>
            </div>

              <div className="p-6 sm:p-8 flex flex-col justify-center">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-900">
                  Featured Update
                </p>

                {featuredNews.headline && (
                  <p className="mt-4 text-lg text-gray-800 leading-relaxed font-medium">
                    {featuredNews.headline}
                  </p>
                )}

                <p className="mt-4 text-gray-600 leading-relaxed text-sm sm:text-base">
                  {featuredNews.excerpt ||
                    featuredNews.content.slice(0, 260) + "..."}
                </p>

                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  {featuredNews.external_link ? (
                    <a
                      href={featuredNews.external_link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-900 px-5 py-3.5 font-semibold text-white hover:bg-blue-800 transition"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>Read coverage</span>
                    </a>
                  ) : (
                    <Link
                      href="#news-grid"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-900 px-5 py-3.5 font-semibold text-white hover:bg-blue-800 transition"
                    >
                      <span>Explore updates</span>
                    </Link>
                  )}

                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3.5 font-semibold text-gray-900 hover:bg-gray-50 transition"
                  >
                    <Megaphone className="h-4 w-4" />
                    <span>Contact GAHTO</span>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <p className="text-gray-600">
                No published news yet. Once updates are published from admin,
                they will appear here automatically.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* NEWS GRID */}
      <section id="news-grid" className="pb-16 sm:pb-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {otherNews.length > 0 ? (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
              {otherNews.map((item) => {
                const itemVideoUrl = normalizeVideoUrl(item.video_url);
                const itemYouTubeUrl = normalizeYouTubeEmbedUrl(item.video_url);
                const itemImageUrl = normalizeImageUrl(item.featured_image_url);

                return (
                  <article
                    key={item.id}
                    className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-xl transition duration-300"
                  >
                    <div className="relative h-52 bg-gradient-to-br from-slate-100 to-slate-200">
                      {itemYouTubeUrl ? (
                        <iframe
                          src={itemYouTubeUrl}
                          title={item.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          className="h-full w-full"
                        />
                      ) : itemVideoUrl ? (
                        <video
                          src={itemVideoUrl}
                          controls
                          playsInline
                          muted
                          preload="metadata"
                          poster={itemImageUrl || undefined}
                          className="h-full w-full object-cover"
                        />
                      ) : itemImageUrl ? (
                        <img
                          src={itemImageUrl}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-slate-500">
                          <Newspaper className="h-10 w-10" />
                        </div>
                      )}
                    </div>

                  <div className="p-5 sm:p-6">
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${
                          getCategoryLabel(item.category).classes
                        }`}
                      >
                        {getCategoryLabel(item.category).label}
                      </span>

                      <span className="text-xs text-gray-500">
                        {formatDate(item.published_at || item.created_at)}
                      </span>
                    </div>

                    <h3 className="mt-4 text-xl font-bold text-gray-900 leading-snug">
                      {item.title}
                    </h3>

                    <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">
                      {item.excerpt || item.headline || item.content.slice(0, 130) + "..."}
                    </p>

                    <div className="mt-6">
                      {item.external_link ? (
                        <a
                          href={item.external_link}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-900 hover:text-blue-700 transition"
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span>Read coverage</span>
                        </a>
                      ) : (
                        <span className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500">
                          <span>Internal update</span>
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
            </div>
          ) : !isLoading && featuredNews ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <p className="text-gray-600">
                More updates will appear here as additional news is published.
              </p>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}