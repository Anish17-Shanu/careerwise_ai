import { useState } from "react";
import axios from "axios";
import { AiOutlineUpload } from "react-icons/ai";
import UploadResult from "./UploadResult";

export default function ResumeUpload() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please upload a resume.");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await axios.post("http://127.0.0.1:8000/upload_resume/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
    } catch (err) {
      alert(err.response?.data?.detail || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold mb-8 text-purple-700">CareerWise.AI</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg space-y-6"
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
            required
          />
        </label>

        <button
          type="submit"
          className="w-full bg-purple-600 text-white p-3 rounded-lg font-semibold hover:bg-purple-700 transition"
        >
          {loading ? "Analyzing..." : "Get Recommendations"}
        </button>
      </form>

      {result && <UploadResult result={result} />}
    </div>
  );
}
