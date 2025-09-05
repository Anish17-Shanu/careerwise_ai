export default function ScoreBreakdown({ breakdown }) {
  if (!breakdown || Object.keys(breakdown).length === 0) return null;

  return (
    <div className="mt-6 bg-white p-4 rounded shadow space-y-2">
      <h3 className="font-bold text-lg">Readiness Breakdown</h3>
      {Object.entries(breakdown).map(([component, info]) => (
        <div key={component} className="p-2 border rounded">
          
          {["Skills", "Education", "Experience"].map((k) => (
            <p key={k} className="text-sm text-gray-600">
              {k}: {info[k]?.points ?? "N/A"} points — {info[k]?.advice ?? "No advice available"}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}
