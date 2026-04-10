import DiagnosisForm from "@/components/DiagnosisForm";
import Link from "next/link";
import React from "react";

const DiagnosisPage = () => {
  return (
    <main className="py-10">
      <div className="page-shell space-y-8">
        <header className="space-y-3">
          <h1 className="text-3xl font-semibold text-slate-100 md:text-4xl">
            Symptom diagnosis
          </h1>
          <p className="max-w-3xl text-sm text-muted md:text-base">
            Add symptoms, attach images if useful, and get a structured summary
            with possible conditions and recommended care level.
          </p>
          <Link href="/" className="inline-flex text-sm text-sky-300 hover:text-sky-200">
            Back to home
          </Link>
        </header>

        <DiagnosisForm />
      </div>
    </main>
  );
};

export default DiagnosisPage;
