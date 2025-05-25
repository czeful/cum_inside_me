import React, { useState } from "react";
import axios from "../../services/api";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import { generateSteps } from "../../services/ai"; // Adjust the path if needed
import { useLoading } from "../../context/LoadingContext";

const categories = [
  "Health", "Career", "Education", "Personal", "Finance", "Hobby", "Relationships"
];

const TemplateCreatePage = ({ onCreated }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    steps: [""],
    public: true,
  });

  const [msg, setMsg] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const handleStepChange = (idx, value) => {
    const newSteps = [...form.steps];
    newSteps[idx] = value;
    setForm({ ...form, steps: newSteps });
  };

  const handleAddStep = () => {
    setForm({ ...form, steps: [...form.steps, ""] });
  };

  const handleRemoveStep = (idx) => {
    const newSteps = [...form.steps];
    newSteps.splice(idx, 1);
    setForm({ ...form, steps: newSteps });
  };

  const handleAIGenerate = async () => {
    setAiLoading(true);
    try {
      const steps = await generateSteps({
        title: form.title,
        description: form.description,
        category: form.category
      });
      setForm({ ...form, steps }); // Overwrite steps with generated
    } catch {
      setMsg("AI failed to generate steps.");
    }
    setAiLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const stepsArr = form.steps.map((s) => s.trim()).filter((s) => s.length > 0);

    try {
      await axios.post(
        "/templates",
        {
          title: form.title,
          description: form.description,
          category: form.category,
          steps: stepsArr,
          public: form.public,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setMsg("Template created successfully!");
      setTimeout(() => {
        navigate("/templates/my");
        if (onCreated) onCreated();
      }, 1500);
    } catch (err) {
      setMsg("Failed to create template.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-emerald-50 to-fuchsia-100">
      <Navbar />
      {/* Decorative background */}
      <div className="absolute w-80 h-80 rounded-full bg-gradient-to-tr from-blue-300 via-fuchsia-100 to-emerald-200 opacity-20 blur-2xl -top-32 -left-24 pointer-events-none" />
      <div className="absolute w-96 h-96 rounded-full bg-gradient-to-tr from-blue-100 via-emerald-200 to-fuchsia-300 opacity-10 blur-2xl -bottom-36 -right-28 pointer-events-none" />
      
      <div className="max-w-2xl mx-auto mt-14 mb-14 px-2 relative z-10">
        <div className="bg-white/95 rounded-3xl shadow-2xl border border-blue-100 p-10">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-gradient-to-tr from-blue-500 to-emerald-400 shadow-lg">
              <svg width="36" height="36" fill="none" stroke="white" strokeWidth="2">
                <rect x="7" y="10" width="22" height="16" rx="5" />
                <path d="M13 17h10M13 21h6" />
              </svg>
            </div>
            <h3 className="text-3xl font-extrabold text-blue-800 tracking-tight mb-2 text-center">
              Create New Template
            </h3>
            <div className="text-gray-400 text-base text-center mb-1">
              Create a structure that others can use.<br />
              <span className="text-emerald-500 font-semibold">Public templates</span> are available to everyone.
            </div>
          </div>

          <form className="space-y-7" onSubmit={handleSubmit}>
            {/* Template Info Section */}
            <section className="border-b pb-7">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                <div>
                  <label className="font-medium flex items-center gap-2 mb-1 text-gray-700">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="7" width="12" height="8" rx="3" /><path d="M7 7V5a2 2 0 1 1 4 0v2" /></svg>
                    Template Name
                  </label>
                  <input
                    className="w-full rounded-xl px-4 py-3 border border-blue-200 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    required
                    placeholder="Short and clear name"
                  />
                </div>
                <div>
                  <label className="font-medium flex items-center gap-2 mb-1 text-gray-700">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="9" r="7" /><path d="M6 14v-1a3 3 0 0 1 6 0v1" /></svg>
                    Category
                  </label>
                  <select
                    className="w-full rounded-xl px-4 py-3 border border-blue-200 focus:outline-none focus:border-blue-500 transition"
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-7">
                <label className="font-medium flex items-center gap-2 mb-1 text-gray-700">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h10M4 10h10M4 14h10" /></svg>
                  Description
                </label>
                <textarea
                  className="w-full rounded-xl px-4 py-3 border border-blue-200 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition min-h-[80px]"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  required
                  placeholder="Briefly describe the template purpose and who will benefit from it"
                />
              </div>
            </section>

            {/* Steps Section */}
            <section className="pt-2">
              <label className="font-medium flex items-center gap-2 mb-3 text-gray-700">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="9" r="8"/><path d="M9 5v4l3 2" /></svg>
                Steps (instructions or structure)
                <span className="text-xs text-gray-400">(each step on a separate line)</span>
              </label>
              <div className="space-y-2">
                {form.steps.length === 0 && (
                  <div className="mb-2 text-gray-400">No steps yet</div>
                )}
                {form.steps.map((step, idx) => (
                  <div className="flex items-center gap-2" key={idx}>
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-600 font-bold mr-2">
                      {idx + 1}
                    </span>
                    <input
                      className="flex-1 rounded-lg px-4 py-2 border border-blue-200 focus:outline-none focus:border-blue-500 transition"
                      placeholder={`Step ${idx + 1}`}
                      value={step}
                      onChange={e => handleStepChange(idx, e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700 px-2 py-1 rounded"
                      onClick={() => handleRemoveStep(idx)}
                      title="Delete step"
                    >🗑️</button>
                  </div>
                ))}
              </div>
              {/* Buttons: AI Generate and Add Step (responsive) */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mt-4 gap-3">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-bold shadow hover:scale-105 transition w-full sm:w-auto"
                  onClick={handleAddStep}
                >+ Add Step</button>
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-fuchsia-400 to-blue-400 text-white font-semibold shadow hover:scale-105 transition w-full sm:w-auto"
                  onClick={handleAIGenerate}
                  disabled={aiLoading || !form.title || !form.description || !form.category}
                >
                  {aiLoading ? "AI generating..." : "Generate by AI"}
                </button>
              </div>
            </section>

            {/* Options */}
            <div className="flex items-center gap-3 mt-2">
              <input
                type="checkbox"
                id="public"
                className="rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                checked={form.public}
                onChange={e => setForm({ ...form, public: e.target.checked })}
              />
              <label htmlFor="public" className="text-sm text-gray-700 font-medium cursor-pointer select-none">
                Public template - will be visible to all users
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-lg font-bold bg-gradient-to-r from-blue-500 to-emerald-500 shadow-lg hover:scale-105 transition-all text-white mt-5
                disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg width="22" height="22" className="animate-spin" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="9" opacity="0.2"/>
                    <path d="M11 2a9 9 0 0 1 9 9" />
                  </svg>
                  Creating...
                </span>
              ) : "Create template"}
            </button>
            {msg && <div className="mt-4 text-center text-lg text-emerald-600 animate-fadeIn">{msg}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default TemplateCreatePage;
