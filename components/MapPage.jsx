"use client";

import MapComp from "@/components/MapComp";
import Link from "next/link";
import React from "react";
import { useSearchParams } from "next/navigation";
import { useDiagnosisResponse } from "@/lib/diagnosisResponse";
import { deriveSpecialtySearch } from "@/lib/specialityHospitals";

const DEFAULT_MAP_CONFIG = {
  keyword: "",
  placeType: "hospital",
  title: "Nearby hospitals and clinics",
  highlight: "Select a marker or list item for details.",
};

const MapPage = () => {
  const searchParams = useSearchParams();

  const diagnosisResponse = useDiagnosisResponse();
  const analysis = diagnosisResponse?.analysis;
  const conditions = Array.isArray(analysis?.conditions)
    ? analysis.conditions
    : [];

  const queryOverrides = {
    keyword: searchParams.get("keyword") ?? "",
    placeType: searchParams.get("placeType") ?? "",
    title: searchParams.get("title") ?? "",
    highlight: searchParams.get("highlight") ?? "",
    hint: searchParams.get("whichSpecialityHospitalToGo")?.toLowerCase() ?? "",
  };

  const specialtyHint =
    (analysis?.whichSpecialityHospitalToGo ?? "").toLowerCase() ||
    queryOverrides.hint;

  const derivedSpecialty =
    !conditions.length && !specialtyHint
      ? null
      : deriveSpecialtySearch(conditions, specialtyHint);

  const {
    keyword: overrideKeyword,
    placeType: overridePlaceType,
    title: overrideTitle,
    highlight: overrideHighlight,
  } = queryOverrides;

  const mapConfig =
    overrideKeyword || overridePlaceType || overrideTitle || overrideHighlight
      ? {
          keyword: overrideKeyword || DEFAULT_MAP_CONFIG.keyword,
          placeType: overridePlaceType || DEFAULT_MAP_CONFIG.placeType,
          title: overrideTitle || DEFAULT_MAP_CONFIG.title,
          highlight: overrideHighlight || DEFAULT_MAP_CONFIG.highlight,
        }
      : derivedSpecialty
        ? {
            keyword: derivedSpecialty.keyword || DEFAULT_MAP_CONFIG.keyword,
            placeType:
              derivedSpecialty.placeType || DEFAULT_MAP_CONFIG.placeType,
            title: derivedSpecialty.title || DEFAULT_MAP_CONFIG.title,
            highlight: derivedSpecialty.highlight || DEFAULT_MAP_CONFIG.highlight,
          }
        : DEFAULT_MAP_CONFIG;

  return (
    <main className="py-10">
      <div className="page-shell space-y-8">
        <header className="space-y-3">
          <h1 className="text-3xl font-semibold text-slate-100 md:text-4xl">
            Nearby care
          </h1>
          <p className="text-sm text-muted md:text-base">
            Find relevant clinics based on your location and latest diagnosis.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/diagnosis" className="btn-secondary">
              Back to diagnosis
            </Link>
            <Link href="/" className="btn-secondary">
              Home
            </Link>
          </div>
        </header>

        <MapComp
          keyword={mapConfig.keyword}
          placeType={mapConfig.placeType}
          title={mapConfig.title}
          highlight={mapConfig.highlight}
        />

        <div className="glass-card p-4 text-sm text-muted">
          This tool is informational only. In emergencies, call 911 immediately.
        </div>
      </div>
    </main>
  );
};

export default MapPage;
