"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const images = [
    "/images/hero1.jpg",
    "/images/hero2.jpg",
    "/images/hero3.jpg",
  ];

  const [current, setCurrent] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const navItems = ["Home", "Get Help", "Campaigns", "About"];

  return (
    <main className="bg-white text-black overflow-x-hidden">
      {/* 🔷 NAVBAR */}
      <nav className="flex items-center justify-between px-4 sm:px-6 md:px-12 py-4 bg-white/60 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        {/* LOGO */}
        <div className="flex items-center gap-3 sm:gap-4 group cursor-pointer min-w-0">
          <img
            src="/logo.png"
            alt="GAHTO Logo"
            className="h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 object-contain drop-shadow-sm shrink-0"
          />

          <div className="leading-tight min-w-0">
            <p className="font-extrabold text-xl sm:text-2xl md:text-3xl text-blue-900 tracking-tight group-hover:text-red-600 transition">
              GAHTO
            </p>
            <p className="text-[11px] sm:text-xs text-gray-500 hidden sm:block">
              Anti Human Trafficking
            </p>
          </div>
        </div>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-2 lg:gap-3">
          {navItems.map((item) => {
            const isActive = item === "Home";

            return (
              <a
                key={item}
                href="#"
                className={`relative group rounded-full px-3.5 lg:px-4 py-2 text-[13px] lg:text-[14px] font-semibold tracking-[0.015em] transition duration-300 ${
                  isActive
                    ? "text-blue-900 bg-white/80 shadow-sm"
                    : "text-slate-600 hover:text-blue-900"
                }`}
              >
                <span>{item}</span>
                <span
                  className={`absolute left-3.5 right-3.5 -bottom-0.5 h-[2px] origin-left rounded-full bg-gradient-to-r from-blue-900 to-red-500 transition-transform duration-300 ${
                    isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                ></span>
              </a>
            );
          })}

          <a
            href="#"
            className="ml-2 px-4 py-2 rounded-xl text-white bg-red-600 hover:bg-red-700 shadow-md hover:shadow-red-500/40 transition duration-300 font-semibold text-sm"
          >
            Report Case
          </a>

          <button className="px-5 py-2 rounded-xl bg-blue-900 text-white hover:bg-blue-800 shadow-md hover:shadow-blue-500/40 transition duration-300 font-semibold text-sm">
            Donate
          </button>
        </div>

        {/* MOBILE NAV */}
        <div className="flex md:hidden items-center gap-2">
          <a
            href="#"
            className="px-3 py-2 rounded-lg text-sm text-white bg-red-600 hover:bg-red-700 transition"
          >
            Report
          </a>

          <button className="px-3 py-2 rounded-lg text-sm bg-blue-900 text-white hover:bg-blue-800 transition">
            Donate
          </button>

          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(true)}
            className="ml-1 rounded-lg border border-gray-200 bg-white/80 px-3 py-2 text-blue-900 shadow-sm backdrop-blur"
          >
            ☰
          </button>
        </div>
      </nav>

      {/* 📱 MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <button
            aria-label="Close menu overlay"
            onClick={closeMobileMenu}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          />

          <div className="absolute right-0 top-0 h-full w-[82%] max-w-[340px] bg-white shadow-2xl border-l p-5 flex flex-col">
            {/* DRAWER HEADER */}
            <div className="flex items-center justify-between pb-4 border-b">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src="/logo.png"
                  alt="GAHTO Logo"
                  className="h-12 w-12 object-contain shrink-0"
                />

                <div className="leading-tight min-w-0">
                  <p className="font-extrabold text-xl text-blue-900 truncate">
                    GAHTO
                  </p>
                  <p className="text-[10px] text-gray-500">
                    Anti Human Trafficking
                  </p>
                </div>
              </div>

              <button
                type="button"
                aria-label="Close menu"
                onClick={closeMobileMenu}
                className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-gray-700 hover:bg-gray-50 transition"
              >
                ✕
              </button>
            </div>

            {/* LINKS */}
            <div className="mt-6 flex flex-col gap-2">
              {navItems.map((item) => (
                <a
                  key={item}
                  href="#"
                  onClick={closeMobileMenu}
                  className="rounded-xl px-4 py-3 text-base font-medium hover:bg-blue-50 text-gray-800 transition"
                >
                  {item}
                </a>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-auto pt-6 space-y-3">
              <a
                href="#"
                onClick={closeMobileMenu}
                className="block w-full bg-red-600 text-white py-3 rounded-xl text-center font-semibold hover:bg-red-700 transition"
              >
                Report Case
              </a>

              <button className="block w-full bg-blue-900 text-white py-3 rounded-xl font-semibold hover:bg-blue-800 transition">
                Donate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔴 HERO */}
      <section className="relative min-h-[82vh] md:h-[88vh] flex items-center">
        <div className="absolute inset-0">
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
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/20"></div>
        </div>

        <div className="relative z-10 px-4 sm:px-6 md:px-16 max-w-4xl text-white">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight">
            Report Human Trafficking.
            <br />
            <span className="text-red-500 drop-shadow-[0_0_12px_rgba(239,68,68,0.5)]">
              Get Help. Save Lives.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg md:text-xl text-gray-200 max-w-2xl leading-relaxed">
            A safe and anonymous platform to report cases, access urgent help,
            and support the fight against human trafficking.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row sm:flex-wrap gap-4">
            <button className="bg-red-600 hover:bg-red-700 text-white px-7 py-3.5 rounded-xl shadow-lg hover:shadow-red-500/40 hover:scale-105 active:scale-95 transition duration-300 font-semibold w-full sm:w-auto">
              🚨 Report a Case
            </button>

            <button className="bg-blue-900 hover:bg-blue-800 text-white px-7 py-3.5 rounded-xl shadow-lg hover:shadow-blue-500/40 hover:scale-105 active:scale-95 transition duration-300 font-semibold w-full sm:w-auto">
              🆘 Get Help
            </button>

            <button className="px-7 py-3.5 rounded-xl border border-white/40 text-white backdrop-blur-md bg-white/10 hover:bg-white hover:text-black hover:scale-105 active:scale-95 transition duration-300 font-semibold w-full sm:w-auto">
              🤝 Support the Mission
            </button>
          </div>
        </div>
      </section>

      {/* ⚡ QUICK ACTION */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 sm:px-6 py-10 bg-gray-50 text-center">
        {["🚨 Report", "🆘 Help", "📞 Hotline", "💬 Chat"].map((item) => (
          <div
            key={item}
            className="p-5 bg-white rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300 flex items-center justify-center gap-2 font-medium"
          >
            {item}
          </div>
        ))}
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

      {/* 🧠 HOW IT WORKS */}
      <section className="bg-gray-50 py-16 px-4 sm:px-6 text-center">
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
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 bg-gradient-to-br from-blue-500/10 to-red-500/10"></div>

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
          <button className="bg-blue-900 hover:bg-blue-800 hover:scale-105 active:scale-95 text-white px-6 py-3 rounded-lg shadow-lg transition duration-200 w-full sm:w-auto">
            Get Help Now
          </button>

          <button className="border border-gray-300 hover:bg-black hover:text-white hover:scale-105 active:scale-95 px-6 py-3 rounded-lg transition duration-200 w-full sm:w-auto">
            Chat Assistant
          </button>
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

        <button className="bg-red-600 hover:bg-red-700 hover:scale-105 active:scale-95 text-white px-8 py-3 rounded-lg shadow-lg transition duration-200 w-full sm:w-auto">
          Donate Now
        </button>
      </section>

      {/* FOOTER */}
      <footer className="bg-black text-white py-10 text-center px-4">
        <p className="text-sm sm:text-base">
          © GAHTO - Global Anti Human Trafficking Organisation
        </p>
      </footer>
    </main>
  );
}