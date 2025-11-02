import MapComp from "@/components/MapComp";
import Link from "next/link";
import React from "react";

const safetyTips = [
  {
    title: "Call ahead",
    detail:
      "Availability changes quickly. Confirm emergency room capacity or appointment slots before you travel.",
  },
  {
    title: "Bring medical history",
    detail:
      "Have recent notes, medications, and allergies on hand so the care team can act quickly.",
  },
  {
    title: "Lean on Herb",
    detail:
      "Ping our clinicians through the app for a quick triage while you’re en route or waiting to be seen.",
  },
];

const DEFAULT_MAP_CONFIG = {
  keyword: "",
  placeType: "hospital",
  title: "Hospitals & clinics near you",
  highlight: "Tap a marker or list item to see contact details.",
};

const toSingleValue = (value, fallback = "") => {
  if (Array.isArray(value)) return value[0] ?? fallback;
  return value ?? fallback;
};

const MapPage = ({ searchParams = {} }) => {
  const specialtyKeyword = toSingleValue(searchParams.keyword, "");
  const specialtyPlaceType = toSingleValue(
    searchParams.placeType,
    DEFAULT_MAP_CONFIG.placeType
  );
  const specialtyTitle = toSingleValue(
    searchParams.title,
    DEFAULT_MAP_CONFIG.title
  );
  const specialtyHighlight = toSingleValue(
    searchParams.highlight,
    DEFAULT_MAP_CONFIG.highlight
  );

  const mapConfig = {
    keyword: specialtyKeyword || DEFAULT_MAP_CONFIG.keyword,
    placeType: specialtyPlaceType || DEFAULT_MAP_CONFIG.placeType,
    title: specialtyTitle || DEFAULT_MAP_CONFIG.title,
    highlight: specialtyHighlight || DEFAULT_MAP_CONFIG.highlight,
  };

  const isSpecialtySearch =
    Boolean(searchParams.keyword) ||
    Boolean(searchParams.placeType) ||
    Boolean(searchParams.title) ||
    Boolean(searchParams.highlight);

  const pageDescription = isSpecialtySearch
    ? `We’re highlighting nearby care tailored to your recent results: ${mapConfig.title}.`
    : "We use your location to surface nearby emergency rooms, urgent care, and trusted partners so you can get help fast.";

  return (
    <main className="py-16">
      <div className="page-shell space-y-16">
        <div className="space-y-4 text-center lg:text-left">
          <span className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-200">
            Care navigator
          </span>
          <h1 className="text-4xl font-semibold text-white md:text-5xl">
            Hospitals and clinics near you
          </h1>
          <p className="text-lg text-muted">
            {pageDescription}
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <MapComp
            keyword={mapConfig.keyword}
            placeType={mapConfig.placeType}
            title={mapConfig.title}
            highlight={mapConfig.highlight}
          />

          <aside className="glass-card flex h-full flex-col rounded-3xl p-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">
                Before you go
              </h2>
              <p className="text-sm text-muted">
                Herb stays with you the entire way. Use these tips to make sure you’re prepared and confident when you arrive.
              </p>
              {isSpecialtySearch && (
                <div className="rounded-3xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm text-emerald-100">
                  Showing nearby options focused on:{" "}
                  <span className="font-semibold text-white">
                    {mapConfig.title}
                  </span>
                </div>
              )}
            </div>

            <ul className="mt-8 space-y-5">
              {safetyTips.map(({ title, detail }) => (
                <li key={title} className="rounded-3xl border border-white/5 bg-white/5 p-5">
                  <h3 className="text-lg font-semibold text-white">{title}</h3>
                  <p className="mt-2 text-sm text-muted">{detail}</p>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-8">
              <div className="rounded-3xl border border-emerald-500/40 bg-emerald-500/10 p-6 text-sm text-emerald-100">
                In an emergency, call <span className="font-semibold text-white">911</span> or your local emergency number immediately.
              </div>
            </div>
          </aside>
        </div>

        <div className="glass-card flex flex-col items-center gap-6 rounded-3xl px-8 py-10 text-center lg:flex-row lg:justify-between lg:text-left">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-white">
              Need a different location?
            </h2>
            <p className="text-sm text-muted">
              Update your home base inside the Herb app to see recommendations wherever you are.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/" className="btn-secondary">
              Back to dashboard
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MapPage;
