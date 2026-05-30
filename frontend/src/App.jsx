import { useState } from "react";
import { analyzeResume } from "./api";
import ResultsDashboard from "./components/ResultsDashboard";
import ResumeUpload from "./components/ResumeUpload";

const SAMPLE_JD = `We are hiring a Software Engineer Intern.

Requirements:
- Python, JavaScript, or Java
- REST APIs and Git
- SQL databases
- Strong problem-solving and communication skills

Nice to have: React, FastAPI, cloud (AWS/GCP), internships or personal projects.`;

export default function App() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {
    setError("");
    setResult(null);

    if (!file) {
      setError("Please upload your resume PDF.");
      return;
    }
    if (!jobDescription.trim()) {
      setError("Please paste the job description.");
      return;
    }

    setLoading(true);
    try {
      const response = await analyzeResume(file, jobDescription);
      setResult(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              AI Resume Analyzer
            </h1>
            <p className="text-sm text-slate-500">
              ATS score · skill gaps · improved bullet points
            </p>
          </div>
          <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
            Powered by Gemini
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-800">
              1. Upload Resume
            </h2>
            <ResumeUpload
              file={file}
              onFileChange={setFile}
              disabled={loading}
            />
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800">
                2. Job Description
              </h2>
              <button
                type="button"
                onClick={() => setJobDescription(SAMPLE_JD)}
                className="text-xs font-medium text-brand-600 hover:text-brand-700"
              >
                Load sample JD
              </button>
            </div>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job description from Naukri, LinkedIn, etc."
              rows={12}
              disabled={loading}
              className="w-full resize-none rounded-2xl border border-slate-300 bg-white p-4 text-sm text-slate-800 shadow-sm outline-none ring-brand-500 focus:ring-2 disabled:opacity-60"
            />
          </section>
        </div>

        <div className="mt-6 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={loading}
            className="rounded-xl bg-brand-600 px-8 py-3 font-semibold text-white shadow-lg shadow-brand-600/30 transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Analyzing with AI…" : "Analyze Resume"}
          </button>
          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
              {error}
            </p>
          )}
        </div>

        {result && (
          <section className="mt-10">
            <h2 className="mb-4 text-xl font-bold text-slate-900">
              Analysis Results
            </h2>
            <ResultsDashboard data={result} />
          </section>
        )}
      </main>

      <footer className="mt-12 border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        Built for students · FastAPI + React + Google Gemini 1.5 Flash
      </footer>
    </div>
  );
}
