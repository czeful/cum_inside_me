import React, { useState } from "react";
import axios from "../../services/api";

const TemplateCreateModal = ({ goal, onClose, onCreated }) => {
  const [form, setForm] = useState({
    title: goal.name || "",
    description: goal.description || "",
    category: goal.category || "",
    steps: goal.steps || [],
    public: true,
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        "/templates",
        { ...form },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setMsg("Шаблон успешно создан!");
      setTimeout(() => {
        onClose();
        if (onCreated) onCreated();
      }, 1500);
    } catch (err) {
      setMsg("Ошибка создания шаблона");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-red-400 text-2xl"
          onClick={onClose}
          aria-label="Закрыть"
        >×</button>
        <h3 className="text-2xl font-bold mb-4 text-blue-600">Сохранить цель как шаблон</h3>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="font-medium">Название</label>
            <input
              className="w-full rounded-lg px-4 py-2 border border-blue-200"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="font-medium">Описание</label>
            <textarea
              className="w-full rounded-lg px-4 py-2 border border-blue-200"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="font-medium">Категория</label>
            <input
              className="w-full rounded-lg px-4 py-2 border border-blue-200"
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="font-medium">Публичный шаблон?</label>
            <input
              type="checkbox"
              className="ml-2 align-middle"
              checked={form.public}
              onChange={e => setForm({ ...form, public: e.target.checked })}
            /> <span className="text-sm text-gray-600">(Будет доступен всем)</span>
          </div>
          <div>
            <label className="font-medium">Шаги</label>
            <ol className="list-decimal pl-6 space-y-1">
              {form.steps.map((s, i) => <li key={i}>{s}</li>)}
            </ol>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-2 py-3"
          >{loading ? "Создание..." : "Создать шаблон"}</button>
          {msg && <div className="mt-3 text-green-600">{msg}</div>}
        </form>
      </div>
    </div>
  );
};

export default TemplateCreateModal;
