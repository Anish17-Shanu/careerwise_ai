import React from "react";

export default function ReadinessFeedback({ data }) {
  if (!data) return null;

  return (
    <div className="mt-6 bg-white p-6 rounded shadow text-center">
      <h2 className="text-3xl font-bold mb-2">Overall Readiness: {data.readiness_score ?? "N/A"}</h2>
      <p className="text-gray-700">{data.readiness_feedback ?? "No feedback available."}</p>
    </div>
  );
}
