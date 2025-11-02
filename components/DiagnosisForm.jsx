"use client";

import Image from "next/image";
import React, { useCallback, useEffect, useMemo, useState } from "react";

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

const DiagnosisForm = () => {
  const [symptoms, setSymptoms] = useState("");
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  // Generate image previews
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
        if (!response.ok) {
          const payload = await response.json().catch(() => null);
          throw new Error(
            payload?.error ??
              "We couldn’t reach HealthAI right now. Please try again."
          );
        }

        const payload = await response.json();
        setResult(payload);
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
  const conditions = Array.isArray(analysis?.conditions)
    ? analysis.conditions
    : [];

  return (
    <div className="space-y-8">
      <form
        onSubmit={handleSubmit}
        className="glass-card space-y-8 rounded-3xl p-8"
      >
        {/* STEP 1 */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-200">
              1
            </span>
            Describe your symptoms
          </div>
          <label className="block text-lg font-semibold text-white">
            What are you experiencing?
          </label>
          <p className="text-sm text-muted">
            Mention when it started, pain level, visible changes, or any recent
            triggers. HealthAI uses this along with image analysis to identify
            possible causes.
          </p>
          <textarea
            className="mt-4 w-full resize-none rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm text-white shadow-inner outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/50"
            placeholder="Example: Two days ago I noticed a red, itchy rash on my forearm after hiking."
            rows={6}
            value={symptoms}
            onChange={(event) => setSymptoms(event.target.value)}
          />
        </div>

        {/* STEP 2 */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-sky-200">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-sky-500/20 text-sky-200">
              2
            </span>
            Upload image (optional)
          </div>
          <label
            htmlFor="diagnosis-photos"
            className="group flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-white/20 bg-white/5 p-8 text-center transition hover:border-emerald-300/40 hover:bg-emerald-500/5"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950/60 text-2xl text-emerald-300 shadow-inner">
                📷
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-white">
                  Drag & drop or click to upload
                </p>
                <p className="text-xs text-muted">
                  JPG, PNG, or HEIC up to 10 MB each. Close-ups work best.
                </p>
              </div>
              <input
                id="diagnosis-photos"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFilesChange}
                className="sr-only"
              />
            </div>
          </label>

          {hasImages && (
            <ul className="grid gap-4 sm:grid-cols-2">
              {previews.map((preview) => (
                <li
                  key={preview.id}
                  className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/60 p-4"
                >
                  <div className="relative h-40 w-full overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                    <Image
                      src={preview.url}
                      alt={`Uploaded symptom photo ${preview.name}`}
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 300px"
                    />
                  </div>
                  <div className="mt-3 space-y-1 text-xs text-muted">
                    <p className="truncate text-white">{preview.name}</p>
                    <p>{formatSize(preview.size)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(preview.id)}
                    className="btn-secondary absolute right-4 top-4 w-auto px-3 py-1 text-xs"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        
        <div className="space-y-3">
          {error && (
            <div className="rounded-3xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-100">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full justify-center px-8 py-4 text-base"
          >
            {isSubmitting ? "Analyzing..." : "Analyze with HealthAI"}
          </button>
          <p className="text-xs text-muted">
            HealthAI is an AI health assistant, not a doctor. If you’re in a
            medical emergency, call your local emergency number immediately.
          </p>
        </div>
      </form>

      {analysis && (
        <section className="glass-card space-y-6 rounded-3xl border border-emerald-500/40 bg-emerald-500/5 p-8 text-white">
          <div>
            <h2 className="text-2xl font-semibold">HealthAI findings</h2>
            <p className="mt-2 text-sm text-emerald-100/80">
              These insights come directly from the most recent analysis.
            </p>
          </div>
          {analysis.summary && (
            <p className="text-sm text-emerald-50/90">{analysis.summary}</p>
          )}
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm">
              <h3 className="text-sm font-semibold text-white">
                Recommended care level
              </h3>
              <p className="mt-1 text-emerald-100">
                {analysis.recommendedCareLevel || "Not specified"}
              </p>
            </div>
            {analysis.followUp && (
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-emerald-100">
                <h3 className="text-sm font-semibold text-white">Next steps</h3>
                <p className="mt-1">{analysis.followUp}</p>
              </div>
            )}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-200">
                Possible conditions
              </h3>
              {conditions.length ? (
                <ul className="space-y-3">
                  {conditions.map((condition, index) => (
                    <li
                      key={`${condition.name}-${index}`}
                      className="rounded-2xl border border-white/10 bg-black/30 p-4"
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-base font-semibold text-white">
                          {condition.name || "Condition"}
                        </p>
                        <span className="text-xs uppercase tracking-[0.2em] text-emerald-200">
                          {condition.probability || "Unknown"}
                        </span>
                      </div>
                      {condition.description && (
                        <p className="mt-2 text-sm text-emerald-100/80">
                          {condition.description}
                        </p>
                      )}
                      {Array.isArray(condition.recommendedActions) &&
                        condition.recommendedActions.length > 0 && (
                          <div className="mt-3 space-y-2 text-sm text-emerald-100">
                            <p className="font-semibold text-white">
                              Suggested actions
                            </p>
                            <ul className="list-disc space-y-1 pl-5 text-emerald-50/90">
                              {condition.recommendedActions.map((action, i) => (
                                <li key={`${condition.name}-action-${i}`}>
                                  {action}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-emerald-100/80">
                  No specific conditions were highlighted. Try adding more
                  detail or images for a richer analysis.
                </p>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default DiagnosisForm;
