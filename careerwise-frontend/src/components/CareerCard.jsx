import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { FaRegCopy } from "react-icons/fa";
import { CopyToClipboard } from "react-copy-to-clipboard";

const COLORS = ["#8b5cf6", "#f472b6"];

export default function CareerCard({ careerData, apiData }) {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen(!open);

  const career = careerData.career_path;
  const score = careerData.score ?? 0;
  const breakdown = careerData.details ?? {};

  const chartData = [
    { name: "Score", value: score },
    { name: "Remaining", value: 100 - score },
  ];

  const renderList = (title, items) => (
    <div className="space-y-1">
      <strong>{title}:</strong>
      {items?.length > 0 ? (
        items.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center">
            <span>{item}</span>
            <CopyToClipboard text={item}>
              <FaRegCopy className="cursor-pointer ml-2 text-gray-500 hover:text-purple-600" />
            </CopyToClipboard>
          </div>
        ))
      ) : (
        <span>N/A</span>
      )}
    </div>
  );

  return (
    <div
      className="relative bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition cursor-pointer"
      onClick={toggleOpen}
    >
      <div className="absolute top-3 right-3 bg-purple-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow">
        {score.toFixed(0)}%
      </div>

      <h3 className="text-xl font-bold text-purple-700 mb-4">{career}</h3>

      <div className="w-full h-40">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              innerRadius={40}
              outerRadius={60}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {open && (
        <div className="mt-4 bg-purple-50 text-gray-700 p-4 rounded-lg space-y-4">
          <div>
            <strong>Readiness Breakdown:</strong>
            <p>Skills: {breakdown?.Skills?.points ?? 0} - {breakdown?.Skills?.advice ?? ""}</p>
            <p>Education: {breakdown?.Education?.points ?? 0} - {breakdown?.Education?.advice ?? ""}</p>
            <p>Experience: {breakdown?.Experience?.points ?? 0} - {breakdown?.Experience?.advice ?? ""}</p>
          </div>

          {renderList("Recommended Skills", apiData.recommended_skills?.[career] ?? [])}
          {renderList("Courses", apiData.recommended_courses?.[career] ?? [])}
          {renderList("Projects", apiData.recommended_projects?.[career] ?? [])}
        </div>
      )}
    </div>
  );
}
