"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuthApi } from "@/hooks/useAuthApi";
import {
  CheckCircle2,
  Globe,
  Loader2,
  Mail,
  MessageCircleHeart,
  PhoneCall,
  Save,
  Settings2,
  ShieldAlert,
  Sparkles,
  XCircle,
} from "lucide-react";

type Setting = {
  id: number;
  key: string;
  value: string;
  description?: string;
  is_public: boolean;
};

type SettingsMap = Record<string, Setting>;

const orderedKeys = [
  "whatsapp_number",
  "emergency_phone",
  "nigeria_office_phone",
  "mali_office_phone",
  "support_email",
  "facebook_url",
  "twitter_url",
];

const keyMeta: Record<
  string,
  {
    label: string;
    helper: string;
    icon: React.ComponentType<{ className?: string }>;
    group: "Emergency & Support" | "Office Lines" | "Social Channels";
    placeholder: string;
  }
> = {
  whatsapp_number: {
    label: "WhatsApp Number",
    helper: "Primary WhatsApp support line used on the public site.",
    icon: MessageCircleHeart,
    group: "Emergency & Support",
    placeholder: "+2348000000000",
  },
  emergency_phone: {
    label: "Emergency Phone",
    helper: "Main emergency reporting line for urgent outreach.",
    icon: ShieldAlert,
    group: "Emergency & Support",
    placeholder: "+2348000000000",
  },
  nigeria_office_phone: {
    label: "Nigeria Office Phone",
    helper: "Displayed on the contact page and quick call options.",
    icon: PhoneCall,
    group: "Office Lines",
    placeholder: "+2348000000000",
  },
  mali_office_phone: {
    label: "Mali Office Phone",
    helper: "Displayed for Mali office contact and outreach.",
    icon: PhoneCall,
    group: "Office Lines",
    placeholder: "+22370000000",
  },
  support_email: {
    label: "Support Email",
    helper: "Main support inbox shown across the website.",
    icon: Mail,
    group: "Emergency & Support",
    placeholder: "info@gahto.org",
  },
  facebook_url: {
    label: "Facebook URL",
    helper: "Official public Facebook page link.",
    icon: Globe,
    group: "Social Channels",
    placeholder: "https://facebook.com/...",
  },
  twitter_url: {
    label: "Twitter / X URL",
    helper: "Official X account for updates and announcements.",
    icon: Globe,
    group: "Social Channels",
    placeholder: "https://x.com/...",
  },
};

export default function AdminSettingsPage() {
  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

  const authFetch = useAuthApi();

  const [settings, setSettings] = useState<SettingsMap>({});
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [statusText, setStatusText] = useState("");
  const [errorText, setErrorText] = useState("");

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setErrorText("");
      setStatusText("");

      const res = await authFetch(`${API_BASE}/api/v1/settings/admin`, {
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorText(data.detail || "Failed to load settings.");
        return;
      }

      const mapped = (Array.isArray(data) ? data : []).reduce<SettingsMap>(
        (acc, item) => {
          acc[item.key] = item;
          return acc;
        },
        {}
      );

      setSettings(mapped);
    } catch {
      setErrorText("Unable to load settings right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateValue = (key: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        value,
      },
    }));
  };

  const saveSetting = async (key: string) => {
    const setting = settings[key];
    if (!setting) return;

    try {
      setSavingKey(key);
      setStatusText("");
      setErrorText("");

      const res = await authFetch(`${API_BASE}/api/v1/settings/admin/${key}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          value: setting.value,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorText(data.detail || "Failed to save setting.");
        return;
      }

      setSettings((prev) => ({
        ...prev,
        [key]: data,
      }));
      setStatusText(`${keyMeta[key]?.label || key} updated successfully.`);
    } catch {
      setErrorText("Unable to save setting right now.");
    } finally {
      setSavingKey(null);
    }
  };

  const groupedSections = useMemo(() => {
    const sections: Record<string, string[]> = {
      "Emergency & Support": [],
      "Office Lines": [],
      "Social Channels": [],
    };

    orderedKeys.forEach((key) => {
      if (settings[key] && keyMeta[key]) {
        sections[keyMeta[key].group].push(key);
      }
    });

    return sections;
  }, [settings]);

  const stats = useMemo(() => {
    const available = orderedKeys.filter((key) => !!settings[key]).length;
    const publicCount = orderedKeys.filter(
      (key) => settings[key]?.is_public
    ).length;

    return {
      total: available,
      publicCount,
      emergencyReady:
        !!settings.emergency_phone?.value && !!settings.whatsapp_number?.value,
    };
  }, [settings]);

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-900">
              Site Control Center
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
              Public contact and channel settings
            </h2>
            <p className="mt-4 max-w-3xl leading-relaxed text-slate-600">
              Manage the live numbers, support email, social channels, and public
              communication endpoints displayed across GAHTO’s website.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm font-semibold text-violet-700">
              <Sparkles className="h-4 w-4" />
              <span>Premium admin control layer</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Loaded
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-950">
                {stats.total}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Public
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-950">
                {stats.publicCount}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center col-span-2 sm:col-span-1">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Emergency
              </p>
              <p
                className={`mt-2 text-sm font-bold ${
                  stats.emergencyReady ? "text-emerald-600" : "text-amber-600"
                }`}
              >
                {stats.emergencyReady ? "Ready" : "Needs review"}
              </p>
            </div>
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

      {loading ? (
        <section className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-sm">
          <div className="flex min-h-[220px] items-center justify-center">
            <div className="inline-flex items-center gap-3 text-slate-600">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading settings...</span>
            </div>
          </div>
        </section>
      ) : (
        Object.entries(groupedSections).map(([sectionTitle, keys]) => (
          <section
            key={sectionTitle}
            className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-900">
                <Settings2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900">
                  {sectionTitle}
                </p>
                <p className="text-sm text-slate-500">
                  Update the public-facing values for this section.
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              {keys.map((key) => {
                const setting = settings[key];
                const meta = keyMeta[key];
                const Icon = meta.icon;

                return (
                  <div
                    key={key}
                    className="rounded-[1.5rem] border border-slate-200 bg-slate-50/70 p-5"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex min-w-0 gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-blue-900 shadow-sm">
                          <Icon className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900">
                            {meta.label}
                          </p>
                          <p className="mt-1 text-sm leading-6 text-slate-500">
                            {meta.helper}
                          </p>
                          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                            Key: {key}
                          </p>
                        </div>
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col gap-3 lg:max-w-2xl">
                        <input
                          value={setting?.value || ""}
                          onChange={(e) => updateValue(key, e.target.value)}
                          placeholder={meta.placeholder}
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-900 focus:ring-2 focus:ring-blue-900/15"
                        />

                        <div className="flex flex-wrap items-center gap-3">
                          <span
                            className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${
                              setting?.is_public
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {setting?.is_public ? "Public" : "Private"}
                          </span>

                          <button
                            type="button"
                            onClick={() => saveSetting(key)}
                            disabled={savingKey === key}
                            className="inline-flex items-center gap-2 rounded-xl bg-blue-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:opacity-70"
                          >
                            {savingKey === key ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Save className="h-4 w-4" />
                            )}
                            <span>
                              {savingKey === key ? "Saving..." : "Save"}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))
      )}
    </div>
  );
}