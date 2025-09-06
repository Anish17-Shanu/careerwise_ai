import React, { useState } from "react";
import { FaBriefcase } from "react-icons/fa";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
} from "recharts";

export default function CareerDashboard({ data }) {
  const [openCareer, setOpenCareer] = useState(null);
  if (!data) return null;

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
                <span className="ml-2 text-gray-400 hover:text-purple-600 cursor-pointer transition-colors">📋</span>
              </CopyToClipboard>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 italic mt-1">No data available</p>
      )}
    </div>
  );

  const excludedKeys = ["Weighted_score", "Skills_gap"];

  return (
    <div className="max-w-6xl mx-auto mt-12 px-4 animate-fade-in">
      {/* Overall readiness */}
      <div className="text-center bg-white p-6 rounded-xl shadow mb-8">
        <h2 className="text-3xl font-bold mb-2">Overall Readiness: {data.readiness_score ?? "N/A"}%</h2>
        <p className="text-gray-700">{data.readiness_feedback ?? "No feedback available"}</p>
      </div>

      {/* Career recommendations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {careers.map((career) => {
          const details = career.details || {};
          const totalScore = career.score ?? 0;

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
                  {/* Radar chart */}
                  {radarData.length > 0 && (
                    <div className="w-full h-64 mb-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="metric" />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} />
                          <Radar name={career.career_path} dataKey="score" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {/* Metrics breakdown */}
                  {Object.entries(details)
                    .filter(([key]) => !excludedKeys.includes(key))
                    .map(([key, val]) => (
                      <div key={key} className="border-b border-gray-200 pb-2">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">{key}:</span>
                          <span>{val?.points ?? 0} points</span>
                        </div>
                        {val?.advice && <p className="text-gray-600 text-sm mt-1">{val.advice}</p>}
                      </div>
                    ))}

                  {/* Recommended lists */}
                  {renderList("Recommended Skills", career.recommended_skills)}
                  {renderList("Recommended Courses", career.recommended_courses)}
                  {renderList("Recommended Projects", career.recommended_projects)}

                  {/* Skills Gap */}
                  {details.Skills_gap && details.Skills_gap.length > 0 && (
                    <div className="mt-2 text-red-600 text-sm">
                      <strong>Skills Gap:</strong> {details.Skills_gap.join(", ")}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Industry trends */}
      {data.industry_trends && data.industry_trends.length > 0 && (
        <div className="mt-12 bg-white p-6 rounded-xl shadow">
          <h3 className="text-2xl font-bold mb-4">Industry Trends</h3>
          <ul className="list-disc list-inside space-y-1">
            {data.industry_trends.map((trend, idx) => <li key={idx}>{trend}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
