import React, { useEffect, useState } from "react";
import axios from "../services/api";
import TemplateCard from "./template/TemplateCard";
import Navbar from "../components/Navbar";
import TemplateDetails from "./template/TemplateDetails";

const MyTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [selected, setSelected] = useState(null);

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
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto mt-10">
        <div className="flex items-center justify-between mb-7">
          <h2 className="text-3xl font-bold text-blue-700">Мои шаблоны</h2>
        </div>
        {templates.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            У вас нет своих шаблонов.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {templates.map((t) => (
              <TemplateCard
                key={t._id}
                template={t}
                onCopy={() => {}}
                onView={setSelected}
              />
            ))}
          </div>
        )}
        {selected && (
          <TemplateDetails
            template={selected}
            onClose={() => setSelected(null)}
            onCopy={() => {}}
          />
        )}
      </div>
    </div>
  );
};

export default MyTemplates;
