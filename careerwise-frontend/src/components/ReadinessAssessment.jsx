// ReadinessFeedback.jsx
import React from "react";
import { FaLightbulb } from "react-icons/fa";

export default function ReadinessFeedback({ data }) {
  const score = data.readiness_score ?? 0;

  return (
    <div className="max-w-3xl mx-auto mt-12 animate-fade-in">
      <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
        <FaLightbulb /> Readiness Feedback
      </h2>

      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 space-y-4">
        <p className="text-gray-700 leading-relaxed">
          {data.readiness_feedback || "No feedback available."}
        </p>

        <div className="w-full bg-gray-200 rounded-full h-4 mt-4 overflow-hidden">
          <div
            className="bg-accent h-4 rounded-full transition-all duration-500"
            style={{ width: `${score}%` }}
          ></div>
        </div>
        <p className="text-right text-sm text-gray-600 mt-1">{score}/100</p>
      </div>
    </div>
  );
}
