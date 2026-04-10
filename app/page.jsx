import HeroSection from "@/components/HeroSection";
import Link from "next/link";
import React from "react";

const keyPoints = [
  "Symptom + image analysis in one flow",
  "Structured response with possible conditions",
  "One-click transition to nearby specialists",
];

const Page = () => {
  return (
    <main className="py-10">
      <div className="page-shell space-y-10">
        <HeroSection />

        <section className="glass-card space-y-5 p-6">
          <h2 className="text-xl font-semibold text-slate-100">
            What you get
          </h2>
          <ul className="space-y-2 text-sm text-muted">
            {keyPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/diagnosis" className="btn-primary">
              Run a diagnosis
            </Link>
            <Link href="/map" className="btn-secondary">
              Browse nearby care
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Page;
