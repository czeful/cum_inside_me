import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../services/api";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const badgeColors = {
  Health: "bg-emerald-100 text-emerald-600",
  Career: "bg-yellow-100 text-yellow-600",
  Education: "bg-indigo-100 text-indigo-600",
  Personal: "bg-pink-100 text-pink-600",
  Finance: "bg-blue-100 text-blue-600",
  Hobby: "bg-purple-100 text-purple-600",
  Relationships: "bg-orange-100 text-orange-600",
};

const statusColors = {
  done: "bg-green-100 text-green-700",
  progress: "bg-blue-100 text-blue-600",
  pending: "bg-gray-100 text-gray-500",
  failed: "bg-red-100 text-red-600",
};

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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-100 via-blue-50 to-emerald-50">
      <Navbar />
      <main className="w-full flex-1 flex flex-col items-center justify-start">
        <div className="w-full max-w-xs sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl px-2 sm:px-4 md:px-8 py-8 sm:py-10 mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-blue-800 tracking-tight mb-1">
                My Goals
              </h2>
              <div className="text-gray-500 text-sm sm:text-base">
                Your personal goals and achievements
              </div>
            </div>
            <Link
              to="/goals/new"
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-tr from-emerald-500 to-blue-400 text-white font-semibold shadow-lg hover:scale-105 hover:shadow-2xl active:scale-100 transition-all duration-200 text-sm sm:text-base"
            >
              <svg
                width="22"
                height="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="9" />
                <path d="M11 7v8M7 11h8" strokeLinecap="round" />
              </svg>
              New Goal
            </Link>
          </div>
          {goals.length === 0 ? (
            <div className="text-center text-gray-400 py-16 text-base sm:text-xl rounded-2xl bg-white/50 shadow-inner mx-auto max-w-md">
              You don't have any goals yet.
              <br />
              <Link
                to="/goals/new"
                className="text-blue-600 hover:underline font-semibold"
              >
                Создайте свою первую цель
              </Link>
            </div>
          ) : (
            <ul className="
              grid 
              grid-cols-1 
              sm:grid-cols-2 
              xl:grid-cols-3 
              gap-5 
              sm:gap-8
            ">
              {goals.map((goal) => (
                <li key={goal.id || goal._id} className="h-full flex">
                  <Link
                    to={`/goals/${goal.id || goal._id}`}
                    className="
                      group block bg-white/90 rounded-3xl p-5 sm:p-6 shadow-xl border border-blue-100 
                      hover:shadow-2xl hover:-translate-y-1 transition-all duration-200 relative overflow-hidden
                      min-h-[210px] sm:min-h-[260px] h-full flex flex-col
                    "
                  >
                    {/* Декоративный градиент */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-blue-400 via-emerald-200 to-fuchsia-300 opacity-20 rounded-full pointer-events-none z-0"></div>
                    <div className="flex items-center justify-between mb-1 z-10 relative">
                      <span className="text-lg sm:text-xl font-bold group-hover:text-blue-600 transition-all truncate max-w-[160px]">
                        {goal.name}
                      </span>
                      {goal.category && (
                        <span
                          className={`ml-2 px-3 py-1 text-xs font-bold rounded-xl shadow-sm whitespace-nowrap ${
                            badgeColors[goal.category] ||
                            "bg-blue-50 text-blue-400"
                          }`}
                        >
                          {goal.category}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-2 z-10">
                      {goal.dueDate && (
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-gray-500 font-semibold">
                          <svg
                            width="15"
                            height="15"
                            className="inline-block mr-1"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <rect x="2" y="3" width="11" height="9" rx="2" />
                            <path d="M2 6h11" />
                          </svg>
                          {goal.dueDate.split("T")[0]}
                        </span>
                      )}
                      {goal.status && (
                        <span
                          className={`text-xs px-2 py-0.5 rounded font-semibold ${
                            statusColors[goal.status] ||
                            "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {goal.status === "done"
                            ? "Завершено"
                            : goal.status === "progress"
                            ? "В процессе"
                            : goal.status === "pending"
                            ? "Ожидание"
                            : goal.status}
                        </span>
                      )}
                    </div>
                    {goal.description && (
                      <div className="text-sm text-gray-700 mt-1 mb-1 line-clamp-3 z-10 relative max-h-[56px] overflow-hidden">
                        {goal.description}
                      </div>
                    )}
                    {/* Steps preview */}
                    {Array.isArray(goal.steps) && goal.steps.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-auto z-10 relative">
                        {goal.steps.slice(0, 3).map((step, i) => (
                          <span
                            key={i}
                            className="bg-blue-50 text-blue-500 px-2 py-0.5 rounded-full text-xs"
                          >
                            {step}
                          </span>
                        ))}
                        {goal.steps.length > 3 && (
                          <span className="bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full text-xs">
                            +{goal.steps.length - 3} steps
                          </span>
                        )}
                      </div>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GoalsList;
