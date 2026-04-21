"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  MessageCircleHeart,
  PhoneCall,
  ShieldAlert,
  Siren,
  HeartHandshake,
  LifeBuoy,
  ExternalLink,
  Loader2,
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

export default function Home() {
  const images = [
    "/images/hero1.jpg",
    "/images/hero2.jpg",
    "/images/hero3.jpg",
  ];

  const [current, setCurrent] = useState(0);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState(true);

  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoadingNews(true);

        const res = await fetch(`${API_BASE}/api/v1/news/public?limit=5`, {
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
        setIsLoadingNews(false);
      }
    };

    fetchNews();
  }, [API_BASE]);

  const quickActions = [
    {
      label: "Report",
      href: "/report",
      icon: ShieldAlert,
    },
    {
      label: "Help",
      href: "/help",
      icon: LifeBuoy,
    },
    {
      label: "Hotline",
      href: "/contact",
      icon: PhoneCall,
    },
    {
      label: "Chat",
      href: "/help",
      icon: MessageCircleHeart,
    },
  ];

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

  const pressCoverage = useMemo(() => {
    // Only use the 5 most recent news items
    const limitedNews = newsItems.slice(0, 5);
    const preferred = limitedNews.filter((item) => {
      const category = item.category.toLowerCase();
      return (
        category.includes("press") ||
        category.includes("rescue") ||
        category.includes("breaking") ||
        Boolean(item.external_link)
      );
    });

    return preferred.length > 0 ? preferred : limitedNews;
  }, [newsItems]);

  const featuredPress = useMemo(() => {
    return pressCoverage.find((item) => item.is_featured) || pressCoverage[0];
  }, [pressCoverage]);

  const secondaryPress = useMemo(() => {
    if (!featuredPress) return [];
    return pressCoverage
      .filter((item) => item.id !== featuredPress.id)
      .slice(0, 4);
  }, [pressCoverage, featuredPress]);

  return (
    <main className="bg-white text-black overflow-x-hidden">
      {/* 🔴 HERO */}
      <section className="relative min-h-[86vh] md:min-h-[92vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="hidden md:block">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`Hero slide ${i + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                  i === current ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
          </div>

          <div className="block md:hidden">
            <img
              src="/images/hero1.jpg"
              alt="Human trafficking awareness"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.18),transparent_30%),radial-gradient(circle_at_left_center,rgba(30,64,175,0.22),transparent_35%)]" />
          <div className="absolute inset-0 bg-gradient-to-r md:from-black/85 md:via-black/65 md:to-black/25 from-black/90 via-black/80 to-black/65" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 w-full px-4 sm:px-6 md:px-12 lg:px-16 py-16">
          <div className="max-w-6xl">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] sm:text-xs font-medium uppercase tracking-[0.18em] text-white/90 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
                <span className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.9)]" />
                Safe. Confidential. Actionable.
              </div>

              <h1 className="mt-6 text-4xl sm:text-5xl md:text-7xl font-extrabold leading-[1.02] tracking-tight text-white">
                Stand Against
                <br />
                <span className="text-white">Human Trafficking.</span>
                <br />
                <span className="bg-gradient-to-r from-red-500 via-red-400 to-orange-300 bg-clip-text text-transparent drop-shadow-[0_0_16px_rgba(239,68,68,0.35)]">
                  Report. Protect. Restore.
                </span>
              </h1>

              <p className="mt-6 text-base sm:text-lg md:text-xl text-gray-200/95 max-w-2xl leading-relaxed">
                GAHTO provides a secure platform for reporting cases,
                accessing urgent support, and strengthening the collective
                response against human trafficking through awareness,
                advocacy, and survivor-centered action.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {[
                  "Anonymous reporting",
                  "Emergency response support",
                  "Community awareness",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/90 backdrop-blur-md"
                  >
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-10 flex flex-col sm:flex-row sm:flex-wrap gap-4">
                <Link
                  href="/report"
                  className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-7 py-3.5 rounded-xl shadow-lg hover:shadow-red-500/40 hover:scale-[1.03] active:scale-95 transition duration-300 font-semibold w-full sm:w-auto text-center"
                >
                  <ShieldAlert className="h-5 w-5" />
                  <span>Report a Case</span>
                </Link>

                <Link
                  href="/help"
                  className="inline-flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-800 text-white px-7 py-3.5 rounded-xl shadow-lg hover:shadow-blue-500/40 hover:scale-[1.03] active:scale-95 transition duration-300 font-semibold w-full sm:w-auto text-center"
                >
                  <Siren className="h-5 w-5" />
                  <span>Get Help</span>
                </Link>

                <Link
                  href="/donate"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-white/30 text-white backdrop-blur-md bg-white/10 hover:bg-white hover:text-black hover:scale-[1.03] active:scale-95 transition duration-300 font-semibold w-full sm:w-auto text-center"
                >
                  <HeartHandshake className="h-5 w-5" />
                  <span>Support the Mission</span>
                </Link>
              </div>
            </div>

            <div className="mt-10 md:mt-14 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-5 max-w-5xl">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    value: "24/7",
                    label: "Safe reporting access",
                  },
                  {
                    value: "Fast",
                    label: "Connection to help pathways",
                  },
                  {
                    value: "Trusted",
                    label: "Survivor-focused response",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.25)]"
                  >
                    <p className="text-2xl sm:text-3xl font-bold text-white">
                      {item.value}
                    </p>
                    <p className="mt-2 text-sm text-gray-200 leading-relaxed">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-5 sm:p-6 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.25)]">
                <p className="text-xs uppercase tracking-[0.22em] text-red-300 font-semibold">
                  Need immediate support?
                </p>
                <h3 className="mt-3 text-xl sm:text-2xl font-bold text-white">
                  You are not alone.
                </h3>
                <p className="mt-3 text-sm sm:text-base text-gray-200 leading-relaxed">
                  If you or someone you know is at risk, use our reporting and
                  help channels immediately. Every report can lead to protection,
                  intervention, and hope.
                </p>

                <div className="mt-5 flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 w-full sm:w-auto rounded-xl bg-white text-black px-5 py-3 font-semibold hover:bg-gray-100 transition text-center"
                  >
                    <PhoneCall className="h-4 w-4" />
                    <span>Contact Support</span>
                  </Link>
                  <Link
                    href="/about"
                    className="w-full sm:w-auto rounded-xl border border-white/25 text-white px-5 py-3 font-semibold hover:bg-white/10 transition text-center"
                  >
                    Learn About Trafficking
                  </Link>
                </div>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2 mt-8">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => setCurrent(i)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    i === current
                      ? "w-10 bg-red-500"
                      : "w-2.5 bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ⚡ QUICK ACTION */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 sm:px-6 py-10 bg-gray-50 text-center">
        {quickActions.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className="group p-5 bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col items-center justify-center gap-3 font-medium"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-red-50 text-blue-900 group-hover:scale-110 transition">
                <Icon className="h-5 w-5" />
              </div>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </section>

      {/* 📊 IMPACT */}
      <section className="py-16 px-4 sm:px-6 text-center">
        <h2 className="text-2xl font-bold mb-10">Our Impact</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="group">
            <h3 className="text-3xl sm:text-4xl font-bold text-red-600 transition duration-300 group-hover:scale-110 group-hover:text-red-500 group-hover:drop-shadow-[0_0_10px_rgba(239,68,68,0.6)]">
              120+
            </h3>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Cases Reported
            </p>
          </div>

          <div className="group">
            <h3 className="text-3xl sm:text-4xl font-bold text-blue-900 transition duration-300 group-hover:scale-110 group-hover:text-blue-800 group-hover:drop-shadow-[0_0_10px_rgba(37,99,235,0.35)]">
              80+
            </h3>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Victims Supported
            </p>
          </div>

          <div className="group">
            <h3 className="text-3xl sm:text-4xl font-bold transition duration-300 group-hover:scale-110">
              25+
            </h3>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Communities Reached
            </p>
          </div>

          <div className="group">
            <h3 className="text-3xl sm:text-4xl font-bold transition duration-300 group-hover:scale-110">
              50+
            </h3>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Volunteers
            </p>
          </div>
        </div>
      </section>

      {/* 📰 PRESS COVERAGE */}
      <section className="bg-gray-50 py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-red-600">
              In the News
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-gray-950">
              Press coverage and documented impact
            </h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Explore media coverage, rescue updates, public advocacy, and
              documented reporting around GAHTO’s work across vulnerable communities.
            </p>
          </div>

          <div className="mt-10">
            {isLoadingNews ? (
              <div className="flex min-h-[260px] items-center justify-center rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="inline-flex items-center gap-3 text-gray-600">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Loading press coverage...</span>
                </div>
              </div>
            ) : featuredPress ? (
              <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-6 sm:gap-8">
                <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
                  <div className="relative min-h-[260px] sm:min-h-[340px] bg-gradient-to-br from-blue-950 via-blue-900 to-black">
                    {featuredPress.featured_image_url ? (
                      <img
                        src={featuredPress.featured_image_url}
                        alt={featuredPress.title}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : null}

                    <div className="absolute inset-0 bg-gradient-to-br from-black/45 via-black/20 to-black/60" />

                    <div className="relative z-10 flex h-full flex-col justify-end p-6 sm:p-8">
                      <span
                        className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${
                          getCategoryLabel(featuredPress.category).classes
                        } bg-white/95`}
                      >
                        {getCategoryLabel(featuredPress.category).label}
                      </span>

                      <h3 className="mt-4 text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                        {featuredPress.title}
                      </h3>

                      <p className="mt-3 text-sm sm:text-base text-gray-200">
                        {formatDate(
                          featuredPress.published_at || featuredPress.created_at
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8">
                    <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                      {featuredPress.excerpt ||
                        featuredPress.headline ||
                        featuredPress.content.slice(0, 180) + "..."}
                    </p>

                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                      <Link
                        href={`/news`}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 font-semibold text-gray-900 hover:bg-gray-50 transition"
                      >
                        <span>View all updates</span>
                      </Link>

                      {featuredPress.external_link ? (
                        <a
                          href={featuredPress.external_link}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-900 px-5 py-3 font-semibold text-white hover:bg-blue-800 transition"
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span>Read coverage</span>
                        </a>
                      ) : (
                        <Link
                          href={`/news`}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-900 px-5 py-3 font-semibold text-white hover:bg-blue-800 transition"
                        >
                          <span>Read update</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid gap-5">
                  {secondaryPress.length > 0 ? (
                    secondaryPress.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-lg transition duration-300"
                      >
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

                        <h3 className="mt-4 text-lg sm:text-xl font-bold text-gray-900">
                          {item.title}
                        </h3>

                        <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">
                          {item.excerpt ||
                            item.headline ||
                            item.content.slice(0, 120) + "..."}
                        </p>

                        <div className="mt-5">
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
                            <Link
                              href="/news"
                              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-900 hover:text-blue-700 transition"
                            >
                              <span>Read update</span>
                            </Link>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                      <p className="text-gray-600">
                        More press stories and coverage will appear here as updates are published.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                <p className="text-gray-600">
                  No published press coverage yet. Once media updates are added from admin,
                  they will appear here automatically.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 🧠 HOW IT WORKS */}
      <section className="bg-white py-16 px-4 sm:px-6 text-center">
        <h2 className="text-2xl font-bold mb-10">How It Works</h2>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {[
            { title: "1. Report", desc: "Submit a case safely" },
            { title: "2. Review", desc: "We assess the situation" },
            { title: "3. Respond", desc: "Action is taken" },
          ].map((item, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl bg-white border border-gray-100 shadow-md hover:shadow-xl hover:shadow-blue-500/10 transition duration-300 hover:-translate-y-2 relative overflow-hidden text-left"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 bg-gradient-to-br from-blue-500/10 to-red-500/10" />

              <h3 className="font-semibold text-lg relative z-10">
                {item.title}
              </h3>

              <p className="text-gray-600 mt-2 relative z-10">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 🆘 HELP */}
      <section className="py-16 px-4 sm:px-6 text-center">
        <h2 className="text-2xl font-bold mb-4">
          If You Are in Danger, Help is Available
        </h2>

        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Reach out immediately or talk to our assistant anonymously.
        </p>

        <div className="flex justify-center gap-4 flex-col sm:flex-row flex-wrap">
          <Link
            href="/help"
            className="inline-flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-800 hover:scale-105 active:scale-95 text-white px-6 py-3 rounded-lg shadow-lg transition duration-200 w-full sm:w-auto text-center"
          >
            <Siren className="h-4 w-4" />
            <span>Get Help Now</span>
          </Link>

          <Link
            href="/help"
            className="inline-flex items-center justify-center gap-2 border border-gray-300 hover:bg-black hover:text-white hover:scale-105 active:scale-95 px-6 py-3 rounded-lg transition duration-200 w-full sm:w-auto text-center"
          >
            <MessageCircleHeart className="h-4 w-4" />
            <span>Chat Assistant</span>
          </Link>
        </div>
      </section>

      {/* 💳 DONATE */}
      <section className="bg-gray-50 py-16 px-4 sm:px-6 text-center">
        <h2 className="text-2xl font-bold mb-4">
          Support the Fight Against Human Trafficking
        </h2>

        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Your contribution helps rescue victims and raise awareness.
        </p>

        <Link
          href="/donate"
          className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 hover:scale-105 active:scale-95 text-white px-8 py-3 rounded-lg shadow-lg transition duration-200 w-full sm:w-auto text-center"
        >
          <HeartHandshake className="h-4 w-4" />
          <span>Donate Now</span>
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="bg-black text-white py-10 text-center px-4">
        <p className="text-sm sm:text-base">
          © GAHTO - Global Anti Human Trafficking Organization
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm text-white/80">
          <Link href="/about" className="hover:text-white transition">
            About
          </Link>
          <Link href="/campaigns" className="hover:text-white transition">
            Campaigns
          </Link>
          <Link href="/trafficking" className="hover:text-white transition">
            Trafficking
          </Link>
          <Link href="/help" className="hover:text-white transition">
            Get Help
          </Link>
          <Link href="/contact" className="hover:text-white transition">
            Contact
          </Link>
          <Link href="/donate" className="hover:text-white transition">
            Donate
          </Link>
        </div>
      </footer>
    </main>
  );
}