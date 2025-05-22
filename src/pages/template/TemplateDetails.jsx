import React from "react";

const TemplateDetails = ({ template, onClose, onCopy }) => (
  <div className="fixed inset-0 bg-black/40 z-30 flex items-center justify-center">
    <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full relative">
      <button
        className="absolute top-4 right-4 text-gray-400 hover:text-red-400 text-2xl"
        onClick={onClose}
        aria-label="Закрыть"
      >×</button>
      <h3 className="text-2xl font-bold mb-2 text-blue-600">{template.title}</h3>
      <div className="mb-3 text-gray-500">
        Категория: <span className="font-semibold">{template.category}</span>
      </div>
      <div className="mb-3 text-gray-600">{template.description}</div>
      <div className="mb-4">
        <div className="font-semibold mb-1">Шаги:</div>
        <ol className="list-decimal pl-5 space-y-1">
          {template.steps.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ol>
      </div>
      <div className="flex gap-2">
        <button className="btn-primary flex-1" onClick={() => onCopy(template)}>
          Скопировать к себе
        </button>
        <button className="btn-secondary flex-1" onClick={onClose}>
          Закрыть
        </button>
      </div>
    </div>
  </div>
);

export default TemplateDetails;
