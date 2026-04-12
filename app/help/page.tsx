"use client";

import Link from "next/link";
import { useState } from "react";
import AIChat from "../components/AIChat";
import ContactOptionsModal from "../components/ContactOptionsModal";
import {
  MessageCircleHeart,
  ShieldAlert,
  ArrowRight,
  LocateFixed,
  TriangleAlert,
  HeartHandshake,
  PhoneCall,
  Globe,
} from "lucide-react";

export default function HelpPage() {
  const [contactModalOpen, setContactModalOpen] = useState(false);

  const buildWhatsAppLink = (message: string) => {
    const whatsappNumber = "22371402809";
    const sanitized = whatsappNumber.replace(/[^\d]/g, "");
    return `https://wa.me/${sanitized}?text=${encodeURIComponent(message)}`;
  };

  const handleEscape = () => {
    window.location.replace("https://www.google.com");
  };

  const safetySteps = [
    {
      title: "Move to a safer place",
      desc: "If possible, create distance from the person or location that feels unsafe.",
      icon: LocateFixed,
    },
    {
      title: "Avoid confrontation",
      desc: "Do not escalate the situation if it may increase your risk.",
      icon: TriangleAlert,
    },
    {
      title: "Reach out for support",
      desc: "Use call, WhatsApp, or other safe channels to contact us for help immediately.",
      icon: PhoneCall,
    },
    {
      title: "Share your location",
      desc: "If safe, send your live location or nearest landmark to us.",
      icon: ArrowRight,
    },
    {
      title: "Report anonymously",
      desc: "You can submit a report without revealing your identity.",
      icon: ShieldAlert,
    },
  ];

  return (
    <main className="bg-white text-black min-h-screen relative overflow-x-hidden">
      <ContactOptionsModal
        open={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
      />

      <button
        onClick={handleEscape}
        className="fixed top-20 sm:top-24 right-4 z-50 rounded-xl bg-black text-white px-4 py-2.5 text-sm font-medium shadow-lg hover:bg-gray-800 transition"
      >
        Quick Exit
      </button>

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-black text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.22),transparent_28%),radial-gradient(circle_at_left_center,rgba(59,130,246,0.16),transparent_34%)]" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] sm:text-xs font-medium uppercase tracking-[0.18em] text-white/90 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
              Immediate support available
            </div>

            <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.02] tracking-tight">
              You Are Not Alone.
              <br />
              <span className="bg-gradient-to-r from-red-400 via-red-500 to-orange-300 bg-clip-text text-transparent">
                Help is available now.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed">
              If you feel unsafe, threatened, or believe trafficking may be
              happening, take the safest possible step now. GAHTO provides
              support, guidance, and confidential ways to seek help.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row flex-wrap gap-4">
              <button
                onClick={() => setContactModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3.5 text-white font-semibold shadow-lg shadow-red-500/20 transition hover:bg-red-700 hover:shadow-red-500/35 hover:-translate-y-0.5"
              >
                <PhoneCall className="h-5 w-5" />
                <span>Call Options</span>
              </button>

              <a
                href={buildWhatsAppLink("Thank you for contacting, Global Anti Human Trafficking Organization. How can we be of help to you ?")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-6 py-3.5 text-white font-semibold shadow-lg shadow-green-500/20 transition hover:bg-green-600 hover:-translate-y-0.5"
              >
                <MessageCircleHeart className="h-5 w-5" />
                <span>WhatsApp</span>
              </a>

              <Link
                href="/report"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-900 px-6 py-3.5 text-white font-semibold shadow-lg shadow-blue-900/20 transition hover:bg-blue-800 hover:-translate-y-0.5"
              >
                <ShieldAlert className="h-5 w-5" />
                <span>Report Case</span>
              </Link>

              <a
                href="https://web.facebook.com/globalantihumantraffickingorganization"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 text-white font-semibold backdrop-blur-md transition hover:bg-white/15 hover:-translate-y-0.5"
              >
                <Globe className="h-5 w-5" />
                <span>Facebook</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-14 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Get Help Immediately
            </h2>
            <p className="mt-3 text-gray-600 text-sm sm:text-base leading-relaxed">
              Choose the safest option available to you right now. Every action
              below is designed to be fast, direct, and mobile-friendly.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-5">
            <button
              onClick={() => setContactModalOpen(true)}
              className="group rounded-2xl border border-red-100 bg-white p-5 sm:p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 text-left"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 group-hover:scale-105 transition">
                <PhoneCall className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-gray-900">
                Call Options
              </h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                Choose the most appropriate support line for your location.
              </p>
            </button>

            <a
              href={buildWhatsAppLink("Hello GAHTO, I would like to make an inquiry.")}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl border border-green-100 bg-white p-5 sm:p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-600 group-hover:scale-105 transition">
                <MessageCircleHeart className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-gray-900">WhatsApp</h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                Send a discreet message if calling is not safe or possible.
              </p>
            </a>

            <Link
              href="/report"
              className="group rounded-2xl border border-blue-100 bg-white p-5 sm:p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-900 group-hover:scale-105 transition">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-gray-900">
                Report Safely
              </h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                Submit information confidentially, even if you want to stay anonymous.
              </p>
            </Link>

            <a
              href="https://web.facebook.com/globalantihumantraffickingorganization"
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl border border-sky-100 bg-white p-5 sm:p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 group-hover:scale-105 transition">
                <Globe className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-gray-900">Facebook</h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                Reach our organization through our Facebook page.
              </p>
            </a>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              What You Can Do Right Now
            </h2>
            <p className="mt-3 text-gray-600 text-sm sm:text-base leading-relaxed">
              Focus on safety first. These steps are simple, practical, and designed
              to help you respond without increasing danger.
            </p>
          </div>

          <div className="mt-10 space-y-4">
            {safetySteps.map((step, i) => {
              const Icon = step.icon;

              return (
                <div
                  key={i}
                  className="group rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm hover:shadow-lg transition duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-red-50 text-blue-900 group-hover:scale-105 transition">
                      <Icon className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-base sm:text-lg font-semibold text-gray-900">
                        {i + 1}. {step.title}
                      </p>
                      <p className="mt-1.5 text-sm sm:text-base text-gray-600 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-10 items-start">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-[11px] sm:text-xs font-medium uppercase tracking-[0.18em] text-slate-600">
              <HeartHandshake className="h-4 w-4 text-red-500" />
              Guided support
            </div>

            <h2 className="mt-5 text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
              Need step-by-step guidance?
            </h2>

            <p className="mt-4 text-gray-600 leading-relaxed text-sm sm:text-base max-w-xl">
              Our assistant can help you think through your next safest step.
              It is designed to support, guide, and help you act calmly in urgent situations.
            </p>

            <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/60 p-5 text-sm text-blue-950 leading-relaxed">
              Use the assistant for quick guidance. For immediate danger, calling
              or contacting support directly remains the fastest option.
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-3 sm:p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <AIChat />
          </div>
        </div>
      </section>

      <section className="bg-black text-white py-16 sm:py-20 text-center px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold">
            Your Safety Matters
          </h2>

          <p className="mt-4 text-gray-300 leading-relaxed">
            You can leave this page at any time using the Quick Exit button.
            When safe, come back and continue getting the support you need.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/report"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3.5 font-semibold text-white hover:bg-red-700 transition"
            >
              <ShieldAlert className="h-5 w-5" />
              <span>Report a Case</span>
            </Link>

            <button
              onClick={() => setContactModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-6 py-3.5 font-semibold text-white hover:bg-white/10 transition"
            >
              <PhoneCall className="h-5 w-5" />
              <span>Call Support</span>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}