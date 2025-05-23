import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../services/api";
import Navbar from "../components/Navbar";

const categories = [
  "Health", "Career", "Education", "Personal", "Finance", "Hobby", "Relationships",
];

// Современный select коллабораторов
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
    <div className="mb-8 mt-10 p-6 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 via-emerald-50 to-blue-100 shadow-inner">
      <h4 className="font-semibold mb-4 text-blue-700 text-lg flex items-center gap-2">
        <svg width="21" height="21" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 17v-2a4 4 0 0 1 8 0v2"/><circle cx="10" cy="7" r="4"/><rect x="17" y="11" width="4" height="6" rx="2"/></svg>
        Add friends to this goal
      </h4>
      <div className="flex gap-2">
        <input
          className="w-full rounded-xl px-4 py-2 border border-blue-200 bg-white focus:outline-none focus:border-blue-500 transition text-sm"
          placeholder="Search user by email or name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
        />
        <button
          type="button"
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-emerald-400 text-white font-bold shadow hover:scale-105 transition"
          onClick={handleSearch}
          disabled={loading || !query.trim()}
        >
          {loading ? "..." : "Search"}
        </button>
      </div>
      {message && <div className="mt-2 text-sm text-blue-600">{message}</div>}
      <ul className="mt-3 space-y-1">
        {Array.isArray(foundUsers) && foundUsers.map((u, idx) => (
          <li
            key={u._id || u.email || u.ID}
            className="flex justify-between items-center bg-white px-4 py-2 rounded-xl shadow border border-blue-100"
          >
            <span className="font-medium text-gray-700">
              {u.name || u.Username || u.email || u.Email}
            </span>
            <button
              type="button"
              className="px-2 py-1 rounded bg-emerald-100 text-emerald-700 text-xs font-semibold hover:bg-emerald-200 transition"
              onClick={() => handleInvite(u._id || u.id || u.ID)}
              disabled={loading}
            >
              Invite
            </button>
          </li>
        ))}
      </ul>
      {collaborators.length > 0 && (
        <div className="mt-4">
          <div className="font-medium mb-2 text-blue-700">Added friends:</div>
          <ul className="flex flex-wrap gap-2">
            {collaborators.map((id) => (
              <li key={id} className="bg-blue-100 px-4 py-1 rounded-xl flex items-center gap-2 text-blue-700 text-sm shadow">
                <span>{id}</span>
                <button type="button" className="text-red-500 hover:text-red-700 text-lg" onClick={() => handleRemoveCollaborator(id)}>×</button>
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
          collaborators: form.collaborators,
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
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-emerald-50">
      <Navbar />
      <div className="max-w-xl mx-auto mt-12 mb-16 p-10 bg-white rounded-3xl shadow-2xl border border-blue-100">
        <h2 className="text-3xl font-extrabold text-blue-800 mb-8 text-center tracking-tight">
          <span className="inline-flex items-center gap-2">
            <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="16" cy="16" r="12" /><path d="M16 10v7l4 2" /></svg>
            Create New Goal
          </span>
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit} autoComplete="off">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Goal Name</label>
            <input
              required
              className="w-full rounded-xl px-4 py-3 border border-blue-200 bg-white focus:outline-none focus:border-blue-500 text-lg shadow-sm"
              placeholder="For example: Read 20 books"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Description</label>
            <textarea
              required
              className="w-full min-h-[70px] rounded-xl px-4 py-3 border border-blue-200 bg-white focus:outline-none focus:border-blue-500 text-base shadow-sm"
              placeholder="Describe your goal in detail"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Category</label>
            <select
              required
              className="w-full rounded-xl px-4 py-3 border border-blue-200 bg-white focus:outline-none focus:border-blue-500 text-base shadow-sm"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Due Date</label>
            <input
              type="date"
              className="w-full rounded-xl px-4 py-3 border border-blue-200 bg-white focus:outline-none focus:border-blue-500 text-base shadow-sm"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            />
          </div>
          {/* Steps */}
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
                  className="w-full rounded-xl px-4 py-2 border border-blue-200 bg-white focus:outline-none focus:border-blue-500 text-base shadow"
                  placeholder={`Step ${idx + 1}`}
                  value={step}
                  onChange={e => handleStepChange(idx, e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="text-red-500 hover:text-red-700 text-lg px-2 py-1"
                  onClick={() => handleRemoveStep(idx)}
                  title="Удалить шаг"
                >🗑️</button>
              </div>
            ))}
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-blue-50 text-blue-600 font-semibold shadow hover:bg-blue-100 mt-2 transition"
              onClick={handleAddStep}
            >+ Add step</button>
          </div>
          
          {/* Collaborators */}
          <CollaboratorSelect
            collaborators={form.collaborators}
            setCollaborators={(collabs) => setForm({ ...form, collaborators: collabs })}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-emerald-500 text-white font-bold text-lg shadow-lg hover:scale-105 hover:shadow-2xl transition disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Goal"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GoalCreate;
