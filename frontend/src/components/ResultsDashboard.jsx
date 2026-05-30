import BulletComparison from "./BulletComparison";
import KeywordChips from "./KeywordChips";
import ScoreCircle from "./ScoreCircle";

export default function ResultsDashboard({ data }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <ScoreCircle score={data.ats_score} reason={data.score_reason} />
        <div className="lg:col-span-2">
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <h3 className="mb-3 text-lg font-semibold text-slate-800">
              Top Recommendations
            </h3>
            <ul className="space-y-2">
              {data.top_feedback?.map((tip, index) => (
                <li
                  key={index}
                  className="flex gap-2 rounded-lg bg-brand-50 px-3 py-2 text-sm text-slate-700"
                >
                  <span className="font-bold text-brand-600">{index + 1}.</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <KeywordChips
          title="Matched Keywords"
          keywords={data.matched_keywords}
          variant="matched"
        />
        <KeywordChips
          title="Missing Keywords"
          keywords={data.missing_keywords}
          variant="missing"
        />
      </div>

      <BulletComparison
        weakBullets={data.weak_bullets}
        improvedBullets={data.improved_bullets}
      />
    </div>
  );
}
