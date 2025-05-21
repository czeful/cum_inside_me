import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../services/api";
import Navbar from "../components/Navbar";

const categories = [
  "Health", "Career", "Education", "Personal", "Finance", "Hobby", "Relationships"
];

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
    steps: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGoal = async () => {
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
          steps: res.data.steps ? res.data.steps.join(", ") : "",
        });
      } catch (e) {
        alert("Failed to load goal");
      }
      setLoading(false);
    };
    fetchGoal();
    // eslint-disable-next-line
  }, [id]);

  const handleUpdate = async () => {
    const stepsArr = form.steps
      .split(",")
      .map(s => s.trim())
      .filter(s => s.length > 0);
    try {
      await axios.put(`/goals/${id}`, {
        name: form.name,
        description: form.description,
        category: form.category,
        dueDate: new Date(form.dueDate).toISOString(),
        steps: stepsArr,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
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
    await axios.put(`/goals/${id}/progress`, {
      step,
      done: !done,
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    // Refresh
    const res = await axios.get(`/goals/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setGoal(res.data);
  };

  if (loading) return <div className="flex justify-center items-center min-h-[60vh]">Loading...</div>;
  if (!goal) return <div className="text-red-500 text-center mt-10">Goal not found</div>;

  return (
    <div>
        <Navbar/>
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white dark:bg-neutral-900 rounded-2xl shadow-lg">
      {edit ? (
  <form
    className="space-y-3"
    onSubmit={e => {
      e.preventDefault();
      handleUpdate();
    }}
  >
    <h2 className="text-2xl font-bold mb-4 text-blue-600">Edit Goal</h2>
    <div>
      <input
        className="input w-full"
        placeholder="Name"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
        required
      />
    </div>
    <div>
      <textarea
        className="input w-full min-h-[60px]"
        placeholder="Description"
        value={form.description}
        onChange={e => setForm({ ...form, description: e.target.value })}
        required
      />
    </div>
    <div>
      <select
        className="input w-full"
        value={form.category}
        onChange={e => setForm({ ...form, category: e.target.value })}
        required
      >
        <option value="">Select Category</option>
        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
      </select>
    </div>
    <div>
      <input
        className="input w-full"
        type="date"
        value={form.dueDate}
        onChange={e => setForm({ ...form, dueDate: e.target.value })}
      />
    </div>
    <div>
      <input
        className="input w-full"
        placeholder="Steps (comma-separated)"
        value={form.steps}
        onChange={e => setForm({ ...form, steps: e.target.value })}
      />
    </div>
    <div className="flex gap-3 mt-6">
      <button type="submit" className="btn-primary">Save</button>
      <button type="button" className="btn-secondary" onClick={() => setEdit(false)}>Cancel</button>
    </div>
  </form>
) : (
        <div>
          <h2 className="text-2xl font-bold mb-1">{goal.name}</h2>
          <div className="text-gray-500 text-sm mb-4">
            {goal.category && <span className="mr-2 px-2 py-1 bg-blue-100 text-blue-600 rounded-xl">{goal.category}</span>}
            {goal.status && <span className="mr-2 px-2 py-1 bg-green-100 text-green-600 rounded-xl">{goal.status}</span>}
            {goal.dueDate && (
              <span className="mr-2 px-2 py-1 bg-neutral-100 text-neutral-600 rounded-xl">
                Due: {goal.dueDate.split("T")[0]}
              </span>
            )}
          </div>
          <p className="mb-4">{goal.description}</p>
          <div>
            <div className="font-medium mb-2">Steps & Progress:</div>
            <ul className="space-y-2">
              {goal.steps && goal.steps.map((step, idx) => (
                <li key={step} className="flex items-center gap-2">
                  <button
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                      ${goal.progress[step] ? "bg-green-400 border-green-500" : "bg-white border-gray-300"}
                      transition`}
                    onClick={() => toggleStep(step, goal.progress[step])}
                    title={goal.progress[step] ? "Mark as incomplete" : "Mark as complete"}
                  >
                    {goal.progress[step] ? <span className="text-white font-bold">✓</span> : ""}
                  </button>
                  <span className={goal.progress[step] ? "line-through text-gray-400" : ""}>{step}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex gap-3 mt-8">
            <button type="button" className="btn-primary" onClick={() => setEdit(true)}>Edit</button>
            <button type="button" className="btn-danger" onClick={handleDelete}>Delete</button>
            <button type="button" className="btn-secondary" onClick={() => navigate("/goals")}>Back</button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default GoalDetail;
