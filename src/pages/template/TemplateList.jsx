import React, { useEffect, useState } from "react";
import axios from "../../services/api";
import TemplateCard from "./TemplateCard";
import Navbar from "../../components/Navbar";
import TemplateDetails from "./TemplateDetailsPage";

const TemplateList = () => {
  const [templates, setTemplates] = useState([]);
  const [selected, setSelected] = useState(null);
  const [copyMsg, setCopyMsg] = useState("");

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await axios.get("/templates/public", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setTemplates(res.data);
      } catch {
        setTemplates([]);
      }
    };
    fetchTemplates();
  }, []);

  const handleCopy = async (template) => {
    try {
      await axios.post(
        `/templates/${template.id || template._id || template.ID}/copy`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setCopyMsg("Template successfully added to your goals!");
      setTimeout(() => setCopyMsg(""), 3000);
    } catch {
      setCopyMsg("Copying failed!");
      setTimeout(() => setCopyMsg(""), 3000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-emerald-50 to-fuchsia-100">
      <div className="w-full flex-1 flex flex-col items-center justify-start">
        <div className="w-full max-w-xs sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl px-2 sm:px-4 md:px-8 py-8 sm:py-10 mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-700">
              Public Templates
            </h2>
            {copyMsg && (
              <div className="text-green-700 text-xs sm:text-sm bg-green-50 border border-green-200 rounded-lg px-3 py-2 shadow animate-fadeIn">
                {copyMsg}
              </div>
            )}
          </div>
          {templates.length === 0 ? (
            <div className="text-center text-gray-400 py-16 text-base sm:text-lg">
              No public templates yet.
            </div>
          ) : (
            <div className="
              grid 
              grid-cols-1 
              sm:grid-cols-2 
              lg:grid-cols-3 
              gap-4 
              sm:gap-6 
              xl:gap-8
              "
            >
              {templates.map((t) => (
                <TemplateCard
                  key={t.id || t.ID || t._id}
                  template={t}
                  onCopy={handleCopy}
                  onView={setSelected}
                />
              ))}
            </div>
          )}
        </div>
        {/* Модальное окно для TemplateDetails */}
        {selected && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-2 sm:p-4">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl relative">
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl"
                onClick={() => setSelected(null)}
                aria-label="Close"
              >
                &times;
              </button>
              <TemplateDetails
                template={selected}
                onClose={() => setSelected(null)}
                onCopy={handleCopy}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateList;
