import Link from "next/link";
import React from "react";

const HeroSection = () => {
  return (
    <section className="h-screen grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-10">
        <span className="inline-flex items-center rounded-full border border-sky-500/40 bg-sky-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">
          AI-Powered Health
        </span>

        <div className="space-y-6">
          <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl">
            Understand your symptoms with{" "}
            <span className="text-emerald-400">HealthAI</span>
          </h1>
          <p className="max-w-xl text-lg text-muted">
            Your intelligent health assistant that analyzes both text and image
            symptoms using Google Gemini — providing clear diagnoses, detecting
            emergencies, and recommending the right hospitals for your condition.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <Link href="/diagnosis" className="btn-primary w-full sm:w-auto">
            Start Diagnosis
          </Link>
          <Link href="#features" className="btn-secondary w-full sm:w-auto">
            See how it works
          </Link>
        </div>
      </div>

      {/* Right-side visual card */}
      <div className="glass-card relative overflow-hidden rounded-3xl p-8">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-transparent to-sky-500/20"
        />

        <div className="relative space-y-6">
          {/* AI Example Card */}
          <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-6 shadow-inner">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
              AI Visual Analysis
            </p>
            <p className="mt-4 text-sm text-muted">
              “User uploaded a photo of a skin rash.” HealthAI compares it to
              medical references and suggests: <b>eczema (78%)</b>,{" "}
              <b>allergic reaction (15%)</b>, <b>psoriasis (7%)</b>.
            </p>
            <Link
              href="/diagnosis"
              className="mt-6 flex items-center justify-between rounded-xl bg-emerald-500/10 px-4 py-3 text-xs font-medium text-emerald-200 transition hover:bg-emerald-500/20"
            >
              <span>Try Image Diagnosis</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          {/* Nearby hospital suggestion */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
              Smart Hospital Finder
            </p>
            <p className="mt-3 text-sm text-muted">
              “Nearest dermatology specialist found at:”
              <br />
              <span className="text-emerald-300">
                Sunrise Skin & Allergy Clinic – 2.4 miles away
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
