"use client";
import Image from "next/image";
import React from "react";

const traffickingTypes = [
  {
    title: "Sexual Exploitation",
    image: "/images/trafficking/Sex.jpg",
    content: `The most well-known form of human trafficking. It includes forcing individuals to engage in commercial sex acts such as prostitution or pornography. Children are especially vulnerable.`,
  },
  {
    title: "Child Labour",
    image: "/images/trafficking/Child.jpg",
    content: `Millions of children are exploited for labor or commercial sex. The commercial sexual exploitation of children is trafficking, regardless of circumstances.`,
  },
  {
    title: "Debt Bondage",
    image: "/images/trafficking/Debt.jpg",
    content: `Occurs when a person is forced to work to repay a debt and cannot leave until the debt is repaid, often trapping them in slavery.`,
  },
  {
    title: "Labour Trafficking",
    image: undefined,
    content: `Forced labor occurs when individuals are compelled against their will to provide work or service through force, fraud, or coercion. Victims can be any age, race, or gender.`,
  },
  {
    title: "Domestic Servitude",
    image: undefined,
    content: `Victims are forced to work in private residences, often abused and unable to leave. They may not receive pay or basic protections.`,
  },
  {
    title: "Organ Harvesting",
    image: undefined,
    content: `Victims are trafficked for the removal and sale of organs. This is a serious and often deadly form of exploitation.`,
  },
  {
    title: "Forced Begging",
    image: undefined,
    content: `Children and adults are forced to beg for money, often under threat or coercion. This is one of the most visible forms of trafficking.`,
  },
  {
    title: "Forced Marriage",
    image: undefined,
    content: `Marriage without consent, often involving threats or coercion. Considered a form of modern slavery and human trafficking.`,
  },
];

const traffickerProfiles = [
  "The Recruiter",
  "The Guide",
  "The Transporter",
  "The Receiver",
  "The Seller/Sponsor",
  "The Buyer/Madam",
];

export default function TraffickingPage() {
  return (
    <main className="bg-white text-black min-h-screen pb-20">
      <section className="py-12 px-4 sm:px-8 max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-blue-900 mb-2">Human Trafficking</h1>
        <p className="text-lg text-gray-700 mb-6">You are not lost, you are here.</p>
        <p className="mb-6 text-gray-800">
          Human trafficking is the trade of humans for forced labour, sexual slavery, or commercial sexual exploitation. It is a crime against the person, violating rights through coercion and exploitation. Trafficking can occur within a country or across borders, affecting men, women, and children of all backgrounds.
        </p>
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded mb-8">
          <strong>About Human Trafficking:</strong> Human trafficking is modern-day slavery. It is a serious public health problem that negatively affects individuals, families, and communities. Traffickers exploit victims through force, fraud, or coercion for sex or labor.
        </div>
        <h2 className="text-2xl font-bold text-blue-800 mt-10 mb-4">Types of Human Trafficking</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {traffickingTypes.map((type, idx) => (
            <div
              key={type.title}
              className="bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-2xl shadow-lg p-6 flex flex-col gap-3 border border-blue-100 hover:scale-[1.02] hover:shadow-blue-200 transition-all duration-300 animate-fadeIn"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <h3 className="text-lg sm:text-xl font-bold text-blue-900 mb-1">{type.title}</h3>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{type.content}</p>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-blue-800 mt-12 mb-4">Who is a Trafficker?</h2>
        <p className="mb-4 text-gray-800">Anybody can be a trafficker, including someone close to the victim. Traffickers often promise a better life or job, but exploit their victims for profit.</p>
        <ul className="list-disc pl-6 mb-6 text-gray-700">
          {traffickerProfiles.map((profile) => (
            <li key={profile}>{profile}</li>
          ))}
        </ul>
        <h2 className="text-2xl font-bold text-blue-800 mt-12 mb-4">Causes of Human Trafficking</h2>
        <ul className="list-disc pl-6 mb-6 text-gray-700">
          <li>Unemployment</li>
          <li>Poverty</li>
          <li>Homelessness</li>
          <li>Political Instability</li>
          <li>High Cost of Living</li>
          <li>Violence against Women and Children</li>
        </ul>
        <h2 className="text-2xl font-bold text-blue-800 mt-12 mb-4">Prevention</h2>
        <p className="mb-6 text-gray-800">Prevention starts with awareness. Parents, communities, and individuals must be vigilant and educate themselves and others about trafficking risks and tactics.</p>
        <h2 className="text-2xl font-bold text-blue-800 mt-12 mb-4">Test Your Knowledge</h2>
        <div className="bg-gray-50 border border-blue-200 rounded p-6">
          <Quiz />
        </div>
      </section>
    </main>
  );
}

function Quiz() {
  // Simple quiz questions
  const questions = [
    {
      q: "True or False: Human trafficking only happens in poor countries.",
      a: false,
    },
    {
      q: "Which of these is a form of trafficking? (A) Forced labor (B) Organ harvesting (C) Forced marriage (D) All of the above",
      a: "D",
    },
    {
      q: "Who can be a trafficker?",
      a: "Anyone, even someone close to the victim.",
    },
  ];
  const [step, setStep] = React.useState(0);
  const [show, setShow] = React.useState(false);
  return (
    <div>
      <div className="mb-4 font-semibold">{questions[step].q}</div>
      {!show ? (
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => setShow(true)}
        >
          Show Answer
        </button>
      ) : (
        <div className="mb-2 p-3 bg-blue-100 rounded text-blue-900">{String(questions[step].a)}</div>
      )}
      <div className="mt-2 flex gap-2">
        <button
          className="text-blue-700 underline disabled:text-gray-400"
          onClick={() => { setStep((s) => Math.max(0, s - 1)); setShow(false); }}
          disabled={step === 0}
        >
          Previous
        </button>
        <button
          className="text-blue-700 underline disabled:text-gray-400"
          onClick={() => { setStep((s) => Math.min(questions.length - 1, s + 1)); setShow(false); }}
          disabled={step === questions.length - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
}
