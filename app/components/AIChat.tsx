"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowUp,
  Bot,
  Loader2,
  MessageCircleHeart,
  PhoneCall,
  ShieldAlert,
  Sparkles,
  User,
  X,
} from "lucide-react";

type ChatRole = "user" | "assistant";

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
};

const quickPrompts = [
  "I feel unsafe right now. What should I do first?",
  "How can I get help without calling?",
  "I want to report anonymously.",
  "Someone may be trafficking a child. What signs matter most?",
];

const starterMessage: ChatMessage = {
  id: "assistant-welcome",
  role: "assistant",
  content:
    "Hello. I’m GAHTO’s support assistant. I can help you think through safer next steps, explain reporting options, and guide you calmly. If you are in immediate danger, contact support or leave this page using Quick Exit.",
  createdAt: Date.now(),
};

function getErrorMessage(detail: unknown): string {
  if (!detail) return "Unable to reach the AI assistant right now.";

  if (typeof detail === "string") return detail;

  if (Array.isArray(detail)) {
    const messages = detail
      .map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object" && "msg" in item) {
          return String((item as { msg?: unknown }).msg ?? "");
        }
        return "";
      })
      .filter(Boolean);

    if (messages.length > 0) {
      return messages.join(" • ");
    }

    return "Unable to reach the AI assistant right now.";
  }

  if (typeof detail === "object" && detail !== null && "msg" in detail) {
    return String((detail as { msg?: unknown }).msg ?? "Unable to reach the AI assistant right now.");
  }

  return "Unable to reach the AI assistant right now.";
}

export default function AIChat() {
  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

  const [messages, setMessages] = useState<ChatMessage[]>([starterMessage]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [showSafetyBanner, setShowSafetyBanner] = useState(true);
  const [extractedReport, setExtractedReport] = useState<any | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const suggestedActions = useMemo(
    () => [
      {
        label: "Call Support",
        href: "/contact",
        icon: PhoneCall,
      },
      {
        label: "Report Case",
        href: "/report",
        icon: ShieldAlert,
      },
      {
        label: "WhatsApp Help",
        href: "https://wa.me/22371402809?text=Hello%20GAHTO%2C%20I%20need%20help.",
        icon: MessageCircleHeart,
        external: true,
      },
    ],
    []
  );

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isSending]);

  const createUserMessage = (content: string): ChatMessage => ({
    id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role: "user",
    content,
    createdAt: Date.now(),
  });

  const createAssistantMessage = (content: string): ChatMessage => ({
    id: `assistant-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role: "assistant",
    content,
    createdAt: Date.now(),
  });

  const sendMessage = async (preset?: string) => {
    const messageText = (preset ?? input).trim();
    if (!messageText || isSending) return;

    const updatedMessages = [...messages, createUserMessage(messageText)];

    setMessages(updatedMessages);
    setInput("");
    setErrorText("");
    setIsSending(true);

    try {
      const res = await fetch(`${API_BASE}/api/v1/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const safeError = getErrorMessage(data?.detail);
        setErrorText(safeError);
        setMessages((prev) => [
          ...prev,
          createAssistantMessage(
            "I’m having trouble responding right now. If this is urgent, please use Call Support, WhatsApp Help, or Report Case immediately."
          ),
        ]);
        return;
      }

      const reply =
        typeof data?.reply === "string" && data.reply.trim()
          ? data.reply.trim()
          : "I’m here with you. Please tell me what feels most urgent right now.";

      setMessages((prev) => [...prev, createAssistantMessage(reply)]);
    } catch {
      setErrorText("Unable to connect to the AI service right now.");
      setMessages((prev) => [
        ...prev,
        createAssistantMessage(
          "I’m unable to connect right now. Please use the direct support options below if the situation is urgent."
        ),
      ]);
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  };

  const extractReport = async () => {
    setIsExtracting(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/ai/extract-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorText(data.detail || "Failed to extract report.");
        return;
      }
      setExtractedReport(data);
    } catch {
      setErrorText("Failed to extract report.");
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.12)]">
      <div className="border-b border-slate-200 bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 px-5 py-5 text-white sm:px-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/85 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.85)]" />
              Live AI support
            </div>

            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur">
                <Bot className="h-6 w-6" />
              </div>

              <div>
                <h3 className="text-xl font-bold tracking-tight">
                  GAHTO Support Assistant
                </h3>
                <p className="mt-1 text-sm text-slate-300">
                  Calm guidance, safer next steps, and support direction
                </p>
              </div>
            </div>
          </div>

          <div className="hidden rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-slate-200 md:block">
            <div className="flex items-center gap-2 font-semibold">
              <Sparkles className="h-4 w-4" />
              <span>Premium assistance mode</span>
            </div>
          </div>
        </div>
      </div>

      {showSafetyBanner && (
        <div className="border-b border-amber-200 bg-amber-50 px-5 py-4 sm:px-6">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
              <AlertTriangle className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-amber-900">
                Emergency-first guidance
              </p>
              <p className="mt-1 text-sm leading-6 text-amber-800">
                This assistant can guide and support you, but for immediate danger,
                direct contact options remain the fastest and safest path.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowSafetyBanner(false)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-amber-700 transition hover:bg-amber-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="border-b border-slate-200 bg-slate-50/80 px-5 py-4 sm:px-6">
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => sendMessage(prompt)}
              disabled={isSending}
              className="rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-900 disabled:opacity-60"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={scrollRef}
        className="h-[420px] space-y-4 overflow-y-auto bg-[linear-gradient(to_bottom,rgba(248,250,252,0.85),rgba(255,255,255,1))] px-5 py-5 sm:px-6"
      >
        {messages.map((msg) => {
          const isUser = msg.role === "user";

          return (
            <div
              key={msg.id}
              className={`flex ${isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex max-w-[88%] items-end gap-3 ${
                  isUser ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                    isUser
                      ? "bg-blue-900 text-white"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {isUser ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </div>

                <div
                  className={`rounded-[22px] px-4 py-3.5 text-sm leading-7 shadow-sm ${
                    isUser
                      ? "rounded-br-md bg-blue-900 text-white"
                      : "rounded-bl-md border border-slate-200 bg-white text-slate-800"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            </div>
          );
        })}

        {isSending && (
          <div className="flex justify-start">
            <div className="flex max-w-[88%] items-end gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                <Bot className="h-4 w-4" />
              </div>

              <div className="rounded-[22px] rounded-bl-md border border-slate-200 bg-white px-4 py-3.5 shadow-sm">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Assistant is responding...</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-slate-200 bg-white px-5 py-4 sm:px-6">
        <div className="mb-4 grid gap-3 sm:grid-cols-3">
          {suggestedActions.map((action) => {
            const Icon = action.icon;

            if (action.external) {
              return (
                <a
                  key={action.label}
                  href={action.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 transition hover:border-blue-200 hover:bg-blue-50"
                >
                  <Icon className="h-4 w-4" />
                  <span>{action.label}</span>
                </a>
              );
            }

            return (
              <a
                key={action.label}
                href={action.href}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 transition hover:border-blue-200 hover:bg-blue-50"
              >
                <Icon className="h-4 w-4" />
                <span>{action.label}</span>
              </a>
            );
          })}
        </div>

        <button
          onClick={extractReport}
          disabled={isExtracting || messages.length < 2}
          className="w-full rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
        >
          {isExtracting ? "Analyzing..." : "Convert conversation to report"}
        </button>

        {errorText && (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorText}
          </div>
        )}

        <div className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                sendMessage();
              }
            }}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe what is happening, or ask for the safest next step..."
            className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-blue-900 focus:bg-white focus:ring-2 focus:ring-blue-900/15"
          />

          <button
            type="button"
            onClick={() => sendMessage()}
            disabled={!input.trim() || isSending}
            className="inline-flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-blue-900 text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <ArrowUp className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-3 text-xs leading-5 text-slate-500">
          For urgent danger, direct support options may be faster than chat.
        </p>
      </div>

      {extractedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold mb-4">Review Report</h3>
            <div className="space-y-3 text-sm">
              <p><strong>Case:</strong> {extractedReport.case_type}</p>
              <p><strong>Urgency:</strong> {extractedReport.urgency}</p>
              <p><strong>Description:</strong> {extractedReport.description}</p>
              <p><strong>Location:</strong> {extractedReport.location || "N/A"}</p>
              <p><strong>Time:</strong> {extractedReport.incident_time || "N/A"}</p>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setExtractedReport(null)}
                className="w-1/2 rounded-lg border py-2"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const res = await fetch(`${API_BASE}/api/v1/reports`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                      case_type: extractedReport.case_type,
                      urgency: extractedReport.urgency,
                      description: extractedReport.description,
                      location: extractedReport.location,
                      incident_time: extractedReport.incident_time,
                      additional_notes: extractedReport.additional_notes,
                      is_anonymous: true,
                    }),
                  });
                  if (res.ok) {
                    setExtractedReport(null);
                    alert("Report submitted successfully");
                  }
                }}
                className="w-1/2 rounded-lg bg-red-600 py-2 text-white"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}