import React, { useState } from "react";
import axios from "../../services/api";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";

const categories = [
  "Health", "Career", "Education", "Personal", "Finance", "Hobby", "Relationships"
];

const TemplateCreatePage = ({ onCreated }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    steps: [""],
    public: true,
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // Управление шагами
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Подготовим steps (убираем пустые)
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
      setMsg("Шаблон успешно создан!");
      setTimeout(() => {
        navigate("/templates/my");
        if (onCreated) onCreated();
      }, 1500);
    } catch (err) {
      setMsg("Ошибка создания шаблона");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-xl mx-auto mt-12 mb-12 p-8 bg-white rounded-2xl shadow-xl">
        <h3 className="text-2xl font-bold mb-6 text-blue-600 text-center">
          Создать новый шаблон
        </h3>
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
            <select
              className="w-full rounded-lg px-4 py-2 border border-blue-200"
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
              required
            >
              <option value="">Выбери категорию</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
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
            {form.steps.length === 0 && (
              <div className="mb-2 text-gray-400">Нет шагов</div>
            )}
            {form.steps.map((step, idx) => (
              <div className="flex items-center gap-2 mb-2" key={idx}>
                <input
                  className="w-full rounded-lg px-4 py-2 border border-blue-200"
                  placeholder={`Шаг ${idx + 1}`}
                  value={step}
                  onChange={e => handleStepChange(idx, e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="text-red-500 hover:text-red-700 px-2 py-1"
                  onClick={() => handleRemoveStep(idx)}
                  title="Удалить шаг"
                >🗑️</button>
              </div>
            ))}
            <button
              type="button"
              className="btn-secondary mt-2"
              onClick={handleAddStep}
            >+ Добавить шаг</button>
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

export default TemplateCreatePage;
