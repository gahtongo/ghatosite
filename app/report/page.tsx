"use client";

import { ChangeEvent, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

export default function ReportPage() {
  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

  const [step, setStep] = useState(1);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [caseType, setCaseType] = useState("Suspected Trafficking");
  const [urgency, setUrgency] = useState("Urgent");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [incidentTime, setIncidentTime] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [evidenceFileName, setEvidenceFileName] = useState("");

  const [reporterName, setReporterName] = useState("");
  const [reporterEmail, setReporterEmail] = useState("");
  const [reporterPhone, setReporterPhone] = useState("");

  const handleEscape = () => {
    window.location.replace("https://www.google.com");
  };

  const handleEvidenceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setEvidenceFileName(file ? file.name : "");
  };

  const getReporterLabel = () => {
    if (isAnonymous) return "Anonymous";

    const parts = [reporterName, reporterEmail, reporterPhone].filter(
      (value) => value.trim() !== ""
    );

    return parts.length > 0 ? parts.join(" • ") : "Contact details not provided";
  };

  const resetForm = () => {
    setStep(1);
    setIsAnonymous(true);
    setIsSubmitting(false);
    setSubmitError("");
    setSubmitSuccess(false);

    setCaseType("Suspected Trafficking");
    setUrgency("Urgent");
    setDescription("");
    setLocation("");
    setIncidentTime("");
    setAdditionalNotes("");
    setEvidenceFileName("");

    setReporterName("");
    setReporterEmail("");
    setReporterPhone("");
  };

  const handleSubmit = async () => {
    if (!description.trim()) return;

    try {
      setIsSubmitting(true);
      setSubmitError("");

      const payload = {
        case_type: caseType,
        urgency,
        description,
        location: location || null,
        incident_time: incidentTime || null,
        additional_notes: additionalNotes || null,
        is_anonymous: isAnonymous,
        reporter_name: isAnonymous ? null : reporterName || null,
        reporter_email: isAnonymous ? null : reporterEmail || null,
        reporter_phone: isAnonymous ? null : reporterPhone || null,
      };

      const res = await fetch(`${API_BASE}/api/v1/reports`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data.detail || "Unable to submit your report right now.");
        return;
      }

      setSubmitSuccess(true);
    } catch {
      setSubmitError("Unable to submit your report right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = useMemo(() => (step / 5) * 100, [step]);

  const ProgressBar = () => (
    <div className="mb-6">
      <div className="h-2 w-full rounded-full bg-gray-200">
        <div
          className="h-2 rounded-full bg-red-600 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-1 text-xs text-gray-500">Step {step} of 5</p>
    </div>
  );

  if (submitSuccess) {
    return (
      <main className="relative flex min-h-screen items-center justify-center bg-white px-4">
        <button
          onClick={handleEscape}
          className="absolute right-4 top-4 rounded-lg bg-black px-4 py-2 text-sm text-white transition hover:bg-gray-800"
        >
          Quick Exit
        </button>

        <div className="w-full max-w-2xl rounded-[2rem] border border-emerald-200 bg-emerald-50 p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="h-7 w-7" />
          </div>

          <h1 className="mt-5 text-3xl font-bold text-slate-950">
            Report submitted successfully
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-700">
            Thank you for speaking up. Your report has been securely received by
            the GAHTO team for review.
          </p>

          {evidenceFileName && (
            <p className="mt-4 text-sm text-slate-500">
              Evidence selected on this device: {evidenceFileName}
            </p>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={resetForm}
              className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700"
            >
              Submit another report
            </button>

            <button
              onClick={() => window.location.replace("/")}
              className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Return home
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (step === 1) {
    return (
      <main className="relative flex min-h-screen items-center justify-center bg-white px-4">
        <button
          onClick={handleEscape}
          className="absolute right-4 top-4 rounded-lg bg-black px-4 py-2 text-sm text-white transition hover:bg-gray-800"
        >
          Quick Exit
        </button>

        <div className="max-w-xl text-center">
          <h1 className="text-3xl font-bold text-gray-900">You Are Safe Here</h1>

          <p className="mt-4 text-gray-600">
            You can report human trafficking securely and anonymously. Take your
            time — you are in control.
          </p>

          <div className="mt-6 space-y-1 rounded-xl border bg-gray-50 p-5 text-sm text-gray-700">
            <p>🔒 Your identity is protected</p>
            <p>⚡ Leave instantly at any time</p>
            <p>🛡️ Your report helps save lives</p>
          </div>

          <button
            onClick={() => setStep(2)}
            className="mt-8 rounded-xl bg-red-600 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-red-700"
          >
            Start Report
          </button>
        </div>
      </main>
    );
  }

  if (step === 2) {
    return (
      <main className="relative min-h-screen bg-white px-4 py-10">
        <button
          onClick={handleEscape}
          className="fixed right-4 top-4 z-50 rounded-lg bg-black px-4 py-2 text-sm text-white"
        >
          Quick Exit
        </button>

        <div className="mx-auto max-w-2xl">
          <ProgressBar />

          <h2 className="text-2xl font-bold text-gray-900">
            Tell Us What’s Happening
          </h2>

          <p className="mt-2 text-gray-600">
            Share what you know. Even small details can help.
          </p>

          <div className="mt-8 space-y-6 rounded-2xl border bg-gray-50 p-6">
            <select
              value={caseType}
              onChange={(e) => setCaseType(e.target.value)}
              className="w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-red-500"
            >
              <option>Suspected Trafficking</option>
              <option>Confirmed Trafficking</option>
              <option>Attempted Trafficking</option>
              <option>Other</option>
            </select>

            <div className="flex flex-wrap gap-3">
              {["Low", "Medium", "Urgent"].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setUrgency(level)}
                  className={`rounded-lg border px-4 py-2 font-medium transition ${
                    urgency === level
                      ? level === "Urgent"
                        ? "border-red-600 bg-red-600 text-white shadow"
                        : "bg-gray-900 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>

            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the situation..."
              className="w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-red-500"
            />

            <button
              disabled={!description.trim()}
              onClick={() => setStep(3)}
              className="w-full rounded-lg bg-red-600 py-3 font-semibold text-white disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (step === 3) {
    return (
      <main className="relative min-h-screen bg-white px-4 py-10">
        <button
          onClick={handleEscape}
          className="fixed right-4 top-4 z-50 rounded-lg bg-black px-4 py-2 text-sm text-white"
        >
          Quick Exit
        </button>

        <div className="mx-auto max-w-2xl">
          <ProgressBar />

          <h2 className="text-2xl font-bold text-gray-900">Location & Evidence</h2>

          <div className="mt-8 space-y-6 rounded-2xl border bg-gray-50 p-6">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City or location"
              className="w-full rounded-lg border px-4 py-3"
            />

            <input
              type="text"
              value={incidentTime}
              onChange={(e) => setIncidentTime(e.target.value)}
              placeholder="When did this happen?"
              className="w-full rounded-lg border px-4 py-3"
            />

            <div className="rounded-xl border-2 border-dashed p-4 text-center">
              <input type="file" onChange={handleEvidenceChange} />
              {evidenceFileName && (
                <p className="mt-2 text-sm text-green-600">✓ {evidenceFileName} selected</p>
              )}
            </div>

            <textarea
              rows={4}
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="Additional notes..."
              className="w-full rounded-lg border px-4 py-3"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="w-1/2 rounded-lg border py-3"
              >
                Back
              </button>

              <button
                onClick={() => setStep(4)}
                className="w-1/2 rounded-lg bg-red-600 py-3 text-white"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (step === 4) {
    return (
      <main className="relative min-h-screen bg-white px-4 py-10">
        <button
          onClick={handleEscape}
          className="fixed right-4 top-4 z-50 rounded-lg bg-black px-4 py-2 text-sm text-white"
        >
          Quick Exit
        </button>

        <div className="mx-auto max-w-2xl">
          <ProgressBar />

          <h2 className="text-2xl font-bold text-gray-900">
            Your Information (Optional)
          </h2>

          <div className="mt-8 space-y-6 rounded-2xl border bg-gray-50 p-6">
            <div className="flex items-center justify-between">
              <p className="font-medium">Stay Anonymous</p>

              <button
                type="button"
                onClick={() => setIsAnonymous(!isAnonymous)}
                className={`h-6 w-12 rounded-full ${isAnonymous ? "bg-green-500" : "bg-gray-300"}`}
              />
            </div>

            {!isAnonymous && (
              <>
                <input
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  placeholder="Name"
                  className="w-full rounded-lg border px-4 py-3"
                />
                <input
                  value={reporterEmail}
                  onChange={(e) => setReporterEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full rounded-lg border px-4 py-3"
                />
                <input
                  value={reporterPhone}
                  onChange={(e) => setReporterPhone(e.target.value)}
                  placeholder="Phone"
                  className="w-full rounded-lg border px-4 py-3"
                />
              </>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(3)}
                className="w-1/2 rounded-lg border py-3"
              >
                Back
              </button>

              <button
                onClick={() => setStep(5)}
                className="w-1/2 rounded-lg bg-red-600 py-3 text-white"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-white px-4 py-10">
      <button
        onClick={handleEscape}
        className="fixed right-4 top-4 z-50 rounded-lg bg-black px-4 py-2 text-sm text-white"
      >
        Quick Exit
      </button>

      <div className="mx-auto max-w-2xl">
        <ProgressBar />

        <h2 className="text-2xl font-bold text-gray-900">Review & Submit</h2>

        <div className="mt-6 space-y-4 rounded-xl border bg-gray-50 p-5">
          <p>
            <strong>Case:</strong> {caseType}
          </p>
          <p>
            <strong>Urgency:</strong> {urgency}
          </p>
          <p>
            <strong>Description:</strong> {description}
          </p>
          <p>
            <strong>Location:</strong> {location || "Not provided"}
          </p>
          <p>
            <strong>Time:</strong> {incidentTime || "Not provided"}
          </p>
          <p>
            <strong>Reporter:</strong> {getReporterLabel()}
          </p>
          <p>
            <strong>Additional notes:</strong> {additionalNotes || "Not provided"}
          </p>
          <p>
            <strong>Evidence:</strong>{" "}
            {evidenceFileName ? `${evidenceFileName} (selected locally)` : "Not provided"}
          </p>
        </div>

        {submitError && (
          <div className="mt-5 flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{submitError}</span>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => setStep(4)}
            className="w-1/2 rounded-lg border py-3"
          >
            Back
          </button>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="inline-flex w-1/2 items-center justify-center gap-2 rounded-lg bg-red-600 py-3 font-semibold text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              "Submit Report"
            )}
          </button>
        </div>
      </div>
    </main>
  );
}