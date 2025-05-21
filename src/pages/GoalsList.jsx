import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../services/api";
import Navbar from "../components/Navbar";

const GoalsList = () => {
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const res = await axios.get("/goals", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setGoals(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setGoals([]);
      }
    };
    fetchGoals();
  }, []);

  return (
    <div>
        <Navbar/>
    <div className="max-w-2xl mx-auto mt-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-blue-700">My Goals</h2>
        <Link
          to="/goals/new"
          className="btn-primary"
        >
          + Create New Goal
        </Link>
      </div>
      {goals.length === 0 ? (
        <div className="text-center text-gray-400 py-12">
          You have no goals yet. <br />
          <Link to="/goals/new" className="text-blue-600 hover:underline">Create your first goal</Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {goals.map((goal) => (
            <li key={goal.id || goal._id}>
              <Link
                to={`/goals/${goal.id || goal._id}`}
                className="block bg-white dark:bg-neutral-900 shadow-md hover:shadow-lg rounded-2xl p-5 border border-neutral-200 dark:border-neutral-800 transition group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl font-semibold group-hover:text-blue-600">{goal.name}</span>
                  {goal.category && (
                    <span className="px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded-xl ml-2">
                      {goal.category}
                    </span>
                  )}
                </div>
                {goal.dueDate && (
                  <div className="text-xs mt-2 text-gray-500">
                    Deadline: {goal.dueDate.split("T")[0]}
                  </div>
                )}
                {goal.status && (
                  <div className="text-xs mt-1 text-green-500">
                    {goal.status}
                  </div>
                )}
                {goal.description && (
                  <div className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {goal.description}
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
    </div>
  );
};

export default GoalsList;


