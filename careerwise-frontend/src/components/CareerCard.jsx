import React from "react";
import { FaBriefcase } from "react-icons/fa";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

export default function CareerCard({ career, isOpen, onToggle }) {
  const { career_path, score, details, recommended_skills, recommended_courses, recommended_projects } = career;

  const radarData = ["Skills", "Education", "Experience"].map((key) => ({
    metric: key,
    score: details[key]?.points || 0,
  }));

  return (
    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-2xl shadow-xl cursor-pointer transform hover:scale-105 transition">
      <div className="flex justify-between items-center" onClick={onToggle}>
        <div className="flex items-center space-x-4">
          <FaBriefcase className="text-white text-3xl" />
          <h3 className="text-xl font-semibold">{career_path}</h3>
        </div>
        <span className="text-lg font-bold">{score}%</span>
      </div>

      {isOpen && (
        <div className="mt-4 bg-white text-gray-800 p-5 rounded-xl shadow-inner">
          <div className="w-full h-64 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar
                  name={career_path}
                  dataKey="score"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {["Skills", "Education", "Experience"].map((key) => (
            <div key={key} className="border-b border-gray-200 py-2">
              <div className="flex justify-between">
                <span className="font-semibold">{key}</span>
                <span>{details[key]?.points || 0} points</span>
              </div>
              <p className="text-gray-600 text-sm mt-1">{details[key]?.advice || "No advice available"}</p>
            </div>
          ))}

          <div className="mt-4">
            <h4 className="font-semibold text-gray-800 mb-1">Recommended Skills:</h4>
            <ul className="list-disc list-inside text-gray-700">
              {recommended_skills.length > 0 ? recommended_skills.map((s, i) => <li key={i}>{s}</li>) : <li>No data available</li>}
            </ul>

            <h4 className="font-semibold text-gray-800 mt-2 mb-1">Recommended Courses:</h4>
            <ul className="list-disc list-inside text-gray-700">
              {recommended_courses.length > 0 ? recommended_courses.map((c, i) => <li key={i}>{c}</li>) : <li>No data available</li>}
            </ul>

            <h4 className="font-semibold text-gray-800 mt-2 mb-1">Recommended Projects:</h4>
            <ul className="list-disc list-inside text-gray-700">
              {recommended_projects.length > 0 ? recommended_projects.map((p, i) => <li key={i}>{p}</li>) : <li>No data available</li>}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
