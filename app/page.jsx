import HeroSection from "@/components/HeroSection";
import Link from "next/link";
import React from "react";

const features = [
  {
    title: "Actionable insights",
    badge: "Digestible reports",
    description:
      "IDIDIDIDID: Herb translates your vitals, sleep, and mood trends into simple nudges you can act on today.",
  },
  {
    title: "Smart triage",
    badge: "AI guidance",
    description:
      "We flag concerns early and route you to virtual or in-person care before things escalate.",
  },
  {
    title: "Care team collaboration",
    badge: "Shared plans",
    description:
      "Loop in family or clinicians with live dashboards so everyone stays aligned on your progress.",
  },
  {
    title: "Progress you can feel",
    badge: "Habit loops",
    description:
      "Stack healthy routines with weekly challenges that adapt to your goals and lifestyle.",
  },
];

const supportSteps = [
  {
    title: "Tell Herb how you're doing",
    detail: "Check-in takes less than a minute—use text, voice, or quick taps in the app.",
  },
  {
    title: "Get a tailored plan instantly",
    detail:
      "We combine your feedback with clinical guidelines to serve up clear next steps and reminders.",
  },
  {
    title: "Chat with humans anytime",
    detail:
      "Licensed clinicians are a tap away when you need deeper support, reassurance, or referrals.",
  },
];

const Page = () => {
  return (
    <main className="py-16">
      <div className="page-shell space-y-24">
        <HeroSection />

        <section id="features" className="space-y-12">
          <div className="max-w-2xl space-y-4">
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-200">
              Built for everyday care
            </span>
            <h2 className="text-3xl font-semibold text-white md:text-4xl">
              Stay ahead of health surprises
            </h2>
            <p className="text-lg text-muted">
              Herb empowers you to understand your body, take confident action, and keep your care team in sync.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {features.map(({ title, description, badge }) => (
              <article key={title} className="glass-card relative overflow-hidden rounded-3xl p-6 transition duration-200 hover:-translate-y-1">
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
              How we support you
            </span>
            <h2 className="text-3xl font-semibold text-white md:text-4xl">
              You’re never alone on the journey
            </h2>
            <p className="text-lg text-muted">
              Herb blends empathetic humans with proactive AI so you can focus on feeling better, not figuring out what to do next.
            </p>

            <ul className="space-y-5">
              {supportSteps.map(({ title, detail }) => (
                <li key={title} className="rounded-3xl border border-white/5 bg-white/5 p-5">
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
                  Guided routines
                </p>
                <h3 className="mt-4 text-2xl font-semibold text-white">
                  Small shifts, lasting change
                </h3>
                <p className="mt-4 text-sm text-muted">
                  We stack micro-habits into friendly daily rituals. Think hydration prompts, stretch breaks, and mood resets designed around your schedule.
                </p>
                <ul className="mt-6 space-y-4">
                  <li className="flex items-start gap-3 text-sm text-muted">
                    <span className="mt-1 h-2 w-2 rounded-full bg-sky-400" />
                    Morning breathwork with heart rate monitoring.
                  </li>
                  <li className="flex items-start gap-3 text-sm text-muted">
                    <span className="mt-1 h-2 w-2 rounded-full bg-purple-400" />
                    Midday mobility checks grounded in physiotherapy.
                  </li>
                  <li className="flex items-start gap-3 text-sm text-muted">
                    <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                    Evening reflections that adapt to your mood.
                  </li>
                </ul>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                  Community pulse
                </p>
                <p className="mt-3 text-sm text-muted">
                  Join thousands of members who keep each other accountable with uplifting check-ins and peer-led challenges.
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
              Ready to feel supported every day?
            </h2>
            <p className="text-lg text-muted">
              We’ll match you with the right routines, care team, and nearby resources so you can focus on feeling your best.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/map" className="btn-primary">
              Find care near me
            </Link>
            <Link href="mailto:hello@herb.health" className="btn-secondary">
              Talk to our team
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
};
export default Page;
