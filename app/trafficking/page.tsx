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
          <strong>What is Human Trafficking?</strong> Human Trafficking is the recruitment, transportation, transfer, harbouring or receipt of people through force, abduction, fraud or deception for the purpose of exploitation. It is the trade of humans for forced labour, sexual slavery, commercial sexual exploitation, or organ harvest. This crime violates rights through coercion and restrictions of movement, and can occur within a country or across borders, affecting men, women, and children of all backgrounds.
        </p>
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded mb-8">
          <strong>About Human Trafficking:</strong> Traffickers often use violence, fraudulent employment agencies, and fake promises of education and job opportunities to trick and coerce their victims. Human trafficking is modern-day slavery and a serious crime that negatively affects individuals, families, and communities worldwide.
        </div>
        <h2 className="text-2xl font-bold text-blue-800 mt-12 mb-4">Global Statistics (2025)</h2>
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded mb-8">
          <ul className="list-disc pl-6 text-gray-800">
            <li><strong>27.6 million</strong> men, women, and children are in forced labour worldwide. (ILO, 2025)</li>
            <li><strong>63%</strong> of forced labour occurs in the private economy.</li>
            <li><strong>$236 billion</strong> USD generated in illegal profits from forced labour every year.</li>
            <li>Trafficking affects all countries and all economic sectors.</li>
            <li>For more, see the <a href="https://www.ilo.org/global/topics/forced-labour/lang--en/index.htm" target="_blank" rel="noopener noreferrer" className="underline text-blue-700">ILO Forced Labour 2025 Facts</a> and the <a href="https://www.unodc.org/unodc/en/human-trafficking/what-is-human-trafficking.html" target="_blank" rel="noopener noreferrer" className="underline text-blue-700">UNODC Human Trafficking</a> pages.</li>
          </ul>
        </div>
        <h2 className="text-2xl font-bold text-blue-800 mt-10 mb-4">Types of Human Trafficking</h2>
        <div className="grid gap-8 sm:grid-cols-2">
          {traffickingTypes.map((type, idx) => {
            // Premium gradient variants for each card
            const gradients = [
              "from-blue-400 via-blue-100 to-purple-200",
              "from-pink-400 via-pink-100 to-yellow-100",
              "from-green-400 via-green-100 to-blue-100",
              "from-yellow-400 via-yellow-100 to-red-100",
              "from-purple-400 via-purple-100 to-blue-100",
              "from-red-400 via-red-100 to-yellow-100",
              "from-cyan-400 via-cyan-100 to-blue-100",
              "from-orange-400 via-orange-100 to-yellow-100",
            ];
            return (
              <div
                key={type.title}
                className={`bg-gradient-to-br ${gradients[idx % gradients.length]} rounded-2xl shadow-lg p-8 flex flex-col gap-3 border border-blue-100 hover:scale-[1.02] hover:shadow-blue-200 transition-all duration-300 animate-fadeIn items-start`}
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <h3 className="text-xl font-extrabold text-blue-900 mb-2 drop-shadow-lg">{type.title}</h3>
                <p className="text-gray-800 text-base leading-relaxed font-medium">{type.content}</p>
              </div>
            );
          })}
        </div>
                <h2 className="text-2xl font-bold text-blue-800 mt-12 mb-4">Survivor Story</h2>
                <div className="mb-8">
                  <div className="aspect-w-16 aspect-h-9 w-full max-w-2xl mx-auto rounded overflow-hidden shadow-lg">
                    <iframe
                      width="100%"
                      height="400"
                      src="https://www.youtube.com/embed/lcQVbYQsReU"
                      title="Survivor Story: Human Trafficking"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <p className="mt-4 text-gray-700 text-center">Watch this real survivor's story to understand the human impact of trafficking and the importance of support and awareness.</p>
                </div>
                <h2 className="text-2xl font-bold text-blue-800 mt-12 mb-4">Infographics & Resources</h2>
                <div className="grid gap-6 sm:grid-cols-2 mb-8">
                  <a href="https://www.ilo.org/publications/major-publications/global-estimates-modern-slavery-forced-labour-and-forced-marriage" target="_blank" rel="noopener noreferrer" className="block bg-white border border-blue-200 rounded-lg shadow hover:shadow-lg transition p-4 text-center">
                    <img src="https://www.ilo.org/sites/default/files/styles/cards_tablet/public/2024-04/FL_2024_Factsheet_cover.jpg.webp?itok=g4aqD2PY" alt="ILO Forced Labour Factsheet" className="mx-auto mb-2 rounded" width="180" height="120" />
                    <div className="font-semibold text-blue-900">ILO Forced Labour Factsheet (2024)</div>
                  </a>
                  <a href="https://www.unodc.org/unodc/en/human-trafficking/what-is-human-trafficking.html" target="_blank" rel="noopener noreferrer" className="block bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 border border-blue-200 rounded-lg shadow hover:shadow-lg transition p-4 text-center flex flex-col items-center justify-center">
                    <span className="text-5xl mb-2" role="img" aria-label="globe">🌐</span>
                    <div className="font-semibold text-blue-900">UNODC: What is Human Trafficking?</div>
                  </a>
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
      a: "False. It happens in every country, regardless of wealth.",
    },
    {
      q: "Which of these is a form of trafficking? (A) Forced labor (B) Organ harvesting (C) Forced marriage (D) All of the above",
      a: "D. All of the above.",
    },
    {
      q: "Who can be a trafficker?",
      a: "Anyone, even someone close to the victim.",
    },
    {
      q: "What are common tactics used by traffickers?",
      a: "Violence, fraud, fake job offers, and false promises of education or a better life.",
    },
    {
      q: "How many people are estimated to be in forced labour worldwide as of 2025?",
      a: "27.6 million (ILO, 2025)",
    },
    {
      q: "Name one way to help prevent trafficking.",
      a: "Raising awareness, educating others, and reporting suspicious activities.",
    },
    {
      q: "Does trafficking only affect women and children?",
      a: "No. It affects men, women, and children of all backgrounds.",
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
