import { useCallback, useState } from "react";

export default function ResumeUpload({ file, onFileChange, disabled }) {
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = useCallback(
    (event) => {
      event.preventDefault();
      setDragOver(false);
      if (disabled) return;

      const dropped = event.dataTransfer.files?.[0];
      if (dropped?.type === "application/pdf") {
        onFileChange(dropped);
      }
    },
    [disabled, onFileChange]
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      className={`rounded-2xl border-2 border-dashed p-8 text-center transition ${
        dragOver
          ? "border-brand-500 bg-brand-50"
          : "border-slate-300 bg-white hover:border-brand-500"
      } ${disabled ? "opacity-60" : ""}`}
    >
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-700">
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
      </div>
      <p className="font-medium text-slate-800">Drag & drop your resume PDF</p>
      <p className="mt-1 text-sm text-slate-500">or click to browse (max 5 MB)</p>

      <label className="mt-4 inline-block cursor-pointer rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
        Choose PDF
        <input
          type="file"
          accept="application/pdf"
          className="hidden"
          disabled={disabled}
          onChange={(e) => onFileChange(e.target.files?.[0] || null)}
        />
      </label>

      {file && (
        <p className="mt-3 text-sm text-slate-600">
          Selected: <span className="font-medium">{file.name}</span>
        </p>
      )}
    </div>
  );
}
