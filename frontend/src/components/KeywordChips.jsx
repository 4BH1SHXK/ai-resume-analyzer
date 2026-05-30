export default function KeywordChips({ title, keywords, variant = "matched" }) {
  const isMatched = variant === "matched";

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </h3>
      {keywords?.length ? (
        <div className="flex flex-wrap gap-2">
          {keywords.map((keyword) => (
            <span
              key={keyword}
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                isMatched
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {keyword}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500">None identified.</p>
      )}
    </div>
  );
}
