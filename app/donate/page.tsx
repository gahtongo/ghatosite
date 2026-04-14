"use client";

import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CreditCard,
  Globe,
  HeartHandshake,
  Landmark,
  ShieldCheck,
} from "lucide-react";

export default function DonatePage() {
  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

  const handlePaystackDonate = async () => {
    const res = await fetch(`${API_BASE}/api/v1/donations/paystack/initialize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        donor_name: "Anonymous",
        donor_email: "test@email.com",
        amount: 5000, // NGN
      }),
    });

    const data = await res.json();

    if (data.payment_url) {
      window.location.href = data.payment_url; // ✅ redirect to Paystack
    }
  };
  return (
    <main className="bg-white text-black overflow-x-hidden">
      {/* 💰 HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-black text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.18),transparent_28%),radial-gradient(circle_at_left_center,rgba(59,130,246,0.14),transparent_34%)]" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] sm:text-xs font-medium uppercase tracking-[0.18em] text-white/90 backdrop-blur-md">
            <HeartHandshake className="h-4 w-4 text-red-400" />
            Support survivors. Strengthen rescue work.
          </div>

          <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
            You Can Save a Life Today
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-gray-300 leading-relaxed">
            Your support helps rescue victims, provide care, raise awareness,
            and rebuild lives with dignity, protection, and hope.
          </p>
        </div>
      </section>

      {/* 💳 DONATION OPTIONS */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Choose a Donation Method
            </h2>
            <p className="mt-3 text-gray-600 text-sm sm:text-base leading-relaxed">
              Select the option that works best for you. Online payments can be
              connected to backend integrations later, while bank transfer remains
              available immediately.
            </p>
          </div>

          <div className="mt-10 grid lg:grid-cols-3 gap-6">
            {/* BANK TRANSFER */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm hover:shadow-xl transition duration-300">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <Landmark className="h-5 w-5" />
              </div>

              <h3 className="mt-5 text-xl font-bold text-gray-900">
                Bank Transfer
              </h3>
              <p className="mt-3 text-gray-600 text-sm sm:text-base leading-relaxed">
                Prefer a direct transfer? You can support GAHTO through our bank
                details below and retain bank-based giving as an alternative.
              </p>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-gray-50 p-4 sm:p-5 space-y-3 text-sm sm:text-base">
                <p>
                  <strong>Bank Name:</strong> First Bank of Nigeria
                </p>
                <p>
                  <strong>Account Number:</strong> 2034925346
                </p>
                <p>
                  <strong>Account Name:</strong> Global Anti Human Trafficking Organization
                </p>
                <p>
                  <strong>Swift Code:</strong> FBNINGLA
                </p>
              </div>

              <button className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3.5 font-semibold text-gray-900 hover:bg-gray-50 transition">
                <Building2 className="h-4 w-4" />
                <span>Use Bank Transfer</span>
              </button>
            </div>

            {/* PAYSTACK */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm hover:shadow-xl transition duration-300">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-600">
                <CreditCard className="h-5 w-5" />
              </div>

              <h3 className="mt-5 text-xl font-bold text-gray-900">
                Paystack
              </h3>
              <p className="mt-3 text-gray-600 text-sm sm:text-base leading-relaxed">
                Best for donors in Nigeria and other supported African markets.
                Fast, secure, and convenient for local card and bank payments.
              </p>

              <div className="mt-5 rounded-2xl bg-green-50 border border-green-100 p-4 text-sm text-green-800">
                Recommended for local supporters
              </div>

              <button
                onClick={handlePaystackDonate}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3.5 font-semibold text-white hover:bg-green-700 transition"
              >
                <CreditCard className="h-4 w-4" />
                <span>Donate via Paystack</span>
              </button>
            </div>

            {/* STRIPE */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm hover:shadow-xl transition duration-300">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-900">
                <Globe className="h-5 w-5" />
              </div>

              <h3 className="mt-5 text-xl font-bold text-gray-900">
                Stripe
              </h3>
              <p className="mt-3 text-gray-600 text-sm sm:text-base leading-relaxed">
                Ideal for international supporters who want to contribute using
                global cards and other supported international payment methods.
              </p>

              <div className="mt-5 rounded-2xl bg-blue-50 border border-blue-100 p-4 text-sm text-blue-900">
                Recommended for international donors
              </div>

              <button className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-900 px-5 py-3.5 font-semibold text-white hover:bg-blue-800 transition">
                <Globe className="h-4 w-4" />
                <span>Donate via Stripe</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 🔒 TRUST STRIP */}
      <section className="bg-gray-50 py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-sm text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-red-50 text-blue-900">
            <ShieldCheck className="h-6 w-6" />
          </div>

          <h2 className="mt-5 text-2xl sm:text-3xl font-bold text-gray-900">
            Secure giving, real impact
          </h2>

          <p className="mt-4 max-w-2xl mx-auto text-gray-600 leading-relaxed text-sm sm:text-base">
            Your donation helps expand awareness efforts, survivor support,
            emergency response, and anti-trafficking intervention work.
          </p>
        </div>
      </section>

      {/* ⚡ QUICK CTA */}
      <section className="relative overflow-hidden bg-black text-white py-16 sm:py-20 text-center px-4 sm:px-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.18),transparent_28%),radial-gradient(circle_at_left_center,rgba(59,130,246,0.12),transparent_34%)]" />

        <div className="relative max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold">
            Every Contribution Matters
          </h2>

          <p className="mt-4 text-gray-300 leading-relaxed">
            You are directly supporting rescue, rehabilitation, prevention,
            and hope for vulnerable individuals and survivors.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3.5 font-semibold text-white hover:bg-red-700 transition">
              <HeartHandshake className="h-5 w-5" />
              <span>Donate Now</span>
            </button>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-6 py-3.5 font-semibold text-white hover:bg-white/10 transition"
            >
              <ArrowRight className="h-5 w-5" />
              <span>Ask About Giving</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}