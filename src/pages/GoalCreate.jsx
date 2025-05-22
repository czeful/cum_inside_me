import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../services/api";
import Navbar from "../components/Navbar";

const categories = [
  "Health",
  "Career",
  "Education",
  "Personal",
  "Finance",
  "Hobby",
  "Relationships",
];

// Компонент выбора коллабораторов для новой цели
function CollaboratorSelect({ collaborators, setCollaborators }) {
  const [query, setQuery] = useState("");
  const [foundUsers, setFoundUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSearch = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.get(
        `/users/search?query=${encodeURIComponent(query)}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setFoundUsers(res.data || []);
      if ((res.data || []).length === 0) setMessage("No users found.");
    } catch (e) {
      setMessage("Ошибка поиска.");
    }
    setLoading(false);
  };

  const handleInvite = (userId) => {
    if (!userId) return;
    if (collaborators.includes(userId)) {
      setMessage("Пользователь уже добавлен.");
      return;
    }
    setCollaborators([...collaborators, userId]);
    setFoundUsers([]);
    setQuery("");
  };

  const handleRemoveCollaborator = (userId) => {
    setCollaborators(collaborators.filter((id) => id !== userId));
  };

  return (
    <div className="mb-6 mt-8 p-4 rounded-xl border border-blue-100 bg-blue-50">
      <h4 className="font-semibold mb-2">Add friends to this goal</h4>
      <div className="flex gap-2">
        <input
          className="w-full rounded-lg px-3 py-2 border border-blue-200 bg-white focus:outline-none focus:border-blue-500 transition"
          placeholder="Search user by email or name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="button"
          className="btn-primary px-3"
          onClick={handleSearch}
          disabled={loading || !query.trim()}
        >
          Search
        </button>
      </div>
      {message && <div className="mt-2 text-sm text-blue-600">{message}</div>}
      <ul className="mt-3 space-y-1">
        {Array.isArray(foundUsers) && foundUsers.map((u, idx) => (
          <li
            key={u._id || u.email || u.ID}
            className="flex justify-between items-center bg-white p-2 rounded"
          >
            <span>
              {u.name || u.Username || u.email || u.Email}
            </span>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => handleInvite(u._id || u.id || u.ID)}
              disabled={loading}
            >
              Invite
            </button>
          </li>
        ))}
      </ul>
      {/* Показать выбранных коллабораторов */}
      {collaborators.length > 0 && (
        <div className="mt-3">
          <div className="font-medium mb-1">Added friends:</div>
          <ul className="flex flex-wrap gap-2">
            {collaborators.map((id) => (
              <li key={id} className="bg-blue-100 px-3 py-1 rounded-xl flex items-center gap-2">
                {id}
                <button type="button" className="text-red-500" onClick={() => handleRemoveCollaborator(id)}>×</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const GoalCreate = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    dueDate: "",
    steps: [""],
    collaborators: [],
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Управление шагами (steps) как массив строк
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

    const stepsArr = form.steps
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    try {
      await axios.post(
        "/goals",
        {
          name: form.name,
          description: form.description,
          category: form.category,
          steps: stepsArr,
          dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
          collaborators: form.collaborators, // Передаем коллабораторов на бэкенд
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      navigate("/goals");
    } catch (err) {
      setLoading(false);
      if (err.response) {
        alert("Ошибка: " + (err.response.data?.message || err.response.data));
      } else {
        alert("Network error");
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-lg mx-auto mt-12 p-8 bg-white rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-blue-700 mb-7 text-center">
          Create New Goal
        </h2>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Goal Name
            </label>
            <input
              required
              className="w-full rounded-lg px-4 py-2 border border-blue-200 bg-white focus:outline-none focus:border-blue-500 transition"
              placeholder="Goal Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Description
            </label>
            <textarea
              required
              className="w-full min-h-[60px] rounded-lg px-4 py-2 border border-blue-200 bg-white focus:outline-none focus:border-blue-500 transition"
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Category
            </label>
            <select
              required
              className="w-full rounded-lg px-4 py-2 border border-blue-200 bg-white focus:outline-none focus:border-blue-500 transition"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Due Date
            </label>
            <input
              type="date"
              className="w-full rounded-lg px-4 py-2 border border-blue-200 bg-white focus:outline-none focus:border-blue-500 transition"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            />
          </div>
          {/* Новый редактор шагов */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Steps <span className="text-xs text-gray-400">(one per field)</span>
            </label>
            {form.steps.length === 0 && (
              <div className="mb-2 text-gray-400">No steps yet</div>
            )}
            {form.steps.map((step, idx) => (
              <div className="flex items-center gap-2 mb-2" key={idx}>
                <input
                  className="w-full rounded-lg px-4 py-2 border border-blue-200 bg-white focus:outline-none focus:border-blue-500 transition"
                  placeholder={`Step ${idx + 1}`}
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
            >+ Add step</button>
          </div>
          
          {/* ===== Коллабораторы ===== */}
          <CollaboratorSelect
            collaborators={form.collaborators}
            setCollaborators={(collabs) => setForm({ ...form, collaborators: collabs })}
          />

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-2 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Goal"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GoalCreate;
