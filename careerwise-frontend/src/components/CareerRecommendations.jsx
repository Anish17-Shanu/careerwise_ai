import React, { useState } from "react";
import { FaBriefcase } from "react-icons/fa";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

export default function CareerRecommendations({ data }) {
  const [openCareer, setOpenCareer] = useState(null);
  const careers = data.recommendations || [];

  const toggleCareer = (career) =>
    setOpenCareer(openCareer === career ? null : career);

  const renderList = (title, items) => (
    <div className="mt-2">
      <h4 className="font-semibold text-gray-800">{title}:</h4>
      {Array.isArray(items) && items.length > 0 ? (
        <ul className="mt-1 space-y-1 list-disc list-inside">
          {items.map((item, idx) => (
            <li key={idx} className="flex justify-between items-center">
              <span>{item}</span>
              <CopyToClipboard text={item}>
                <span className="ml-2 text-gray-400 hover:text-purple-600 cursor-pointer transition-colors">
                  📋
                </span>
              </CopyToClipboard>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400 text-sm mt-1">No data available</p>
      )}
    </div>
  );

  // Keys to exclude from dropdown and radar chart
  const excludedKeys = ["Weighted_score", "Skills_gap", "total_score"];

  return (
    <div className="max-w-5xl mx-auto mt-12 px-4 animate-fade-in">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Career Recommendations
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {careers.map((career) => {
          const details = career.details || {};
          const totalScore = career.score ?? data.readiness_score ?? 0;

          // Radar chart data dynamically (exclude unwanted metrics)
          const radarData = Object.entries(details)
            .filter(([key]) => !excludedKeys.includes(key))
            .map(([key, val]) => ({
              metric: key,
              score: val?.points ?? 0,
            }));

          return (
            <div
              key={career.career_path}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-2xl shadow-xl hover:scale-105 transform transition duration-300"
            >
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleCareer(career.career_path)}
              >
                <div className="flex items-center space-x-4">
                  <FaBriefcase className="text-white text-4xl" />
                  <h3 className="text-xl font-semibold">{career.career_path}</h3>
                </div>
                <span className="text-lg font-bold">{totalScore}%</span>
              </div>

              {openCareer === career.career_path && (
                <div className="mt-4 bg-white text-gray-800 p-5 rounded-xl shadow-inner transition-all duration-300">
                  {/* Radar Chart */}
                  {radarData.length > 0 && (
                    <div className="w-full h-64 mb-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart
                          cx="50%"
                          cy="50%"
                          outerRadius="70%"
                          data={radarData}
                        >
                          <PolarGrid />
                          <PolarAngleAxis dataKey="metric" />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} />
                          <Radar
                            name={career.career_path}
                            dataKey="score"
                            stroke="#8884d8"
                            fill="#8884d8"
                            fillOpacity={0.6}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {/* Metrics Breakdown */}
                  {Object.entries(details)
                    .filter(([key]) => !excludedKeys.includes(key))
                    .map(([key, val]) => (
                      <div key={key} className="border-b border-gray-200 pb-2">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">{key}:</span>
                          <span>{val?.points ?? 0} points</span>
                        </div>
                        {val?.advice && (
                          <p className="text-gray-600 text-sm mt-1">{val.advice}</p>
                        )}
                      </div>
                    ))}

                  {renderList("Recommended Skills", career.recommended_skills)}
                  {renderList("Recommended Courses", career.recommended_courses)}
                  {renderList("Recommended Projects", career.recommended_projects)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
