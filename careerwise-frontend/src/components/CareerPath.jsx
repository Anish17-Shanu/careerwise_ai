import React, { useState } from "react";
import {
  FaLaptopCode,
  FaDatabase,
  FaChartLine,
  FaRobot,
  FaBusinessTime,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

function CareerPath({ data }) {
  const careers = data.recommendations || [];

  const [expanded, setExpanded] = useState({});

  const toggleExpand = (career) => {
    setExpanded((prev) => ({ ...prev, [career]: !prev[career] }));
  };

  const getIconForCareer = (career) => {
    const lower = career.toLowerCase();
    if (lower.includes("engineer") || lower.includes("developer"))
      return <FaLaptopCode className="text-white text-3xl" />;
    if (lower.includes("data") || lower.includes("scientist") || lower.includes("analyst"))
      return <FaDatabase className="text-white text-3xl" />;
    if (lower.includes("manager") || lower.includes("business"))
      return <FaChartLine className="text-white text-3xl" />;
    if (lower.includes("ai") || lower.includes("ml"))
      return <FaRobot className="text-white text-3xl" />;
    if (lower.includes("project")) return <FaBusinessTime className="text-white text-3xl" />;
    return <FaLaptopCode className="text-white text-3xl" />; // fallback
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-primary mb-6">
        Suggested Career Paths
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {careers.map((career, idx) => (
          <div
            key={idx}
            className="bg-gradient-to-r from-primary to-secondary text-white p-6 rounded-xl shadow-lg hover:scale-105 transform transition duration-300 cursor-pointer"
            onClick={() => toggleExpand(career)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getIconForCareer(career)}
                <h3 className="text-xl font-semibold">{career}</h3>
              </div>
              {expanded[career] ? <FaChevronUp /> : <FaChevronDown />}
            </div>

            <p className="text-sm text-white/80 mt-2">
              Readiness Score: {data.readiness_score || 0}/100
            </p>

            {expanded[career] && (
              <div className="mt-4 text-white/90 text-sm space-y-2">
                {data.skill_suggestions?.[career]?.length > 0 && (
                  <>
                    <p className="font-semibold">Recommended Skills & Courses:</p>
                    <ul className="list-disc list-inside ml-4">
                      {data.skill_suggestions[career].map((skill, i) => (
                        <li key={i}>{skill}</li>
                      ))}
                    </ul>
                  </>
                )}

                {data.projects?.[career]?.length > 0 && (
                  <>
                    <p className="font-semibold mt-2">Recommended Projects:</p>
                    <ul className="list-disc list-inside ml-4">
                      {data.projects[career].map((proj, i) => (
                        <li key={i}>{proj}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CareerPath;
