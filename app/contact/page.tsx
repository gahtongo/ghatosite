"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import ContactOptionsModal from "../components/ContactOptionsModal";
import {
  Mail,
  MapPin,
  MessageCircleHeart,
  PhoneCall,
  Send,
  ShieldAlert,
  Globe,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

type PublicSetting = {
  id: number;
  key: string;
  value: string;
  description?: string | null;
  is_public: boolean;
};

export default function ContactPage() {
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmittingMessage, setIsSubmittingMessage] = useState(false);
  const [messageSuccess, setMessageSuccess] = useState("");
  const [messageError, setMessageError] = useState("");

  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoadingSettings(true);

        const res = await fetch(`${API_BASE}/api/v1/settings/public`, {
          cache: "no-store",
        });

        if (!res.ok) {
          setSettings({});
          return;
        }

        const data: PublicSetting[] = await res.json();
        const mapped = data.reduce<Record<string, string>>((acc, item) => {
          acc[item.key] = item.value;
          return acc;
        }, {});

        setSettings(mapped);
      } catch {
        setSettings({});
      } finally {
        setIsLoadingSettings(false);
      }
    };

    fetchSettings();
  }, [API_BASE]);

  const supportEmail = settings.support_email || "info@gahto.org";
  const facebookUrl =
    settings.facebook_url ||
    "https://web.facebook.com/globalantihumantraffickingorganization";
  const twitterUrl = settings.twitter_url || "https://x.com/GlobalAntiHT?t=j-V9QBzznVCRxSLMrBfLTA&s=09";
  const whatsappNumber = settings.whatsapp_number || "+22371402809";
  const nigeriaOfficePhone = settings.nigeria_office_phone || "+2348050280248";
  const maliOfficePhone = settings.mali_office_phone || "+22371402809";

  const whatsappHref = useMemo(() => {
    const sanitized = whatsappNumber.replace(/[^\d]/g, "");
    const text = encodeURIComponent("Hello GAHTO, I would like to make an inquiry.");
    return `https://wa.me/${sanitized}?text=${text}`;}, [whatsappNumber]);

  const handleSubmitMessage = async (e: FormEvent) => {
    e.preventDefault();
    setMessageSuccess("");
    setMessageError("");

    if (!name.trim() || !email.trim() || !message.trim()) {
      setMessageError("Please fill your name, email, and message.");
      return;
    }

    try {
      setIsSubmittingMessage(true);

      const res = await fetch(`${API_BASE}/api/v1/contact-messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessageError(data.detail || "Unable to send message right now.");
        return;
      }

      setMessageSuccess(
        "Your message has been sent successfully. The admin team will review and revert accordingly."
      );
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setMessageError("Unable to connect to the server right now.");
    } finally {
      setIsSubmittingMessage(false);
    }
  };

  return (
    <main className="overflow-x-hidden bg-white text-black">
      <ContactOptionsModal
        open={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
      />

      <section className="relative overflow-hidden bg-gradient-to-br from-red-600 via-red-700 to-black text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_26%),radial-gradient(circle_at_left_center,rgba(255,255,255,0.08),transparent_30%)]" />

        <div className="relative mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-white/90 backdrop-blur-md sm:text-xs">
            <ShieldAlert className="h-4 w-4" />
            Emergency support available
          </div>

          <h1 className="mt-6 text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
            If You Are in Danger,
            <br />
            Get Help Now
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-red-100 sm:text-lg">
            Immediate support is available. Reach out through any of the
            channels below as quickly and as safely as possible.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <button
              onClick={() => setContactModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-red-600 shadow-lg transition hover:bg-red-50"
            >
              <PhoneCall className="h-5 w-5" />
              <span>Call Options</span>
            </button>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-6 py-3.5 font-semibold text-white shadow-lg transition hover:bg-green-600"
            >
              <MessageCircleHeart className="h-5 w-5" />
              <span>WhatsApp</span>
            </a>

            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-6 py-3.5 font-semibold text-white shadow-lg transition hover:bg-sky-700"
            >
              <Globe className="h-5 w-5" />
              <span>Facebook</span>
            </a>

            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-black/40 px-6 py-3.5 font-semibold text-white shadow-lg transition hover:bg-black/60"
            >
              <Globe className="h-5 w-5" />
              <span>Twitter / X</span>
            </a>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Contact Us
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
              Choose the most convenient way to reach us. We are available for
              support, inquiries, and urgent reporting pathways.
            </p>
          </div>

          {/* Office Addresses Section */}
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Ado Office</h3>
              <p className="text-gray-700 text-sm">2 Onola Balemo Quarters<br />Ado Ekiti</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Abuja Office</h3>
              <p className="text-gray-700 text-sm">No 4, MukB Estate by A. A. Rano Filling Station<br />along Dape Lifecamp Abuja.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Mali Office</h3>
              <p className="text-gray-700 text-sm">Bamako, Mali<br />Phone: {maliOfficePhone}</p>
            </div>
          </div>

          {isLoadingSettings ? (
            <div className="mt-10 flex justify-center">
              <div className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-gray-600 shadow-sm">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Loading contact channels...</span>
              </div>
            </div>
          ) : (
            <div className="mt-10 grid gap-5 sm:gap-6 md:grid-cols-5">
              <button
                onClick={() => setContactModalOpen(true)}
                className="group rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 transition group-hover:scale-105">
                  <PhoneCall className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-gray-900">Call</h3>
                <p className="mt-2 text-gray-600">Choose a line</p>
              </button>

              <a
                href={`mailto:${supportEmail}`}
                className="group rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-900 transition group-hover:scale-105">
                  <Mail className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-gray-900">Email</h3>
                <p className="mt-2 break-words text-gray-600">{supportEmail}</p>
              </a>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-600 transition group-hover:scale-105">
                  <MessageCircleHeart className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-gray-900">
                  WhatsApp
                </h3>
                <p className="mt-2 break-words text-gray-600">
                  {whatsappNumber}
                </p>
              </a>

              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 transition group-hover:scale-105">
                  <Globe className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-gray-900">
                  Facebook
                </h3>
                <p className="mt-2 break-words text-gray-600">
                  Reach us on Facebook
                </p>
              </a>

              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-black/5 text-black transition group-hover:scale-105">
                  <Globe className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-gray-900">
                  Twitter / X
                </h3>
                <p className="mt-2 break-words text-gray-600">
                  Follow updates on X
                </p>
              </a>
            </div>
          )}
        </div>
      </section>

      <section className="bg-gray-50 px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Send Us a Message
            </h2>
            <p className="mt-3 text-sm text-gray-600 sm:text-base">
              For general inquiries, support requests, or partnership outreach,
              send us a message below.
            </p>
          </div>

          <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <form onSubmit={handleSubmitMessage} className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 sm:text-base"
              />

              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 sm:text-base"
              />

              <textarea
                rows={5}
                placeholder="Your Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 sm:text-base"
              />

              {messageSuccess && (
                <div className="flex items-start gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{messageSuccess}</span>
                </div>
              )}

              {messageError && (
                <div className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{messageError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmittingMessage}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-900 py-3.5 font-semibold text-white transition hover:bg-blue-800 disabled:opacity-70"
              >
                {isSubmittingMessage ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-10 text-center text-2xl font-bold text-gray-900 sm:text-3xl">
            Our Offices
          </h2>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:shadow-xl sm:p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <MapPin className="h-5 w-5" />
              </div>

              <h3 className="mt-4 text-lg font-bold text-gray-900">
                Nigeria Office
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
                2 Onola Balemo Quarters<br />Ado Ekiti
              </p>
              <p className="mt-4 font-semibold text-gray-900">
                {nigeriaOfficePhone}
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:shadow-xl sm:p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-900">
                <MapPin className="h-5 w-5" />
              </div>

              <h3 className="mt-4 text-lg font-bold text-gray-900">
                Mali Office
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
                5em plaque, Garantiguibougou, Bamako, Mali
              </p>
              <p className="mt-4 font-semibold text-gray-900">
                {maliOfficePhone}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-black px-4 py-16 text-center text-white sm:px-6 sm:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.18),transparent_28%),radial-gradient(circle_at_left_center,rgba(59,130,246,0.12),transparent_34%)]" />

        <div className="relative mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Every Report Can Save a Life
          </h2>

          <p className="mt-4 leading-relaxed text-gray-300">
            If you have information, concerns, or need support, your action can
            make a real difference.
          </p>

          <Link
            href="/report"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3.5 font-semibold text-white transition hover:bg-red-700"
          >
            <ShieldAlert className="h-5 w-5" />
            <span>Report a Case</span>
          </Link>
        </div>
      </section>
    </main>
  );
}