"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ExternalLink, X } from "lucide-react";

type TickerNewsItem = {
  id: number;
  title: string;
  slug: string;
  headline?: string | null;
  category: string;
  featured_image_url?: string | null;
  video_url?: string | null;
  external_link?: string | null;
  ticker_order: number;
  published_at?: string | null;
};

type FullNewsItem = {
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

export default function GlobalNewsTicker() {
  const [ticker, setTicker] = useState<TickerNewsItem[]>([]);
  const [selectedNews, setSelectedNews] = useState<FullNewsItem | null>(null);
  const [isTickerPaused, setIsTickerPaused] = useState(false);
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [isLoadingNews, setIsLoadingNews] = useState(false);

  const API_BASE =
    (process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000").trim();

  const trackRef = useRef<HTMLDivElement | null>(null);
  const setARef = useRef<HTMLDivElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const offsetRef = useRef(0);
  const mobileTrackWrapperRef = useRef<HTMLDivElement | null>(null);
  const mobileAnimationFrameRef = useRef<number | null>(null);
  const mobileLastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const fetchTicker = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/v1/news/ticker`, {
          cache: "no-store",
        });

        if (!res.ok) {
          setTicker([]);
          return;
        }

        const data: TickerNewsItem[] = await res.json();
        setTicker(data);
      } catch {
        setTicker([]);
      }
    };

    fetchTicker();
  }, [API_BASE]);

  useEffect(() => {
    if (!isNewsModalOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeNewsModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isNewsModalOpen]);

  const tickerLoop = useMemo(() => {
    if (ticker.length === 0) return [];
    return [...ticker];
  }, [ticker]);

  useEffect(() => {
    const track = trackRef.current;
    const setA = setARef.current;

    if (!track || !setA || tickerLoop.length === 0) return;

    if (typeof window !== "undefined" && window.innerWidth < 768) {
      if (trackRef.current) {
        trackRef.current.style.transform = "translateX(0px)";
      }
      return;
    }

    const speed = 60;

    const step = (time: number) => {
      if (!trackRef.current || !setARef.current) return;

      if (lastTimeRef.current === null) {
        lastTimeRef.current = time;
      }

      const delta = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      if (!isTickerPaused) {
        offsetRef.current += speed * delta;
      }

      const singleSetWidth = setARef.current.scrollWidth;

      if (singleSetWidth > 0 && offsetRef.current >= singleSetWidth) {
        offsetRef.current = offsetRef.current - singleSetWidth;
      }

      trackRef.current.style.transform = `translateX(-${offsetRef.current}px)`;
      animationFrameRef.current = window.requestAnimationFrame(step);
    };

    animationFrameRef.current = window.requestAnimationFrame(step);

    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
      animationFrameRef.current = null;
      lastTimeRef.current = null;
    };
  }, [tickerLoop, isTickerPaused]);
  useEffect(() => {
    const track = mobileTrackWrapperRef.current;
    if (!track || tickerLoop.length === 0) return;

    const speed = 48;

    const step = (time: number) => {
      if (!track) return;

      if (mobileLastTimeRef.current === null) {
        mobileLastTimeRef.current = time;
      }

      const delta = (time - mobileLastTimeRef.current) / 1000;
      mobileLastTimeRef.current = time;

      if (!isTickerPaused) {
        track.scrollLeft += speed * delta;
      }

      const maxScroll = track.scrollWidth - track.clientWidth;
      if (maxScroll > 0 && track.scrollLeft >= maxScroll) {
        track.scrollLeft = 0;
      }

      mobileAnimationFrameRef.current = window.requestAnimationFrame(step);
    };

    mobileAnimationFrameRef.current = window.requestAnimationFrame(step);

    return () => {
      if (mobileAnimationFrameRef.current !== null) {
        window.cancelAnimationFrame(mobileAnimationFrameRef.current);
      }
      mobileAnimationFrameRef.current = null;
      mobileLastTimeRef.current = null;
    };
  }, [tickerLoop, isTickerPaused]);
  const getCategoryStyles = (category: string) => {
    const normalized = category.toLowerCase();

    if (
      normalized.includes("breaking") ||
      normalized.includes("emergency") ||
      normalized.includes("urgent")
    ) {
      return {
        chip: "bg-red-600/15 text-red-200 border-red-500/30",
        dot: "bg-red-400",
        text: "Breaking",
      };
    }

    if (normalized.includes("rescue")) {
      return {
        chip: "bg-blue-500/15 text-blue-100 border-blue-400/30",
        dot: "bg-blue-300",
        text: "Rescue Update",
      };
    }

    if (normalized.includes("campaign")) {
      return {
        chip: "bg-amber-400/15 text-amber-100 border-amber-300/30",
        dot: "bg-amber-300",
        text: "Campaign",
      };
    }

    if (normalized.includes("awareness")) {
      return {
        chip: "bg-emerald-500/15 text-emerald-100 border-emerald-400/30",
        dot: "bg-emerald-300",
        text: "Awareness",
      };
    }

    if (normalized.includes("press")) {
      return {
        chip: "bg-violet-500/15 text-violet-100 border-violet-400/30",
        dot: "bg-violet-300",
        text: "Press Coverage",
      };
    }

    return {
      chip: "bg-white/10 text-white border-white/15",
      dot: "bg-white/70",
      text: category || "Update",
    };
  };

  const formatDate = (value?: string | null) => {
    if (!value) return "Recently updated";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Recently updated";

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

    // Only support direct video sources here.
    return null;
  };

  const normalizeYouTubeEmbedUrl = (url?: string | null) => {
    if (!url) return null;

    const trimmed = url.trim();
    if (!trimmed) return null;

    let videoId = null;

    const patterns = [
      /youtu\.be\/([a-zA-Z0-9_-]{11})/i,
      /[?&]v=([a-zA-Z0-9_-]{11})/i,
      /\/embed\/([a-zA-Z0-9_-]{11})/i,
      /\/v\/([a-zA-Z0-9_-]{11})/i,
      /\/shorts\/([a-zA-Z0-9_-]{11})/i,
    ];

    for (const pattern of patterns) {
      const match = trimmed.match(pattern);
      if (match?.[1]) {
        videoId = match[1];
        break;
      }
    }

    return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : null;
  };

  const openNewsModal = async (slug: string) => {
    try {
      setIsLoadingNews(true);

      const res = await fetch(`${API_BASE}/api/v1/news/public/${slug}`, {
        cache: "no-store",
      });

      if (!res.ok) return;

      const data: FullNewsItem = await res.json();
      setSelectedNews(data);
      setIsNewsModalOpen(true);
    } catch {
      // silent fallback
    } finally {
      setIsLoadingNews(false);
    }
  };

  const closeNewsModal = () => {
    setIsNewsModalOpen(false);
    setSelectedNews(null);
  };

  const renderTickerSet = (
    items: TickerNewsItem[],
    keyPrefix: string,
    mode: "desktop" | "mobile" = "desktop"
  ) => {
    return items.map((item, index) => {
      const categoryStyles = getCategoryStyles(item.category);
      const normalized = item.category.toLowerCase();
      const isBreaking =
        normalized.includes("breaking") ||
        normalized.includes("urgent") ||
        normalized.includes("emergency");

      return (
        <button
          key={`${keyPrefix}-${item.id}-${index}`}
          type="button"
          onClick={() => openNewsModal(item.slug)}
          className={`group inline-flex shrink-0 items-center gap-3 rounded-full border text-left transition duration-300 ${
            mode === "mobile"
              ? "min-w-[260px] max-w-[86vw] px-3.5 py-3"
              : "px-3.5 py-2.5"
          } ${
            isBreaking
              ? "border-red-500/30 bg-red-500/8 hover:border-red-400/50 hover:bg-red-500/15"
              : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
          }`}
        >
          <span
            className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${categoryStyles.chip}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${categoryStyles.dot}`} />
            {categoryStyles.text}
          </span>

          <span
            className={`text-sm text-white/88 group-hover:text-white ${
              mode === "mobile"
                ? "line-clamp-2 max-w-[145px] whitespace-normal"
                : "max-w-[220px] truncate sm:max-w-[320px] md:max-w-[420px]"
            }`}
          >
            {item.headline || item.title}
          </span>

          {isBreaking && (
            <span className="rounded-full bg-red-600 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white">
              Alert
            </span>
          )}
        </button>
      );
    });
  };

  return (
    <>
      <section
        className="fixed bottom-0 left-0 right-0 z-[70] border-t border-cyan-500/10 bg-[#03070d] text-white shadow-[0_-8px_30px_rgba(0,0,0,0.35)]"
        onMouseEnter={() => setIsTickerPaused(true)}
        onMouseLeave={() => setIsTickerPaused(false)}
      >
        <div className="relative overflow-hidden">
          <div className="hidden md:block pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#03070d] to-transparent" />
          <div className="hidden md:block pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#03070d] to-transparent" />

          <div className="hidden md:flex items-center">
            <div className="shrink-0 border-r border-cyan-500/10 bg-[linear-gradient(135deg,rgba(0,173,239,0.12),rgba(0,0,0,0.05))] px-4 py-3 sm:px-6">
              <div className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-white">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_14px_rgba(34,211,238,0.85)]" />
                Live Updates
              </div>
            </div>

            <div className="relative min-w-0 flex-1 overflow-hidden">
              <div
                ref={trackRef}
                className="flex w-max items-center gap-4 px-4 py-3 sm:px-6"
                style={{ transform: "translateX(0px)", willChange: "transform" }}
              >
                <div ref={setARef} className="flex items-center gap-4 pr-4">
                  {tickerLoop.length > 0 ? (
                    renderTickerSet(tickerLoop, "set-a", "desktop")
                  ) : (
                    <div className="flex items-center gap-3 text-sm text-white/70">
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                        <span className="h-2 w-2 rounded-full bg-cyan-300" />
                        Updates
                      </span>
                      <span>Loading latest news and rescue updates...</span>
                    </div>
                  )}
                </div>

                {tickerLoop.length > 0 && (
                  <div className="flex items-center gap-4 pr-4">
                    {renderTickerSet(tickerLoop, "set-b", "desktop")}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="md:hidden px-3 py-3">
            <div className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-white">
              <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_14px_rgba(34,211,238,0.85)]" />
              Live Updates
            </div>

            <div ref={mobileTrackWrapperRef} className="-mx-3 overflow-x-auto px-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex w-max items-stretch gap-3 pb-1">
                {tickerLoop.length > 0 ? (
                  renderTickerSet(tickerLoop, "mobile", "mobile")
                ) : (
                  <div className="inline-flex min-w-[260px] items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                      <span className="h-2 w-2 rounded-full bg-cyan-300" />
                      Updates
                    </span>
                    <span>Loading latest news and rescue updates...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {isNewsModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">
          <div
            className="absolute inset-0"
            onClick={closeNewsModal}
            aria-hidden="true"
          />

          <div className="relative z-10 max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-200 bg-white/95 px-5 py-4 backdrop-blur">
              <div className="flex items-center gap-3">
                {selectedNews && (
                  <span
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${
                      getCategoryStyles(selectedNews.category).chip
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        getCategoryStyles(selectedNews.category).dot
                      }`}
                    />
                    {getCategoryStyles(selectedNews.category).text}
                  </span>
                )}

                {selectedNews?.is_featured && (
                  <span className="rounded-full bg-red-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-red-600">
                    Featured
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={closeNewsModal}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:bg-gray-100 hover:text-black"
                aria-label="Close news modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {isLoadingNews && !selectedNews ? (
              <div className="px-6 py-16 text-center">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-red-600" />
                <p className="mt-4 text-sm text-gray-500">Loading update...</p>
              </div>
            ) : selectedNews ? (
              <div>
                {(selectedNews.featured_image_url || selectedNews.video_url) && (
                  <div className="relative">
                    {(() => {
                      const selectedYouTubeUrl = normalizeYouTubeEmbedUrl(selectedNews.video_url);
                      const videoUrl = normalizeVideoUrl(selectedNews.video_url);
                      const imageUrl = normalizeImageUrl(selectedNews.featured_image_url);

                      return selectedYouTubeUrl ? (
                        <iframe
                          src={selectedYouTubeUrl}
                          title={selectedNews.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          className="h-[240px] w-full bg-black object-cover sm:h-[340px]"
                        />
                      ) : videoUrl ? (
                        <video
                          src={videoUrl}
                          controls
                          playsInline
                          className="h-[240px] w-full bg-black object-cover sm:h-[340px]"
                          poster={imageUrl || undefined}
                        />
                      ) : imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={selectedNews.title}
                          className="h-[240px] w-full object-cover sm:h-[340px]"
                        />
                      ) : null;
                    })()}
                  </div>
                )}

                <div className="px-5 py-6 sm:px-8 sm:py-8">
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-gray-500 sm:text-sm">
                    {formatDate(
                      selectedNews.published_at || selectedNews.created_at
                    )}
                  </p>

                  <h2 className="mt-3 text-2xl font-bold tracking-tight text-gray-950 sm:text-4xl">
                    {selectedNews.title}
                  </h2>

                  {selectedNews.headline && (
                    <p className="mt-4 text-lg leading-relaxed text-gray-700 sm:text-xl">
                      {selectedNews.headline}
                    </p>
                  )}

                  {selectedNews.excerpt && (
                    <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 leading-relaxed text-gray-700">
                      {selectedNews.excerpt}
                    </div>
                  )}

                  <div className="mt-6 whitespace-pre-line text-[15px] leading-8 text-gray-700 sm:text-base">
                    {selectedNews.content}
                  </div>

                  {selectedNews.external_link && (
                    <div className="mt-8">
                      <a
                        href={selectedNews.external_link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-900 px-5 py-3 font-semibold text-white transition hover:bg-blue-800"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Read More
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="px-6 py-16 text-center text-gray-500">
                Could not load this update.
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}