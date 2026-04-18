"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  HeartHandshake,
  ShieldAlert,
  X,
  Menu,
  Newspaper
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Get Help", href: "/help" },
    { name: "Campaigns", href: "/campaigns" },
    { name: "News", href: "/news" },
    { name: "Learn", href: "/trafficking" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) {
      document.body.style.overflow = "";
      return;
    }


    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEsc);
    };
  }, [mobileOpen]);

  return (
    <>
      <header className="sticky top-0 z-[80] border-b border-gray-200 bg-white/92 backdrop-blur-xl shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">

          <Link href="/" className="group flex flex-col sm:flex-row min-w-0 items-start sm:items-center gap-1 sm:gap-3">
            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-black/5 transition group-hover:shadow-red-500/20 sm:h-20 sm:w-20">
              <Image
                src="/logo.png"
                alt="GAHTO Logo"
                fill
                sizes="80px"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                priority
              />
            </div>

            <div className="min-w-0 leading-tight text-left">
              <p
                className="text-xl font-extrabold tracking-tight text-blue-800 transition hover:text-red-600 sm:text-[2rem]"
              >
                GAHTO
              </p>

              <p className="block text-[11px] leading-tight tracking-wide text-slate-500 sm:text-[15px] sm:font-medium whitespace-normal break-words max-w-[180px] sm:max-w-[220px] md:max-w-[240px] lg:max-w-[260px] text-left">
                <span className="sm:hidden">Global Anti Human Trafficking Org.</span>
                <span className="hidden sm:inline">
                  Global Anti Human<br />Trafficking Organization
                </span>
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">

            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="group relative text-[14px] font-bold tracking-wide px-1 transition-colors duration-200"
                >
                  <span
                    className={`transition-colors duration-200 ${
                      active
                        ? "text-blue-900 border-b-2 border-red-500 pb-0.5"
                        : "text-gray-700 hover:text-blue-700"
                    }`}
                  >
                    {item.name}
                  </span>
                </Link>
              );
            })}

          </nav>

          <div className="hidden shrink-0 items-center gap-2 sm:gap-3 md:flex">
            <Link
              href="/report"
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:scale-[1.03] hover:shadow-red-500/35 sm:px-4"
            >
              <ShieldAlert className="h-4 w-4" />
              <span>Report</span>
            </Link>

            <Link
              href="/donate"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-900 px-3.5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:scale-[1.03] sm:px-4"
            >
              <HeartHandshake className="h-4 w-4" />
              <span>Donate</span>
            </Link>
          </div>

          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-200 bg-white text-slate-900 shadow-md transition hover:border-red-200 hover:text-red-600 md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {mobileOpen && (
        <>
          <button
            type="button"
            aria-label="Close mobile menu overlay"
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-[85] bg-slate-950/55 backdrop-blur-[2px] md:hidden"
          />

          <div className="fixed inset-x-0 top-[76px] z-[90] mx-4 rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-2xl md:hidden">
            <div className="mb-4 rounded-2xl bg-gradient-to-r from-blue-900 to-slate-900 px-4 py-4 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                  <Newspaper className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold tracking-wide text-white/80">
                    Navigation
                  </p>
                  <p className="text-base font-bold">Explore GAHTO</p>
                </div>
              </div>
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => {
                const active = pathname === item.href;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                      active
                        ? "bg-blue-50 text-blue-900 ring-1 ring-blue-100"
                        : "text-slate-700 hover:bg-slate-50 hover:text-red-600"
                    }`}
                  >
                    <span>{item.name}</span>
                    {active && (
                      <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <Link
                href="/report"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-red-700"
              >
                <ShieldAlert className="h-4 w-4" />
                <span>Report</span>
              </Link>

              <Link
                href="/donate"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-900 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-800"
              >
                <HeartHandshake className="h-4 w-4" />
                <span>Donate</span>
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}