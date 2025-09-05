// App.jsx
import { useState } from "react";
import axios from "axios";
import { AiOutlineUpload } from "react-icons/ai";
import CareerRecommendations from "./components/CareerRecommendations";
import ReadinessFeedback from "./components/ReadinessFeedback";
import ScoreBreakdown from "./components/ScoreBreakdown";

export default function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!file) return setError("Please upload a resume.");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await axios.post(
        "http://127.0.0.1:8000/upload_resume/",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold mb-8 text-purple-700 animate-fade-in">
        CareerWise.AI
      </h1>

      {/* Upload Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg space-y-6 animate-fade-in"
      >
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          required
        />
        <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-purple-50">
          <AiOutlineUpload className="text-2xl mr-2" />
          {file ? file.name : "Upload Resume (.pdf or .txt)"}
          <input
            type="file"
            className="hidden"
            onChange={(e) => setFile(e.target.files[0])}
            accept=".pdf,.txt"
          />
        </label>

        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          className="w-full bg-purple-600 text-white p-3 rounded-lg font-semibold hover:bg-purple-700 transition"
        >
          {loading ? "Analyzing..." : "Get Recommendations"}
        </button>
      </form>

      {/* Results */}
      {result && (
        <div className="w-full max-w-6xl mt-8 space-y-8">
          <ReadinessFeedback data={result} />
          <CareerRecommendations data={result} />
          <ScoreBreakdown breakdown={result.recommendations?.reduce((acc, item) => {
            acc[item.career_path] = item.details || {};
            return acc;
          }, {})} />
        </div>
      )}
    </div>
  );
}
