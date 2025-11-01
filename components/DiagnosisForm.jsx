"use client";

import Image from "next/image";
import React, { useCallback, useEffect, useMemo, useState } from "react";

const noop = () => {};

const DiagnosisForm = ({
  onSubmit = noop,
  submittingText = "Analyzing symptoms…",
  ctaLabel = "Analyze with Herb",
}) => {
  const [symptoms, setSymptoms] = useState("");
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

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

  const formattedSize = useCallback((size) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }, []);

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

  const resetForm = useCallback(() => {
    setSymptoms("");
    setFiles([]);
    setError("");
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setError("");

      const trimmed = symptoms.trim();
      if (!trimmed) {
        setError("Describe your symptoms so Herb knows where to start.");
        return;
      }

      try {
        setIsSubmitting(true);
        await onSubmit({ symptoms: trimmed, files });
        resetForm();
      } catch (submitError) {
        console.error(submitError);
        setError(
          submitError?.message ??
            "We couldn’t send your symptoms. Please try again."
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [files, onSubmit, resetForm, symptoms]
  );

  const hasImages = useMemo(() => previews.length > 0, [previews.length]);

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card space-y-8 rounded-3xl p-8"
    >
      <div className="space-y-3">
        <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-200">
            1
          </span>
          Tell Herb how you feel
        </div>
        <label className="block text-lg font-semibold text-white">
          Describe your symptoms
        </label>
        <p className="text-sm text-muted">
          Include when symptoms started, pain levels, recent changes, or any
          relevant history. Herb combines your description with visual cues for
          precise analysis.
        </p>
        <textarea
          className="mt-4 w-full resize-none rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm text-white shadow-inner outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/50"
          placeholder="Example: Two days ago I noticed a red rash on my forearm that’s getting itchy and warm. It started after a hike…"
          rows={6}
          value={symptoms}
          onChange={(event) => setSymptoms(event.target.value)}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-sky-200">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-sky-500/20 text-sky-200">
            2
          </span>
          Add photos (optional)
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
                Drag & drop or click to upload images
              </p>
              <p className="text-xs text-muted">
                Close-ups work best. JPG, PNG, or HEIC up to 10 MB each.
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
                  <p>{formattedSize(preview.size)}</p>
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
          {isSubmitting ? submittingText : ctaLabel}
        </button>
        <p className="text-xs text-muted">
          Herb is an AI health assistant, not a doctor. If you’re in a medical
          emergency, call your local emergency number immediately.
        </p>
      </div>
    </form>
  );
};

export default DiagnosisForm;
