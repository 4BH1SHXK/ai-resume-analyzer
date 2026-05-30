export default function BulletComparison({ weakBullets, improvedBullets }) {
  const pairs = weakBullets.map((weak, index) => ({
    weak,
    improved: improvedBullets[index] || "",
  }));

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <h3 className="mb-4 text-lg font-semibold text-slate-800">
        Bullet Point Improvements
      </h3>
      <div className="space-y-4">
        {pairs.map((pair, index) => (
          <div
            key={index}
            className="grid gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 md:grid-cols-2"
          >
            <div>
              <p className="mb-1 text-xs font-semibold uppercase text-red-500">
                Before
              </p>
              <p className="text-sm text-slate-700">{pair.weak}</p>
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold uppercase text-green-600">
                After
              </p>
              <p className="text-sm text-slate-700">{pair.improved}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
