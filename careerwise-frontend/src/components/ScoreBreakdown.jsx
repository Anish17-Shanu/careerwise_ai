import React from "react";

export default function ScoreBreakdown({ breakdown }) {
  if (!breakdown || Object.keys(breakdown).length === 0) return null;

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-xl shadow space-y-4 animate-fade-in">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Readiness Breakdown</h3>

      {Object.entries(breakdown).map(([career, info]) => (
        <div
          key={career}
          className="p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm"
        >
          <h4 className="font-semibold text-purple-700 mb-2 flex justify-between">
            {career}
            {info.Weighted_score !== undefined && (
              <span className="text-gray-700">{info.Weighted_score}%</span>
            )}
          </h4>

          {["Skills", "Education", "Experience"].map((k) => (
            <div key={k} className="mb-2">
              <p className="text-sm text-gray-700 flex justify-between">
                <span>{k}:</span>
                <span>{info[k]?.points ?? 0} pts</span>
              </p>
              {info[k]?.advice && (
                <p className="text-xs text-gray-500">{info[k].advice}</p>
              )}
            </div>
          ))}

          {/* Animated progress bar for Weighted_score */}
          {info.Weighted_score !== undefined && (
            <div className="w-full bg-gray-200 rounded-full h-4 mt-2 overflow-hidden">
              <div
                className="bg-purple-600 h-4 rounded-full transition-all duration-1000"
                style={{ width: `${info.Weighted_score}%` }}
              ></div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
