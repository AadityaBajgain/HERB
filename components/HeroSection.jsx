import Link from "next/link";
import React from "react";

const HeroSection = () => {
  return (
    <section className="grid gap-8 py-6 md:grid-cols-[1.2fr_0.8fr] md:items-start">
      <div className="space-y-5">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-sky-300">
          AI Health Assistant
        </p>
        <h1 className="text-3xl font-semibold leading-tight text-slate-100 md:text-4xl">
          Fast symptom checks with clear next steps.
        </h1>
        <p className="max-w-2xl text-sm text-muted md:text-base">
          Describe symptoms, optionally upload an image, and get a structured
          health summary with suggested care level and nearby clinics.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/diagnosis" className="btn-primary">
            Start diagnosis
          </Link>
          <Link href="/map" className="btn-secondary">
            Open care map
          </Link>
        </div>
      </div>

      <div className="glass-card space-y-3 p-5">
        <h2 className="text-sm font-semibold text-slate-100">How it works</h2>
        <ul className="space-y-2 text-sm text-muted">
          <li>1. Enter symptoms and upload photos if needed.</li>
          <li>2. HERB analyzes text and image context.</li>
          <li>3. Review conditions, care level, and nearest care options.</li>
        </ul>
      </div>
    </section>
  );
};

export default HeroSection;
