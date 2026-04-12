"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Globe,
  MapPin,
  MessageCircleHeart,
  PhoneCall,
  X,
  Loader2,
} from "lucide-react";

type ContactOptionsModalProps = {
  open: boolean;
  onClose: () => void;
};

type PublicSetting = {
  id: number;
  key: string;
  value: string;
  description?: string | null;
  is_public: boolean;
};

export default function ContactOptionsModal({
  open,
  onClose,
}: ContactOptionsModalProps) {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const fetchSettings = async () => {
      try {
        setIsLoading(true);

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
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [open, API_BASE]);

  const emergencyPhone = settings.emergency_phone || "+2348050503535";
  const nigeriaOfficePhone = settings.nigeria_office_phone || "+2348050280248";
  const maliOfficePhone = settings.mali_office_phone || "+22371402809";
  const whatsappNumber = settings.whatsapp_number || emergencyPhone;
  const facebookUrl =
    settings.facebook_url ||
    "https://web.facebook.com/globalantihumantraffickingorganization";
  const twitterUrl = settings.twitter_url || "https://x.com/";

  const whatsappHref = useMemo(() => {
    const sanitized = whatsappNumber.replace(/[^\d]/g, "");
    return `https://wa.me/${sanitized}?text=Thank%20you%20for%20contacting%20Global%20Anti%20Human%20Trafficking%20Organisation.%20How%20can%20we%20help%20you%20today%3F`;
  }, [whatsappNumber]);

  const contactOptions = [
    {
      label: "Nigeria Emergency Line",
      sublabel: emergencyPhone,
      href: `tel:${emergencyPhone}`,
      icon: PhoneCall,
      tone: "text-red-600 bg-red-50",
    },
    {
      label: "Nigeria Office",
      sublabel: nigeriaOfficePhone,
      href: `tel:${nigeriaOfficePhone}`,
      icon: MapPin,
      tone: "text-blue-900 bg-blue-50",
    },
    {
      label: "Mali Office",
      sublabel: maliOfficePhone,
      href: `tel:${maliOfficePhone}`,
      icon: MapPin,
      tone: "text-emerald-700 bg-emerald-50",
    },
    {
      label: "WhatsApp",
      sublabel: whatsappNumber,
      href: whatsappHref,
      icon: MessageCircleHeart,
      tone: "text-green-600 bg-green-50",
      external: true,
    },
    {
      label: "Facebook",
      sublabel: "Global Anti Human Trafficking Organisation",
      href: facebookUrl,
      icon: Globe,
      tone: "text-sky-700 bg-sky-50",
      external: true,
    },
    {
      label: "Twitter / X",
      sublabel: "Follow live updates on X",
      href: twitterUrl,
      icon: Globe,
      tone: "text-slate-900 bg-slate-100",
      external: true,
    },
  ];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <button
        aria-label="Close contact options"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
      />

      <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-2xl rounded-t-[28px] border border-white/10 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 pb-4 pt-5 sm:px-6">
          <div>
            <p className="text-lg font-bold text-slate-900 sm:text-xl">
              Choose a contact option
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Pick the safest and fastest way to reach support.
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6">
          {isLoading ? (
            <div className="flex min-h-[180px] items-center justify-center">
              <div className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-600 shadow-sm">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Loading contact options...</span>
              </div>
            </div>
          ) : (
            <div className="grid gap-3">
              {contactOptions.map((item) => {
                const Icon = item.icon;

                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${item.tone}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-900">
                        {item.label}
                      </p>
                      <p className="mt-1 break-words text-sm leading-6 text-slate-500">
                        {item.sublabel}
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}