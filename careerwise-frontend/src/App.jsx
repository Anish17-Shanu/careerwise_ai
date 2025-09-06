import React, { useState } from "react";
import axios from "axios";
import Dashboard from "./components/Dashboard";
import ReadinessFeedback from "./components/ReadinessFeedback";
import ScoreBreakdown from "./components/ScoreBreakdown";

export default function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [file, setFile] = useState(null);
  const [preferences, setPreferences] = useState("{}");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please upload a resume file (.pdf or .txt).");
      return;
    }

    setLoading(true);
    setError("");
    setData(null);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("file", file);
    formData.append("preferences", preferences);

    try {
      const res = await axios.post("/api/upload_resume/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Transform backend JSON for frontend components
      const backendData = res.data;

      // Ensure readiness breakdown is formatted for ScoreBreakdown
      const breakdown = backendData.readiness_breakdown || {};
      const recommendations = backendData.recommendations || [];

      setData({
        ...backendData,
        breakdown,
        recommendations,
      });
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to get recommendations.");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <p className="text-center mt-20 text-xl">
        Processing resume, please wait...
      </p>
    );

  if (data)
    return (
      <div className="space-y-12 mb-12">
        {/* Overall readiness summary */}
        <ReadinessFeedback data={data} />

        {/* Score breakdown per career */}
        <ScoreBreakdown breakdown={data.breakdown} />

        {/* Detailed career recommendations */}
        <Dashboard data={data} />
      </div>
    );

  return (
    <div className="max-w-xl mx-auto mt-16 p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">CareerWise.AI</h1>

      {error && (
        <p className="text-red-600 text-center mb-4 font-semibold">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border rounded-lg"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border rounded-lg"
          required
        />
        <input
          type="file"
          accept=".pdf,.txt"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full"
          required
        />
        <textarea
          placeholder='Preferences (JSON format, e.g. {"career_interest":["AI Engineer"]})'
          value={preferences}
          onChange={(e) => setPreferences(e.target.value)}
          className="w-full p-3 border rounded-lg"
          rows={3}
        />
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-3 font-semibold rounded-xl hover:bg-purple-700 transition-colors"
        >
          Get Recommendations
        </button>
      </form>
    </div>
  );
}
