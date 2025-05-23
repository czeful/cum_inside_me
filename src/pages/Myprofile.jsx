import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyProfile } from "../services/friends";
import Navbar from "../components/Navbar";

// Градиентная иконка пользователя
const GradientAvatar = ({ name }) => {
  const initial = name ? name[0].toUpperCase() : "U";
  // Можешь усложнить генератором цвета от имени
  return (
    <div className="w-28 h-28 rounded-full flex items-center justify-center text-5xl font-black
      bg-gradient-to-tr from-blue-500 via-fuchsia-400 to-emerald-400 text-white shadow-xl border-8 border-white ring-4 ring-blue-100
      absolute -top-14 left-1/2 -translate-x-1/2 select-none
      ">
      {initial}
    </div>
  );
};

const MyProfile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getMyProfile().then(res => setUser(res.data));
  }, []);

  if (!user) return (
    <div className="flex justify-center items-center min-h-[40vh] text-lg text-blue-600 bg-gradient-to-br from-gray-100 via-blue-50 to-emerald-50">
      Loading profile...
    </div>
  );

  const formatDate = d => d ? new Date(d).toLocaleDateString() : "-";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-emerald-50">
      <Navbar />
      <div className="max-w-2xl mx-auto mt-16 px-4">
        {/* Декоративная полупрозрачная фигура */}
        <div className="absolute -top-24 right-0 w-64 h-64 rounded-full bg-gradient-to-br from-blue-200/50 via-emerald-200/40 to-fuchsia-200/30 pointer-events-none blur-2xl" />
        <div className="relative flex flex-col items-center bg-white rounded-3xl shadow-2xl py-16 px-8 border border-blue-100 overflow-hidden">
          {/* Аватар с градиентом */}
          <GradientAvatar name={user.Username} />
          {/* Имя/email/роль */}
          <div className="mt-20 w-full text-center">
            <h2 className="text-3xl font-extrabold text-blue-900 mb-2 tracking-tight">{user.Username}</h2>
            <div className="text-gray-500 text-lg mb-1">{user.Email}</div>
            <span className="inline-block mt-2 px-4 py-1 rounded-full bg-blue-50 text-blue-700 text-base font-bold shadow">
              {user.Role?.toUpperCase() || "USER"}
            </span>
          </div>

          {/* Info */}
          <div className="mt-10 w-full grid grid-cols-1 md:grid-cols-2 gap-6 text-lg">
            <div className="flex flex-col gap-1 rounded-xl p-4 bg-gradient-to-tr from-blue-50 via-white to-emerald-50 shadow-inner border">
              <span className="font-semibold text-gray-700">ID пользователя:</span>
              <span className="text-blue-700 font-mono">{user._id || user.id || user.ID}</span>
            </div>
            <div className="flex flex-col gap-1 rounded-xl p-4 bg-gradient-to-tr from-blue-50 via-white to-fuchsia-50 shadow-inner border">
              <span className="font-semibold text-gray-700">Дата регистрации:</span>
              <span className="text-gray-600">{formatDate(user.CreatedAt)}</span>
            </div>
          </div>
          
          {/* Friends block */}
          <div className="mt-8 w-full bg-blue-50 rounded-xl p-6 shadow-inner border">
            <span className="font-semibold text-blue-700 text-lg flex items-center gap-2 mb-3">
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="9" /><path d="M8 16v-1a3 3 0 0 1 6 0v1"/><circle cx="11" cy="9" r="2.5"/></svg>
              Друзья
            </span>
            {user.friends && user.friends.length > 0 ? (
              <ul className="flex flex-wrap gap-3 mt-1">
                {user.friends.map(fid => (
                  <li key={fid} className="px-4 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-bold shadow">
                    {fid}
                  </li>
                ))}
              </ul>
            ) : (
              <span className="text-gray-400">У вас пока нет друзей</span>
            )}
          </div>

          {/* Действия */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full justify-center">
            <button
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-tr from-blue-500 to-fuchsia-500 text-white font-bold shadow-lg hover:scale-105 transition"
              onClick={() => alert("Edit profile coming soon!")}
            >
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" className="inline-block mr-1">
                <circle cx="11" cy="11" r="9" />
                <path d="M15 7l-8 8M9 7h6v6" />
              </svg>
              Edit Profile
            </button>
            <button
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-tr from-emerald-500 to-blue-400 text-white font-bold shadow-lg hover:scale-105 transition"
              onClick={() => navigate("/find-friend")}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" className="inline-block mr-1">
                <circle cx="10" cy="10" r="8" />
                <path d="M10 6v8M6 10h8" />
              </svg>
              Найти друга
            </button>
            <button
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-tr from-fuchsia-500 to-blue-600 text-white font-bold shadow-lg hover:scale-105 transition"
              onClick={() => navigate("/templates/my")}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" className="inline-block mr-1">
                <rect x="3" y="5" width="14" height="10" rx="2" />
                <path d="M7 9h6" />
              </svg>
              Мои шаблоны
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
