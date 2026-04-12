"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  HeartHandshake,
  Megaphone,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

export default function AboutPage() {
  const pillars = [
    {
      title: "Rescue Operations",
      desc: "Identifying and rescuing victims from trafficking situations through coordinated action and intervention.",
      icon: ShieldCheck,
    },
    {
      title: "Survivor Support",
      desc: "Providing rehabilitation, counseling, and reintegration pathways that help survivors rebuild with dignity.",
      icon: HeartHandshake,
    },
    {
      title: "Awareness Campaigns",
      desc: "Educating communities and institutions to prevent trafficking through knowledge, advocacy, and action.",
      icon: Megaphone,
    },
    {
      title: "Community Empowerment",
      desc: "Creating support systems, skills pathways, and opportunities for vulnerable groups and communities.",
      icon: Users,
    },
  ];

  const teamMembers = [
    {
      name: "Jummai Madaki",
      role: "Advocate",
      img: "/team/jummai.jpg",
    },
    {
      name: "Bukky Alabi",
      role: "Counselor",
      img: "/team/bukky.jpg",
    },
    {
      name: "Peter Adeniran",
      role: "Secretary",
      img: "/team/peter.jpg",
    },
    {
      name: "Esther Robert",
      role: "Administrator",
      img: "/team/esther.jpg",
    },
    {
      name: "John Olatimehin",
      role: "Project Manager",
      img: "/team/john.jpg",
    },
  ];

  return (
    <main className="bg-white text-black overflow-x-hidden">
      {/* 🔴 HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-black text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.2),transparent_28%),radial-gradient(circle_at_left_center,rgba(59,130,246,0.14),transparent_34%)]" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] sm:text-xs font-medium uppercase tracking-[0.18em] text-white/90 backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-red-400" />
            Who we are
          </div>

          <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.05] tracking-tight">
            You Are Not Lost.
            <br />
            <span className="bg-gradient-to-r from-red-400 via-red-500 to-orange-300 bg-clip-text text-transparent">
              You Are Here.
            </span>
          </h1>

          <p className="mt-6 max-w-3xl mx-auto text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed">
            A global movement committed to rescuing victims, preventing
            exploitation, and restoring lives with dignity, compassion, and
            action.
          </p>
        </div>
      </section>

      {/* 🧠 MISSION + VISION */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6 md:gap-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm hover:shadow-xl transition duration-300">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-red-50 text-blue-900">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <h2 className="mt-5 text-2xl sm:text-3xl font-bold text-gray-900">
              Our Mission
            </h2>

            <p className="mt-4 text-gray-600 leading-relaxed text-sm sm:text-base">
              To rescue victims of human trafficking globally, provide
              rehabilitation, and empower them to rebuild independent and
              meaningful lives through collaboration with governments, NGOs,
              and individuals.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm hover:shadow-xl transition duration-300">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 text-red-600">
              <HeartHandshake className="h-5 w-5" />
            </div>

            <h2 className="mt-5 text-2xl sm:text-3xl font-bold text-gray-900">
              Our Vision
            </h2>

            <p className="mt-4 text-gray-600 leading-relaxed text-sm sm:text-base">
              To create a world where every individual is protected from
              trafficking, empowered to thrive, and given the opportunity to
              live with dignity and freedom.
            </p>
          </div>
        </div>
      </section>

      {/* 🛡️ WHAT WE DO */}
      <section className="bg-gray-50 py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              What We Do
            </h2>
            <p className="mt-4 text-gray-600 text-sm sm:text-base leading-relaxed">
              Our work combines intervention, advocacy, survivor-centered care,
              and community resilience to create meaningful impact.
            </p>
          </div>

          <div className="mt-10 grid md:grid-cols-2 xl:grid-cols-4 gap-5 sm:gap-6">
            {pillars.map((item, i) => {
              const Icon = item.icon;

              return (
                <div
                  key={i}
                  className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-red-50 text-blue-900 group-hover:scale-105 transition">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-5 font-bold text-lg text-gray-900">
                    {item.title}
                  </h3>

                  <p className="text-gray-600 mt-3 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 👑 FOUNDER MESSAGE */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center text-gray-900">
            Founder’s Message
          </h2>

          <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 sm:p-8 shadow-sm text-gray-700 leading-relaxed">
            <p>
              Human trafficking has become a global challenge affecting
              millions. Witnessing the realities of exploitation firsthand led
              to the creation of GAHTO — a bold step toward rescuing victims
              and restoring hope.
            </p>

            <p className="mt-5">
              This organization exists to take action, not just raise
              awareness. Together, we can free victims from exploitation and
              give them a chance at a better life.
            </p>

            <div className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm border border-slate-200">
              <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
              <p className="font-semibold text-black">
                Prosper Kayode Micheal
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 👥 LEADERSHIP */}
      <section className="bg-gray-50 py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold mb-12 text-gray-900">
            Leadership
          </h2>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            <div className="group rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 text-center shadow-sm hover:shadow-xl transition duration-300">
              <div className="relative w-36 h-36 sm:w-40 sm:h-40 mx-auto rounded-full overflow-hidden shadow-lg ring-4 ring-red-50">
                <Image
                  src="/team/prosper.jpg"
                  alt="Prosper Kayode Micheal"
                  fill
                  sizes="160px"
                  className="object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
              <h3 className="mt-5 font-bold text-xl text-gray-900">
                Prosper Kayode Micheal
              </h3>
              <p className="text-gray-500 text-sm sm:text-base mt-1">
                Founder / President
              </p>
            </div>

            <div className="group rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 text-center shadow-sm hover:shadow-xl transition duration-300">
              <div className="relative w-36 h-36 sm:w-40 sm:h-40 mx-auto rounded-full overflow-hidden shadow-lg ring-4 ring-blue-50">
                <Image
                  src="/team/tosin.jpg"
                  alt="Tosin Adeniran"
                  fill
                  sizes="160px"
                  className="object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
              <h3 className="mt-5 font-bold text-xl text-gray-900">
                Tosin Adeniran
              </h3>
              <p className="text-gray-500 text-sm sm:text-base mt-1">
                National Coordinator
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 🧑‍🤝‍🧑 TEAM */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold mb-12 text-gray-900">
            Our Team
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 sm:gap-8">
            {teamMembers.map((member, i) => (
              <div
                key={i}
                className="group rounded-3xl border border-slate-200 bg-white p-5 text-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300"
              >
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 mx-auto rounded-full overflow-hidden shadow-md ring-4 ring-slate-50">
                  <Image
                    src={member.img}
                    alt={member.name}
                    fill
                    sizes="128px"
                    className="object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>

                <h3 className="mt-4 font-semibold text-gray-900">
                  {member.name}
                </h3>
                <p className="text-gray-500 text-sm mt-1">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🚀 CTA */}
      <section className="relative overflow-hidden bg-black text-white py-16 sm:py-20 px-4 sm:px-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.18),transparent_28%),radial-gradient(circle_at_left_center,rgba(59,130,246,0.12),transparent_34%)]" />

        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            Take a Stand Against Human Trafficking
          </h2>

          <p className="mt-4 text-gray-300 leading-relaxed max-w-2xl mx-auto">
            Join us in creating awareness, supporting survivors, and helping
            vulnerable individuals find protection, dignity, and hope.
          </p>

          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <Link
              href="/report"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3.5 font-semibold text-white hover:bg-red-700 transition"
            >
              <ShieldCheck className="h-5 w-5" />
              <span>Report a Case</span>
            </Link>

            <Link
              href="/donate"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-6 py-3.5 font-semibold text-white hover:bg-white/10 transition"
            >
              <ArrowRight className="h-5 w-5" />
              <span>Support the Mission</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}