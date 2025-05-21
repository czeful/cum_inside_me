import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../services/api";
import Navbar from "../components/Navbar"

const categories = [
  "Health", "Career", "Education", "Personal", "Finance", "Hobby", "Relationships"
];

const GoalCreate = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    dueDate: "",
    steps: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const steps = form.steps
      .split(",")
      .map(s => s.trim())
      .filter(s => s.length > 0);

    try {
      await axios.post("/goals", {
        name: form.name,
        description: form.description,
        category: form.category,
        steps: steps,
        dueDate: new Date(form.dueDate).toISOString(),
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      navigate("/goals");
    } catch (err) {
      if (err.response) {
        alert("Ошибка: " + err.response.data);
      } else {
        alert("Network error");
      }
    }
  };

  return (
    <div>
        <Navbar/>
    <div className="max-w-lg mx-auto mt-12 p-8 bg-white dark:bg-neutral-900 rounded-2xl shadow-xl">
        
      <h2 className="text-2xl font-bold text-blue-700 mb-7 text-center">Create New Goal</h2>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">Goal Name</label>
          <input
            required
            className="input w-full"
            placeholder="Goal Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">Description</label>
          <textarea
            required
            className="input w-full min-h-[60px]"
            placeholder="Description"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">Category</label>
          <select
            required
            className="input w-full"
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
          >
            <option value="">Select Category</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">Due Date</label>
          <input
            type="date"
            className="input w-full"
            value={form.dueDate}
            onChange={e => setForm({ ...form, dueDate: e.target.value })}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">Steps <span className="text-xs text-gray-400">(comma-separated)</span></label>
          <input
            className="input w-full"
            placeholder="e.g. Research topic, Write plan, Finish project"
            value={form.steps}
            onChange={e => setForm({ ...form, steps: e.target.value })}
          />
        </div>
        <button type="submit" className="btn-primary w-full mt-2">
          Create Goal
        </button>
      </form>
    </div>
    </div>
  );
};

export default GoalCreate;

