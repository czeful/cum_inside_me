import React from "react";

const TemplateCard = ({ template, onCopy, onView }) => (
  <div className="bg-white shadow rounded-2xl border border-neutral-200 p-5 transition hover:shadow-lg flex flex-col h-full">
    <div className="flex items-center justify-between mb-2">
      <span className="text-xl font-bold text-blue-700">{template.title}</span>
      {template.category && (
        <span className="px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded-xl">
          {template.category}
        </span>
      )}
    </div>
    <div className="text-gray-500 text-sm mb-2">
      Автор: <span className="font-semibold">{template.authorName || template.userName || "—"}</span>
    </div>
    <div className="text-gray-600 mb-4 line-clamp-2">{template.description}</div>
    <div className="flex items-center gap-2 mt-auto">
      <button className="btn-primary flex-1" onClick={() => onCopy(template)}>
        Скопировать себе
      </button>
      <button className="btn-secondary flex-1" onClick={() => onView(template)}>
        Подробнее
      </button>
    </div>
  </div>
);

export default TemplateCard;
