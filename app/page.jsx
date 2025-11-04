import HeroSection from "@/components/HeroSection";
import Link from "next/link";
import React from "react";

const features = [
  {
    title: "Multimodal Symptom Analysis",
    badge: "AI Diagnosis",
    description:
      "HERB uses Google Gemini to interpret both text and images of symptoms — including skin conditions, swelling, wounds, and rashes — providing accurate, ranked condition predictions.",
  },
  {
    title: "Emergency Detection",
    badge: "Smart Triage",
    description:
      "Instantly detects signs of serious conditions such as stroke, chest pain, or severe injury and routes users to the nearest emergency care when urgent intervention is required.",
  },
  {
    title: "Hospital Recommendation",
    badge: "Specialized Care",
    description:
      "Automatically finds nearby hospitals and clinics based on your suspected condition and medical specialty — ensuring you go to the right place the first time.",
  },
  {
    title: "Actionable Guidance",
    badge: "Personal Health Plan",
    description:
      "Beyond diagnosis, HERB explains next steps clearly: what to monitor, when to see a doctor, and simple prevention or lifestyle actions to take immediately.",
  },
];

const supportSteps = [
  {
    title: "Describe or upload your symptoms",
    detail:
      "Simply tell HERB how you feel, or upload an image of the affected area — whether it's a rash, wound, or swelling.",
  },
  {
    title: "Get instant analysis and insights",
    detail:
      "Our AI evaluates your inputs using Google Gemini, compares them with medical data, and returns possible conditions ranked by probability.",
  },
  {
    title: "Receive guidance and find care",
    detail:
      "HERB provides clear next steps — including self-care advice, red-flag alerts, and a list of nearby hospitals that specialize in your condition.",
  },
];

const Page = () => {
  return (
    <main className="pb-20">
      <div className="sm:h-screen page-shell space-y-24">
        <HeroSection />


        <section id="features" className="space-y-12">
          <div className="max-w-2xl space-y-4">
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-200">
              Built for smarter care
            </span>
            <h2 className="text-3xl font-semibold text-white md:text-4xl">
              Understand your symptoms with clarity
            </h2>
            <p className="text-lg text-muted">
              HERB empowers you to make informed health decisions by
              combining visual and text-based symptom analysis with AI-powered
              insights.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {features.map(({ title, description, badge }) => (
              <article
                key={title}
                className="glass-card relative overflow-hidden rounded-3xl p-6 transition duration-200 hover:-translate-y-1"
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-x-6 top-0 h-24 rounded-b-full bg-gradient-to-b from-emerald-500/20 via-transparent to-transparent"
                />
                <div className="relative space-y-4">
                  <span className="inline-flex w-fit items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">
                    {badge}
                  </span>
                  <h3 className="text-xl font-semibold text-white">{title}</h3>
                  <p className="text-sm text-muted">{description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>


        <section className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-200">
              How HERB supports you
            </span>
            <h2 className="text-3xl font-semibold text-white md:text-4xl">
              AI guidance, human-level reassurance
            </h2>
            <p className="text-lg text-muted">
              HERB blends cutting-edge AI analysis with trusted medical data
              to help you understand what’s happening — and what to do next.
            </p>

            <ul className="space-y-5">
              {supportSteps.map(({ title, detail }) => (
                <li
                  key={title}
                  className="rounded-3xl border border-white/5 bg-white/5 p-5"
                >
                  <h3 className="text-lg font-semibold text-white">{title}</h3>
                  <p className="mt-2 text-sm text-muted">{detail}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-card relative overflow-hidden rounded-3xl p-8">
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-br from-sky-500/20 via-transparent to-emerald-500/20"
            />

            <div className="relative space-y-6">
              <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                  Visual Analysis
                </p>
                <h3 className="mt-4 text-2xl font-semibold text-white">
                  See what your symptoms mean
                </h3>
                <p className="mt-4 text-sm text-muted">
                  HERB compares your uploaded image to a library of verified
                  medical references, helping you understand what your skin,
                  wound, or swelling might indicate.
                </p>
                <ul className="mt-6 space-y-4">
                  <li className="flex items-start gap-3 text-sm text-muted">
                    <span className="mt-1 h-2 w-2 rounded-full bg-sky-400" />
                    AI image recognition for rashes, burns, swelling, and
                    injuries.
                  </li>
                  <li className="flex items-start gap-3 text-sm text-muted">
                    <span className="mt-1 h-2 w-2 rounded-full bg-purple-400" />
                    Automatic triage based on urgency and severity.
                  </li>
                  <li className="flex items-start gap-3 text-sm text-muted">
                    <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                    Personalized advice with prevention tips and care
                    recommendations.
                  </li>
                </ul>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                  Trusted Support
                </p>
                <p className="mt-3 text-sm text-muted">
                  Built with verified medical data and expert-reviewed sources,
                  HERB empowers users to make informed decisions before
                  seeking professional help.
                </p>
              </div>
            </div>
          </div>
        </section>


        <section
          id="contact"
          className="glass-card flex flex-col items-center gap-8 overflow-hidden rounded-3xl px-8 py-12 text-center lg:flex-row lg:justify-between lg:text-left"
        >
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold text-white md:text-4xl">
              Ready to understand your symptoms instantly?
            </h2>
            <p className="text-lg text-muted">
              Upload an image or describe how you feel — HERB will analyze
              it, suggest possible conditions, and show specialized hospitals
              near you.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/map" className="btn-primary">
              Find the right care near me
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Page;
