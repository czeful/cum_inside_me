import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

// Компонент для поиска пользователя и приглашения в цель
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
    if (!userId || typeof userId !== 'string' || userId.length !== 24) {
      setMessage("Некорректный ID пользователя для приглашения.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post(
        `/goals/${goalId}/invite`,
        {
          collaborator_id: userId,
        },
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
    <div className="mb-6 mt-8 p-4 rounded-xl border border-blue-100 bg-blue-50">
      <h4 className="font-semibold mb-2">Invite a Friend</h4>
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
    </div>
  );
}

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

  // Обновить цель после приглашения или любых изменений
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
      window.location.reload();
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
      {
        step,
        done: !done,
      },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
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
      <div className="flex justify-center items-center min-h-[60vh]">
        Loading...
      </div>
    );
  if (!goal)
    return <div className="text-red-500 text-center mt-10">Goal not found</div>;

  return (
    <div>
      <Navbar />
      <div className="block bg-white shadow-md hover:shadow-lg rounded-2xl p-5 border border-neutral-200 transition group">
        {edit ? (
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdate();
            }}
          >
            <h2 className="text-2xl font-bold mb-4 text-blue-600">Edit Goal</h2>
            <div>
              <input
                className="w-full p-2 border border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white transition"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div>
              <textarea
                className="w-full min-h-[60px] p-2 border border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white transition"
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                required
              />
            </div>
            <div>
              <select
                className="w-full p-2 border border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white transition"
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
            </div>
            <div>
              <input
                className="w-full p-2 border border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white transition"
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              />
            </div>
            {/* Steps editor */}
            <div>
              <div className="font-medium mb-2">Steps</div>
              {form.steps.length === 0 && (
                <div className="mb-2 text-gray-400">No steps yet</div>
              )}
              {form.steps.map((step, idx) => (
                <div className="flex items-center gap-2 mb-2" key={idx}>
                  <input
                    className="w-full p-2 border border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white transition"
                    placeholder={`Step ${idx + 1}`}
                    value={step}
                    onChange={(e) => handleStepChange(idx, e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700 px-2 py-1"
                    onClick={() => handleRemoveStep(idx)}
                    title="Удалить шаг"
                  >
                    🗑️
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn-secondary mt-2"
                onClick={handleAddStep}
              >
                + Add step
              </button>
            </div>

            {/* Приглашение коллабораторов (только в Edit) */}
            <CollaboratorInvite goalId={id} onInvite={refreshGoal} />

            <div className="flex gap-3 mt-6">
              <button type="submit" className="btn-primary">
                Save
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setEdit(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-1">{goal.name}</h2>
            <div className="text-gray-500 text-sm mb-4">
              {goal.category && (
                <span className="mr-2 px-2 py-1 bg-blue-100 text-blue-600 rounded-xl">
                  {goal.category}
                </span>
              )}
              {goal.status && (
                <span className="mr-2 px-2 py-1 bg-green-100 text-green-600 rounded-xl">
                  {goal.status}
                </span>
              )}
              {goal.dueDate && (
                <span className="mr-2 px-2 py-1 bg-neutral-100 text-neutral-600 rounded-xl">
                  Due: {goal.dueDate.split("T")[0]}
                </span>
              )}
            </div>
            <p className="mb-4">{goal.description}</p>

            {/* Прогресс бар */}
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                <div
                  className="bg-green-500 h-2.5 rounded-full transition-all"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <span className="text-sm text-gray-600">
                {completedSteps} из {totalSteps} шагов ({percent}%) выполнено
              </span>
            </div>

            {/* Steps & Progress */}
            <div>
              <div className="font-medium mb-2">Steps & Progress:</div>
              {(!goal.steps || goal.steps.length === 0) && (
                <div className="text-gray-400">No steps yet</div>
              )}
              <ul className="space-y-2">
                {goal.steps &&
                  goal.steps.map((step, idx) => (
                    <li key={step} className="flex items-center gap-2">
                      <button
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                        ${
                          goal.progress[step]
                            ? "bg-green-400 border-green-500"
                            : "bg-white border-gray-300"
                        }
                        transition`}
                        onClick={() => toggleStep(step, goal.progress[step])}
                        title={
                          goal.progress[step]
                            ? "Mark as incomplete"
                            : "Mark as complete"
                        }
                      >
                        {goal.progress[step] ? (
                          <span className="text-white font-bold">✓</span>
                        ) : (
                          ""
                        )}
                      </button>
                      <span
                        className={
                          goal.progress[step]
                            ? "line-through text-gray-400"
                            : ""
                        }
                      >
                        {step}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>

            {/* Список коллабораторов (только просмотр, только ID) */}
            {Array.isArray(goal.collaborators) && goal.collaborators.length > 0 && (
              <div className="mb-5 mt-6">
                <div className="font-medium mb-1">Collaborators (IDs):</div>
                <ul className="list-disc list-inside text-gray-600">
                  {goal.collaborators.map((id, idx) => (
                    <li key={id || idx}>{id}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-3 mt-8">
              <button
                type="button"
                className="btn-primary"
                onClick={() => setEdit(true)}
              >
                Edit
              </button>
              <button
                type="button"
                className="btn-danger"
                onClick={handleDelete}
              >
                Delete
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate("/goals")}
              >
                Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalDetail;

