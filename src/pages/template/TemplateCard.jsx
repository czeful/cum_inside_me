import React from "react";
import { useNavigate } from "react-router-dom";

const badgeColors = {
  Health: "bg-emerald-100 text-emerald-600",
  Career: "bg-yellow-100 text-yellow-600",
  Education: "bg-indigo-100 text-indigo-600",
  Personal: "bg-pink-100 text-pink-600",
  Finance: "bg-blue-100 text-blue-600",
  Hobby: "bg-purple-100 text-purple-600",
  Relationships: "bg-orange-100 text-orange-600",
};

const TemplateCard = ({ template, onCopy, onView, className }) => {
  const stepsCount = Array.isArray(template.steps) ? template.steps.length : 0;
  const badgeClass = badgeColors[template.category] || "bg-slate-100 text-slate-500";
  
  const navigate = useNavigate();

  return (
    <div
      className={`relative overflow-hidden bg-white/90 border border-blue-100 rounded-3xl shadow-xl p-6 flex flex-col h-full
        hover:shadow-2xl hover:-translate-y-1 transition-all group ${className || ""}`}
      style={{ backdropFilter: "blur(2px)" }}
    >
      {/* Красивый градиентный полукруг в углу */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-blue-400 via-teal-200 to-purple-300 opacity-30 rounded-full pointer-events-none z-0"></div>

      {/* Заголовок и категория */}
      <div className="flex items-center justify-between relative z-10 mb-2">
        <span className="text-lg font-bold text-blue-800 tracking-tight drop-shadow max-w-[150px] truncate">{template.title}</span>
        {template.category && (
          <span className={`px-2 py-0.5 text-xs font-bold rounded-xl shadow-sm ${badgeClass} whitespace-nowrap`}>
            {template.category}
          </span>
        )}
      </div>
      
      {/* Автор */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-1 z-10">
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-400">
          <circle cx="8" cy="8" r="7" />
          <path d="M8 8m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0"/>
        </svg>
        <span className="font-medium text-gray-600 truncate max-w-[90px]">{template.authorName || template.user_id || "—"}</span>
      </div>

      {/* Шаги и описание */}
      <div className="flex items-center gap-2 mb-1 text-xs z-10">
        <span className="px-2 py-0.5 rounded-lg bg-blue-50 text-blue-500 font-semibold">
          {stepsCount} шагов
        </span>
        {template.public && (
          <span className="inline-flex items-center px-2 py-0.5 ml-1 rounded-lg bg-emerald-50 text-emerald-500 font-semibold">
            <svg width="13" height="13" fill="currentColor" className="mr-1"><circle cx="6.5" cy="6.5" r="6.5" /></svg>
            Публичный
          </span>
        )}
      </div>

      <div className="relative text-gray-600 mb-3 text-sm line-clamp-3 z-10">
        {template.description}
        <div className="absolute left-0 bottom-0 w-full h-4 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none"/>
      </div>

      {/* Действия */}
      <div className="flex items-center gap-2 mt-auto z-10">
        <button
          className="flex-1 min-w-0 flex items-center justify-center gap-1 px-2 py-1 rounded-lg bg-gradient-to-r from-blue-500 to-emerald-500 text-white text-xs font-bold shadow-md
            hover:scale-[1.04] hover:shadow-lg active:scale-100 transition-all duration-150 group truncate"
          onClick={() => onCopy(template)}
          style={{maxWidth: '110px'}}
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="2" width="10" height="10" rx="2"/>
            <path d="M5.5 5.5h3v3h-3z"/>
          </svg>
          <span className="truncate">Скопировать</span>
        </button>
        <button
          className="flex-1 min-w-0 flex items-center justify-center gap-1 px-2 py-1 rounded-lg bg-white border border-blue-200 text-blue-600 text-xs font-bold shadow-sm
            hover:bg-blue-50 active:bg-blue-100 transition-all duration-150 truncate"
           onClick={() => navigate(`/templates/${template.id}`)}
          style={{maxWidth: '110px'}}
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="7" cy="7" r="6"/>
            <circle cx="7" cy="7" r="2"/>
          </svg>
          <span className="truncate">Подробнее</span>
        </button>
      </div>
    </div>
  );
};

export default TemplateCard;
