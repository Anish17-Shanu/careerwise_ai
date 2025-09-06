import React from "react";

export default function ReadinessFeedback({ data }) {
  if (!data) return null;

  const overallScore = data.readiness_score ?? 0;
  const breakdown = data.recommendations || [];

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-xl shadow animate-fade-in">
      <h2 className="text-3xl font-bold mb-2 text-center text-gray-900">
        Overall Readiness
      </h2>
      <div className="w-full bg-gray-200 rounded-full h-6 mb-4 overflow-hidden">
        <div
          className="bg-purple-600 h-6 rounded-full transition-all duration-1000"
          style={{ width: `${overallScore}%` }}
        ></div>
      </div>
      <p className="text-center text-gray-700 mb-6">
        {data.readiness_feedback || "No feedback available."}
      </p>

      {breakdown.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {breakdown.map((career) => {
            const details = career.details || {};
            return (
              <div
                key={career.career_path}
                className="p-4 bg-purple-50 rounded-xl border border-purple-200 shadow hover:shadow-lg transition"
              >
                <h3 className="font-semibold text-purple-800 text-lg mb-2 flex justify-between items-center">
                  {career.career_path}
                  <span className="text-gray-700">{career.score ?? 0}%</span>
                </h3>
                {["Skills", "Education", "Experience"].map((key) => (
                  <div key={key} className="mb-1">
                    <p className="text-gray-700 text-sm flex justify-between">
                      <span>{key}</span>
                      <span>{details[key]?.points ?? 0} pts</span>
                    </p>
                    {details[key]?.advice && (
                      <p className="text-gray-500 text-xs">{details[key].advice}</p>
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
