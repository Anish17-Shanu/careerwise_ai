import React from "react";
import { FaCopy } from "react-icons/fa";

export default function UploadResult({ result }) {
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert(`Copied: ${text}`);
  };

  return (
    <div className="mt-10 w-full max-w-3xl bg-white p-8 rounded-xl shadow-lg space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-purple-700">
        Results for {result.name || "User"}
      </h2>

      <p className="text-gray-700">
        Readiness Score:{" "}
        <span className="font-semibold">{result.readiness_score ?? "N/A"}/100</span>
      </p>
      <p className="text-gray-700">
        Feedback: {result.readiness_feedback || "No feedback available."}
      </p>

      {result.recommendations?.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-purple-600 mb-3">
            Career Recommendations:
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {result.recommendations.map((career) => (
              <div
                key={career}
                className="border p-4 rounded-lg shadow hover:shadow-lg transition bg-purple-50 flex flex-col space-y-2"
              >
                <h4 className="font-bold text-purple-800">{career}</h4>
                {result.skill_suggestions?.[career]?.length > 0 && (
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {result.skill_suggestions[career].map((skill, idx) => (
                      <li
                        key={idx}
                        className="flex items-center justify-between hover:bg-purple-100 p-1 rounded cursor-pointer"
                      >
                        <span>{skill}</span>
                        <button
                          onClick={() => handleCopy(skill)}
                          className="text-purple-600 hover:text-purple-800"
                          title="Copy skill"
                        >
                          <FaCopy />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
