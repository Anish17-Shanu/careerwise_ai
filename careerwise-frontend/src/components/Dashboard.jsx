import React, { useState } from "react";
import CareerCard from "./CareerCard";

export default function Dashboard({ data }) {
  const [openCareer, setOpenCareer] = useState(null);

  const toggleCareer = (career) =>
    setOpenCareer(openCareer === career ? null : career);

  return (
    <div className="max-w-6xl mx-auto mt-12 px-4 animate-fade-in">
      {/* Overall Readiness */}
      <div className="bg-white p-6 rounded-xl shadow mb-8 text-center">
        <h2 className="text-3xl font-bold mb-2 text-gray-800">
          Overall Readiness: {data.readiness_score ?? "N/A"}%
        </h2>
        <p className="text-gray-700">{data.readiness_feedback || "No feedback available."}</p>
      </div>

      {/* Career Recommendations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {data.recommendations.map((career) => (
          <CareerCard
            key={career.career_path}
            career={career}
            isOpen={openCareer === career.career_path}
            onToggle={() => toggleCareer(career.career_path)}
          />
        ))}
      </div>
    </div>
  );
}
