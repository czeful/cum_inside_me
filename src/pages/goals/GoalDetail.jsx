import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../services/api";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

// --- Категории с цветами
const badgeColors = {
  Health: "bg-emerald-100 text-emerald-600",
  Career: "bg-yellow-100 text-yellow-600",
  Education: "bg-indigo-100 text-indigo-600",
  Personal: "bg-pink-100 text-pink-600",
  Finance: "bg-blue-100 text-blue-600",
  Hobby: "bg-purple-100 text-purple-600",
  Relationships: "bg-orange-100 text-orange-600",
};

const categories = Object.keys(badgeColors);

// ---- Компонент для инвайта (тот же что и у тебя, чуть больше красоты)
function CollaboratorInvite({ goalId, onInvite }) {
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
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setFoundUsers(res.data || []);
      if ((res.data || []).length === 0) setMessage("No users found.");
    } catch (e) {
      setMessage("Ошибка поиска.");
    }
    setLoading(false);
  };

  const handleInvite = async (userId) => {
    if (!userId || typeof userId !== "string" || userId.length !== 24) {
      setMessage("Некорректный ID пользователя для приглашения.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post(
        `/goals/${goalId}/invite`,
        { collaborator_id: userId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setMessage(res.data?.message || "Invited!");
      setFoundUsers([]);
      setQuery("");
      if (onInvite) onInvite();
    } catch (e) {
      setMessage(e?.response?.data || "Ошибка приглашения.");
    }
    setLoading(false);
  };

  return (
    <div className="mb-8 mt-10 p-6 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 via-emerald-50 to-blue-100 shadow-inner">
      <h4 className="font-semibold mb-4 text-blue-700 text-lg flex items-center gap-2">
        <svg
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 17v-2a4 4 0 0 1 8 0v2" />
          <circle cx="10" cy="7" r="4" />
          <rect x="15" y="12" width="4" height="5" rx="2" />
        </svg>
        Invite a Friend
      </h4>
      <div className="flex gap-2">
        <input
          className="w-full rounded-xl px-4 py-2 border border-blue-200 bg-white focus:outline-none focus:border-blue-500 transition text-sm"
          placeholder="Search user by email or name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
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
        {Array.isArray(foundUsers) &&
          foundUsers.map((u, idx) => (
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
    </div>
  );
}

// --- Главная страница детали цели ---
const GoalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [goal, setGoal] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    dueDate: "",
    steps: [""],
  });
  const [loading, setLoading] = useState(true);

  const refreshGoal = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/goals/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setGoal(res.data);
      setForm({
        name: res.data.name || "",
        description: res.data.description || "",
        category: res.data.category || "",
        dueDate: res.data.dueDate ? res.data.dueDate.split("T")[0] : "",
        steps:
          res.data.steps && Array.isArray(res.data.steps) ? res.data.steps : [],
      });
    } catch (e) {
      alert("Failed to load goal");
    }
    setLoading(false);
  };

  useEffect(() => {
    refreshGoal();
    // eslint-disable-next-line
  }, [id]);

  const handleUpdate = async () => {
    const stepsArr = form.steps
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    try {
      await axios.put(
        `/goals/${id}`,
        {
          name: form.name,
          description: form.description,
          category: form.category,
          dueDate: new Date(form.dueDate).toISOString(),
          steps: stepsArr,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setEdit(false);
      refreshGoal();
    } catch (e) {
      alert(e?.response?.data || "Update error");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this goal?")) return;
    await axios.delete(`/goals/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    navigate("/goals");
  };

  const toggleStep = async (step, done) => {
    await axios.patch(
      `/goals/${id}/progress`,
      { step, done: !done },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    await refreshGoal();
  };

  // --- STEP MANAGEMENT for edit form ---
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

  // --- Progress bar calculation ---
  const totalSteps = goal?.steps?.length || 0;
  const completedSteps =
    goal?.steps?.filter((step) => goal.progress?.[step]).length || 0;
  const percent =
    totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-gradient-to-br from-gray-100 via-blue-50 to-emerald-50">
        <Navbar />
        <div className="text-lg text-blue-600">Loading...</div>
      </div>
    );
  if (!goal)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-emerald-50">
        <Navbar />
        <div className="text-red-500 text-center mt-10 text-xl font-bold">
          Goal not found
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-emerald-50">
      <Navbar />
      <div className="max-w-2xl mx-auto mt-10 mb-16 p-8 bg-white rounded-3xl shadow-2xl border border-blue-100">
        {edit ? (
          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdate();
            }}
          >
            <h2 className="text-3xl font-extrabold text-blue-800 mb-6">
              Edit Goal
            </h2>
            <input
              className="w-full rounded-xl px-4 py-3 border border-blue-200 bg-white focus:outline-none focus:border-blue-500 text-lg shadow-sm mb-2"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <textarea
              className="w-full min-h-[70px] rounded-xl px-4 py-3 border border-blue-200 bg-white focus:outline-none focus:border-blue-500 text-base shadow-sm mb-2"
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              required
            />
            <select
              className="w-full rounded-xl px-4 py-3 border border-blue-200 bg-white focus:outline-none focus:border-blue-500 text-base shadow-sm mb-2"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <input
              className="w-full rounded-xl px-4 py-3 border border-blue-200 bg-white focus:outline-none focus:border-blue-500 text-base shadow-sm mb-2"
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            />
            {/* Steps editor */}
            <div>
              <div className="font-medium mb-2 text-blue-700">Steps</div>
              {form.steps.length === 0 && (
                <div className="mb-2 text-gray-400">No steps yet</div>
              )}
              {form.steps.map((step, idx) => (
                <div className="flex items-center gap-2 mb-2" key={idx}>
                  <input
                    className="w-full rounded-xl px-4 py-2 border border-blue-200 bg-white focus:outline-none focus:border-blue-500 text-base shadow"
                    placeholder={`Step ${idx + 1}`}
                    value={step}
                    onChange={(e) => handleStepChange(idx, e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700 px-2 py-1 text-lg"
                    onClick={() => handleRemoveStep(idx)}
                    title="Удалить шаг"
                  >
                    🗑️
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="px-4 py-2 rounded-lg bg-blue-50 text-blue-600 font-semibold shadow hover:bg-blue-100 mt-2 transition"
                onClick={handleAddStep}
              >
                + Add step
              </button>
            </div>
            <CollaboratorInvite goalId={id} onInvite={refreshGoal} />
            <div className="flex gap-3 mt-6">
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-emerald-500 text-white font-bold text-lg shadow-lg hover:scale-105 hover:shadow-2xl transition"
              >
                Save
              </button>
              <button
                type="button"
                className="flex-1 py-3 rounded-xl bg-gray-100 border border-blue-200 text-blue-600 font-bold shadow hover:bg-blue-50 transition"
                onClick={() => setEdit(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <h2 className="text-3xl font-extrabold text-blue-800">
                {goal.name}
              </h2>
              {goal.category && (
                <span
                  className={`px-3 py-1 text-xs font-bold rounded-xl shadow-sm ${
                    badgeColors[goal.category] || "bg-blue-50 text-blue-400"
                  }`}
                >
                  {goal.category}
                </span>
              )}
              {goal.status && (
                <span className="px-3 py-1 text-xs font-bold rounded-xl bg-green-100 text-green-600">
                  {goal.status}
                </span>
              )}
              {goal.dueDate && (
                <span className="px-3 py-1 text-xs rounded-xl bg-neutral-100 text-neutral-600">
                  Due: {goal.dueDate.split("T")[0]}
                </span>
              )}
            </div>
            <div className="text-gray-700 mb-4 whitespace-pre-line">
              {goal.description}
            </div>
            {/* Прогресс-бар с градиентом */}
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-400 via-blue-400 to-fuchsia-400 h-3 transition-all"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <span className="text-sm text-gray-600">
                {completedSteps} from {totalSteps} steps ({percent}%) done
              </span>
            </div>
            {/* Steps */}
            <div>
              <div className="font-medium mb-2 text-blue-700">
                Steps & Progress:
              </div>
              {(!goal.steps || goal.steps.length === 0) && (
                <div className="text-gray-400">No steps yet</div>
              )}
              <ul className="space-y-2">
                {goal.steps &&
                  goal.steps.map((step, idx) => (
                    <li key={step} className="flex items-center gap-3">
                      <button
                        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center
                        ${
                          goal.progress[step]
                            ? "bg-gradient-to-tr from-emerald-400 to-blue-500 border-blue-500"
                            : "bg-white border-gray-300"
                        } transition`}
                        onClick={() => toggleStep(step, goal.progress[step])}
                        title={
                          goal.progress[step]
                            ? "Mark as incomplete"
                            : "Mark as complete"
                        }
                      >
                        {goal.progress[step] ? (
                          <span className="text-white font-bold text-lg">
                            ✓
                          </span>
                        ) : (
                          ""
                        )}
                      </button>
                      <span
                        className={`text-lg ${
                          goal.progress[step]
                            ? "line-through text-gray-400"
                            : ""
                        }`}
                      >
                        {step}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
            {/* Collaborators с аватарками */}
            {Array.isArray(goal.collaborators) &&
              goal.collaborators.length > 0 && (
                <div className="mb-5 mt-7">
                  <div className="font-medium mb-2 text-blue-700">
                    Collaborators:
                  </div>
                  <ul className="flex flex-wrap gap-2">
                    {goal.collaborators.map((id, idx) => {
                      // Фейковый аватар по id/email
                      const initials =
                        typeof id === "string" && id.includes("@")
                          ? id[0].toUpperCase()
                          : String(id).slice(0, 2).toUpperCase();
                      return (
                        <li
                          key={id || idx}
                          className="flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-xl shadow text-blue-700 font-bold text-sm"
                        >
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-tr from-blue-400 via-fuchsia-400 to-emerald-400 text-white font-bold">
                            {initials}
                          </span>
                          <span className="max-w-[120px] truncate">{id}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            <div className="flex gap-3 mt-8">
              <button
                type="button"
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-emerald-500 text-white font-bold text-lg shadow-lg hover:scale-105 hover:shadow-2xl transition"
                onClick={() => setEdit(true)}
              >
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="inline-block mr-1"
                >
                  <path d="M15 6l-1.5-1.5a2.12 2.12 0 0 0-3 0l-6 6a2.12 2.12 0 0 0 0 3L6 15a2.12 2.12 0 0 0 3 0l6-6a2.12 2.12 0 0 0 0-3z" />
                </svg>
                Edit
              </button>
              <button
                type="button"
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 text-white font-bold text-lg shadow hover:scale-105 transition"
                onClick={handleDelete}
              >
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="inline-block mr-1"
                >
                  <path d="M6 6h12M6 6l1-1a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2l1 1m-8 0v10m4-10v10" />
                </svg>
                Delete
              </button>
              <button
                type="button"
                className="flex-1 py-3 rounded-xl bg-gray-100 border border-blue-200 text-blue-600 font-bold text-lg shadow hover:bg-blue-50 transition"
                onClick={() => navigate("/goals")}
              >
                Back
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default GoalDetail;
