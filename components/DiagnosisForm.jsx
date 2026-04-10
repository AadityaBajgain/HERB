"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  clearDiagnosisResponse,
  setDiagnosisResponse,
} from "@/lib/diagnosisResponse";
import { deriveSpecialtySearch } from "@/lib/specialityHospitals";

const formatSize = (size) => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const toBase64 = async (file) => {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunkSize = 0x8000;

  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary);
};

const normalizeDiagnosisPayload = (payload) => {
  if (!payload || typeof payload !== "object") return { analysis: null };
  if (payload.analysis && typeof payload.analysis === "object") return payload;
  return { analysis: payload };
};

const DiagnosisForm = () => {
  const [symptoms, setSymptoms] = useState("");
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    const nextPreviews = files.map((file) => ({
      id: file.name + file.lastModified,
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
    }));

    setPreviews((prev) => {
      prev.forEach((preview) => URL.revokeObjectURL(preview.url));
      return nextPreviews;
    });

    return () => {
      nextPreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [files]);

  const handleFilesChange = useCallback((event) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    if (!selectedFiles.length) return;

    setFiles((prev) => {
      const merged = [...prev];
      selectedFiles.forEach((file) => {
        const alreadyAdded = merged.some(
          (existing) =>
            existing.name === file.name &&
            existing.lastModified === file.lastModified
        );
        if (!alreadyAdded) merged.push(file);
      });
      return merged;
    });

    event.target.value = "";
  }, []);

  const handleRemoveFile = useCallback((id) => {
    setFiles((prev) =>
      prev.filter((file) => file.name + file.lastModified !== id)
    );
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setError("");

      const trimmed = symptoms.trim();
      if (!trimmed) {
        setError("Please describe your symptoms before submitting.");
        return;
      }

      try {
        setIsSubmitting(true);
        setResult(null);
        clearDiagnosisResponse();

        const images = await Promise.all(
          files.map(async (file) => ({
            mimeType: file.type || "image/jpeg",
            data: await toBase64(file),
          }))
        );

        const response = await fetch("/api/gemini", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            symptoms: trimmed,
            images,
          }),
        });

        if (response.status === 429) {
          const payload = await response.json().catch(() => null);
          setError(
            payload?.error ??
              "Rate limit reached. Please wait a moment and try again."
          );
          return;
        }

        if (!response.ok) {
          const payload = await response.json().catch(() => null);
          throw new Error(
            payload?.error ??
              "We couldn’t reach HERB right now. Please try again."
          );
        }

        const payload = await response.json();
        const normalizedPayload = normalizeDiagnosisPayload(payload);
        setResult(normalizedPayload);
        setDiagnosisResponse(normalizedPayload);
      } catch (submitError) {
        console.error(submitError);
        setError(
          submitError?.message ??
            "Something went wrong while analyzing your symptoms."
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [files, symptoms]
  );

  const hasImages = useMemo(() => previews.length > 0, [previews.length]);

  const analysis = result?.analysis;
  const summary = analysis?.summary ?? analysis?.message ?? "";
  const conditions = useMemo(
    () => (Array.isArray(analysis?.conditions) ? analysis.conditions : []),
    [analysis?.conditions]
  );

  const specialtySearch = useMemo(
    () =>
      deriveSpecialtySearch(
        conditions,
        analysis?.whichSpecialityHospitalToGo ?? ""
      ),
    [conditions, analysis?.whichSpecialityHospitalToGo]
  );

  const specialtySearchQuery = useMemo(() => {
    if (!analysis || !specialtySearch) return "";

    const params = new URLSearchParams();
    if (specialtySearch.keyword) params.set("keyword", specialtySearch.keyword);
    if (specialtySearch.placeType)
      params.set("placeType", specialtySearch.placeType);
    if (specialtySearch.title) params.set("title", specialtySearch.title);
    if (specialtySearch.highlight)
      params.set("highlight", specialtySearch.highlight);

    if (analysis.whichSpecialityHospitalToGo) {
      params.set(
        "whichSpecialityHospitalToGo",
        analysis.whichSpecialityHospitalToGo
      );
    }

    return params.toString();
  }, [analysis, specialtySearch]);

  const specialtyMapHref = specialtySearchQuery
    ? `/map?${specialtySearchQuery}`
    : "/map";

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="glass-card space-y-6 p-6">
        <div className="space-y-2">
          <label
            htmlFor="symptoms"
            className="block text-sm font-medium text-slate-100"
          >
            Symptoms
          </label>
          <textarea
            id="symptoms"
            className="surface-muted w-full resize-none rounded-lg border border-slate-700 p-3 text-sm text-slate-100 outline-none focus:border-sky-400"
            placeholder="Example: I developed an itchy red patch on my forearm yesterday."
            rows={5}
            value={symptoms}
            onChange={(event) => setSymptoms(event.target.value)}
          />
        </div>

        <div className="space-y-3">
          <label
            htmlFor="diagnosis-photos"
            className="block text-sm font-medium text-slate-100"
          >
            Images (optional)
          </label>

          <label
            htmlFor="diagnosis-photos"
            className="block cursor-pointer rounded-lg border border-dashed border-slate-600 p-4 text-sm text-muted hover:border-slate-500"
          >
            Upload one or more images
            <input
              id="diagnosis-photos"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFilesChange}
              className="sr-only"
            />
          </label>

          {hasImages && (
            <ul className="grid gap-3 sm:grid-cols-2">
              {previews.map((preview) => (
                <li
                  key={preview.id}
                  className="surface-muted rounded-lg border border-slate-700 p-3"
                >
                  <div className="relative h-32 w-full overflow-hidden rounded-md border border-slate-700">
                    <Image
                      src={preview.url}
                      alt={`Uploaded symptom photo ${preview.name}`}
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 300px"
                    />
                  </div>
                  <div className="mt-2 text-xs text-muted">
                    <p className="truncate text-slate-200">{preview.name}</p>
                    <p>{formatSize(preview.size)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(preview.id)}
                    className="mt-2 text-xs text-sky-300 hover:text-sky-200"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {error && (
          <div className="rounded-lg border border-rose-500/50 bg-rose-500/10 p-3 text-sm text-rose-200">
            {error}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? "Analyzing..." : "Analyze symptoms"}
          </button>
          <p className="text-xs text-muted">
            HERB is not a replacement for professional medical advice.
          </p>
        </div>
      </form>

      {analysis && (
        <section className="glass-card space-y-5 p-6">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-slate-100">Results</h2>
            {summary && <p className="text-sm text-muted">{summary}</p>}
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="surface-muted rounded-lg border border-slate-700 p-4 text-sm">
              <p className="font-medium text-slate-100">Recommended care level</p>
              <p className="mt-1 text-muted">
                {analysis.recommendedCareLevel || "Not specified"}
              </p>
            </div>

            <div className="surface-muted rounded-lg border border-slate-700 p-4 text-sm">
              <p className="font-medium text-slate-100">Follow up</p>
              <p className="mt-1 text-muted">
                {analysis.followUp || "No follow-up guidance provided."}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-slate-100">
              Possible conditions
            </h3>

            {conditions.length ? (
              <ul className="space-y-2">
                {conditions.map((condition, index) => (
                  <li
                    key={`${condition.name}-${index}`}
                    className="surface-muted rounded-lg border border-slate-700 p-4"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-slate-100">
                        {condition.name || "Condition"}
                      </p>
                      <span className="text-xs text-sky-300">
                        {condition.probability || "Unknown"}
                      </span>
                    </div>
                    {condition.description && (
                      <p className="mt-1 text-xs text-muted">
                        {condition.description}
                      </p>
                    )}
                    {Array.isArray(condition.recommendedActions) &&
                      condition.recommendedActions.length > 0 && (
                        <ul className="mt-2 space-y-1 text-xs text-muted">
                          {condition.recommendedActions.map((action, i) => (
                            <li key={`${condition.name}-action-${i}`}>{action}</li>
                          ))}
                        </ul>
                      )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted">
                No specific conditions were highlighted.
              </p>
            )}
          </div>

          {specialtySearch && (
            <div className="pt-1">
              <Link href={specialtyMapHref} className="btn-secondary">
                View matching nearby specialists
              </Link>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default DiagnosisForm;
