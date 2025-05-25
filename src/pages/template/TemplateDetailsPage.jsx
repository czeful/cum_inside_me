import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../services/api";
import Navbar from "../../components/Navbar";
import { useLoading } from "../../context/LoadingContext";

const badgeColors = {
  Health: "bg-emerald-100 text-emerald-600",
  Career: "bg-yellow-100 text-yellow-600",
  Education: "bg-indigo-100 text-indigo-600",
  Personal: "bg-pink-100 text-pink-600",
  Finance: "bg-blue-100 text-blue-600",
  Hobby: "bg-purple-100 text-purple-600",
  Relationships: "bg-orange-100 text-orange-600",
};

const TemplateDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState(null);
  const [msg, setMsg] = useState("");
  const {setLoading} = useLoading();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        console.log(template)
        setLoading(true);
        const res = await axios.get(`/templates/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setTemplate(res.data);
      } catch {
        setMsg("Не удалось загрузить шаблон");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleCopy = async () => {
    setLoading(true);
    try {
      await axios.post(`/templates/${id}/copy`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setMsg("Шаблон успешно скопирован в ваши цели!");
      setTimeout(() => setMsg(""), 3000);
    } catch {
      setMsg("Ошибка копирования");
      setTimeout(() => setMsg(""), 3000);
    }
    setLoading(ture);
  };

  if (!template) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-96 text-lg text-red-500">
          {msg || "Шаблон не найден"}
        </div>
      </div>
    );
  }

  const badgeClass = badgeColors[template.category] || "bg-slate-100 text-slate-500";
  const stepsCount = Array.isArray(template.steps) ? template.steps.length : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-blue-100">
      <Navbar />
      <div className="max-w-2xl mx-auto mt-12 mb-12 bg-white rounded-3xl shadow-2xl p-10 relative">
        <button
          className="absolute top-6 right-6 text-gray-400 hover:text-red-400 text-2xl"
          onClick={() => navigate(-1)}
          aria-label="Назад"
        >×</button>
        <h1 className="text-3xl font-bold mb-3 text-blue-700">
          {template.title}
        </h1>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className={`px-3 py-1 text-xs font-bold rounded-xl shadow-sm ${badgeClass}`}>
            {template.category}
          </span>
          <span className="px-2 py-1 rounded-lg bg-blue-50 text-blue-500 font-semibold text-xs">
            {stepsCount} шагов
          </span>
          {template.public && (
            <span className="inline-flex items-center px-2 py-1 rounded-lg bg-emerald-50 text-emerald-500 font-semibold text-xs">
              Публичный
            </span>
          )}
        </div>
        <div className="text-gray-500 text-sm mb-3">
          Автор: <span className="font-semibold">{template.authorName || template.user_id || "—"}</span>
        </div>
        <div className="text-gray-700 mb-6 whitespace-pre-line">
          {template.description}
        </div>
        <div className="mb-8">
          <div className="font-semibold mb-2 text-blue-600">Шаги шаблона:</div>
          <ol className="list-decimal pl-6 space-y-1 text-gray-900">
            {template.steps.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
        </div>
        {msg && <div className="mb-4 text-green-600">{msg}</div>}
        <div className="flex gap-3">
          <button
            className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-emerald-500 text-white font-bold shadow hover:scale-105 transition"
            onClick={handleCopy}
          >
            Copy
          </button>
          <button
            className="flex-1 px-4 py-2 rounded-xl bg-gray-100 border border-blue-200 text-blue-600 font-bold shadow hover:bg-blue-50 transition"
            onClick={() => navigate(-1)}
          >
            Назад
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateDetailsPage;
