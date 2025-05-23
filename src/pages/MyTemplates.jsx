import React, { useEffect, useState } from "react";
import axios from "../services/api";
import TemplateCard from "./template/TemplateCard";
import Navbar from "../components/Navbar";
import TemplateDetails from "./template/TemplateDetailsPage";
import { useNavigate } from "react-router-dom";
import Footer from '../components/Footer';

const MyTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await axios.get("/templates", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setTemplates(res.data);
      } catch {
        setTemplates([]);
      }
    };
    fetchTemplates();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-blue-100">
      <Navbar />
      <div className="max-w-5xl mx-auto mt-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h2 className="text-4xl font-extrabold text-blue-800 tracking-tight mb-1">
              Мои шаблоны
            </h2>
            <div className="text-gray-500 text-base">
              Все ваши созданные шаблоны целей в одном месте
            </div>
          </div>
          <button
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white font-semibold shadow-lg hover:scale-105 hover:shadow-2xl active:scale-100 transition-all duration-200"
            onClick={() => navigate("/templates/create")}
          >
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="inline-block"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            Новый шаблон
          </button>
        </div>

        {/* Template List */}
        {templates.length === 0 ? (
          <div className="text-center text-gray-400 py-24 text-xl rounded-2xl bg-white/50 shadow-inner">
            У вас нет своих шаблонов.
            <br />
            <span className="text-blue-400">Создайте свой первый шаблон!</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates.map((t) => (
              <TemplateCard
                key={t.id}
                template={t}
                onCopy={() => {}}
                onView={setSelected}
                className="transition-transform duration-200 hover:scale-[1.025] hover:shadow-2xl"
              />
            ))}
          </div>
        )}

        {/* Template details modal */}
        {selected && (
          <TemplateDetails
            template={selected}
            onClose={() => setSelected(null)}
            onCopy={() => {}}
          />
        )}
      </div>
        <Footer/>
    </div>
  );
};

export default MyTemplates;
