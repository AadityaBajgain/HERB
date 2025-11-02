import Link from "next/link";
import React from "react";




const HeroSection = () => {
  return (
    <section className="h-screen grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-10">
        <span className="inline-flex items-center rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">
          Wellness reinvented
        </span>
        <div className="space-y-6">
          <h1 className="text-4xl font-semibold leading-tight text-green-400 md:text-5xl">
            Navigate your health with{" "}
            <span className="text-emerald-400">HERB</span>
          </h1>
          <p className="max-w-xl text-lg text-muted">
            Herb monitors how you feel, surfaces proactive care insights, and
            connects you with trusted clinicians before small issues turn into
            emergencies.
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

      <div className="glass-card relative overflow-hidden rounded-3xl p-8">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-transparent to-sky-500/20"
        />
        <div className="relative space-y-6">
          <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-6 shadow-inner">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
              Patient&apos;s check-in
            </p>
            <p className="mt-4 text-sm text-muted">
              “I woke up feeling dizzy.” Herb recommends hydration, stretches,
              and an on-demand nurse consult if symptoms persist.
            </p>
            <div className="mt-6 flex items-center justify-between rounded-xl bg-emerald-500/10 px-4 py-3 text-xs font-medium text-emerald-200 hover:bg-emerald-500 cursor-pointer">
              <button>Get Yourself Diagnosed</button>
              <span></span>
            </div>
          </div>

          
        </div>
      </div>
    </section>
  );
};
export default HeroSection;
