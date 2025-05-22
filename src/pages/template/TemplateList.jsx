import React, { useEffect, useState } from "react";
import axios from "../../services/api";
import TemplateCard from "./TemplateCard";
import Navbar from "../../components/Navbar";
import TemplateDetails from "./TemplateDetails";

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
        `/templates/${template._id}/copy`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setCopyMsg("Шаблон успешно добавлен в ваши цели!");
      setTimeout(() => setCopyMsg(""), 3000);
    } catch {
      setCopyMsg("Ошибка копирования!");
      setTimeout(() => setCopyMsg(""), 3000);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto mt-10">
        <div className="flex items-center justify-between mb-7">
          <h2 className="text-3xl font-bold text-blue-700">
            Публичные шаблоны
          </h2>
        </div>
        {copyMsg && <div className="mb-4 text-green-700">{copyMsg}</div>}
        {templates.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            Публичных шаблонов пока нет.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {templates.map((t) => (
              <TemplateCard
                key={t._id}
                template={t}
                onCopy={handleCopy}
                onView={setSelected}
              />
            ))}
          </div>
        )}
        {selected && (
          <TemplateDetails
            template={selected}
            onClose={() => setSelected(null)}
            onCopy={handleCopy}
          />
        )}
      </div>
    </div>
  );
};

export default TemplateList;
