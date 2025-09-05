import React, { useState } from "react";
import { FaBook, FaProjectDiagram, FaBriefcase } from "react-icons/fa";
import { CopyToClipboard } from "react-copy-to-clipboard";

export default function LearningPath({ data }) {
  if (!data) return null;
  const [openSkill, setOpenSkill] = useState(null);

  const toggleSkill = (skill) => setOpenSkill(openSkill === skill ? null : skill);

  return (
    <div className="max-w-5xl mx-auto mt-12 px-4 animate-fade-in">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Personalized Learning Path</h2>

      {data.recommendations.map((career) => {
        const skills = career.recommended_skills || [];
        return (
          <div key={career.career_path} className="mb-8">
            <h3 className="text-2xl font-semibold text-indigo-700 mb-4">{career.career_path}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {skills.map((skill) => (
                <div
                  key={skill}
                  className="bg-white p-4 rounded-xl shadow hover:scale-105 transform transition duration-300 cursor-pointer"
                  onClick={() => toggleSkill(skill)}
                >
                  <h4 className="font-semibold text-gray-800">{skill}</h4>

                  {openSkill === skill && (
                    <div className="mt-2 text-gray-700 space-y-2 text-sm">
                      {career.recommended_courses?.[skill]?.length > 0 && (
                        <div className="flex items-start space-x-2">
                          <FaBook className="mt-1 text-indigo-500" />
                          <ul className="list-disc list-inside">
                            {career.recommended_courses[skill].map((course, idx) => (
                              <li key={idx}>
                                {course}{" "}
                                <CopyToClipboard text={course}>
                                  <span className="ml-1 text-gray-400 hover:text-purple-600 cursor-pointer">📋</span>
                                </CopyToClipboard>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {career.recommended_projects?.[skill]?.length > 0 && (
                        <div className="flex items-start space-x-2">
                          <FaProjectDiagram className="mt-1 text-green-500" />
                          <ul className="list-disc list-inside">
                            {career.recommended_projects[skill].map((proj, idx) => (
                              <li key={idx}>
                                {proj}{" "}
                                <CopyToClipboard text={proj}>
                                  <span className="ml-1 text-gray-400 hover:text-purple-600 cursor-pointer">📋</span>
                                </CopyToClipboard>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {career.custom_matching?.length > 0 && (
                        <div className="flex items-start space-x-2">
                          <FaBriefcase className="mt-1 text-yellow-500" />
                          <ul className="list-disc list-inside">
                            {career.custom_matching.map((job, idx) => (
                              <li key={idx}>{job}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
