import { useEffect, useState } from "react";
import {
  getFriendRequests,
  respondToFriendRequest,
} from "../services/friends";
import Navbar from "../components/Navbar";
import Footer from '../components/Footer';

// Генератор градиента для аватара по имени/ID
const getAvatarGradient = (str) => {
  const colors = [
    "from-blue-400 via-emerald-400 to-fuchsia-500",
    "from-purple-400 via-pink-400 to-orange-400",
    "from-yellow-400 via-orange-400 to-red-400",
    "from-sky-400 via-cyan-300 to-emerald-300",
    "from-blue-800 via-blue-500 to-blue-300"
  ];
  let sum = 0;
  for (let i = 0; i < str.length; i++) sum += str.charCodeAt(i);
  return `bg-gradient-to-tr ${colors[sum % colors.length]}`;
};

const FriendRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await getFriendRequests();
        setRequests(res.data || []);
      } catch {
        setRequests([]);
      }
    };
    fetchRequests();
  }, []);

  const accept = async (id) => {
    await respondToFriendRequest(id, true);
    setRequests(requests.filter(r => r.id !== id && r._id !== id));
  };

  const reject = async (id) => {
    await respondToFriendRequest(id, false);
    setRequests(requests.filter(r => r.id !== id && r._id !== id));
  };

  const safeRequests = requests || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-emerald-50">
      <Navbar />
      <div className="max-w-2xl mx-auto mt-14 mb-16 px-2">
        <div className="bg-white rounded-3xl shadow-2xl border border-blue-100 p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-3">
            <h2 className="text-3xl font-extrabold text-blue-800 tracking-tight">
              Friend requests
            </h2>
            <span className="text-blue-600 font-semibold text-lg">
              {safeRequests.length > 0
                ? `Всего: ${safeRequests.length}`
                : ""}
            </span>
          </div>

          {safeRequests.length === 0 ? (
            <div className="text-center text-gray-400 py-20 text-lg rounded-2xl bg-white/50 shadow-inner">
              There are no new friend requests.
            </div>
          ) : (
            <ul className="space-y-6">
              {safeRequests.map(req => {
                // Если есть имя/email, показываем красиво, иначе только id
                const sender = req.sender_name || req.sender_email || req.sender_id || req.email || req.id || req._id;
                const initial = typeof sender === "string" ? sender[0].toUpperCase() : "U";
                const avatarGradient = getAvatarGradient(sender);

                return (
                  <li
                    key={req._id || req.id}
                    className="relative flex items-center justify-between gap-5 p-5 bg-white/90 rounded-2xl shadow-xl border border-blue-50 hover:border-blue-400 hover:shadow-2xl transition-all group overflow-hidden"
                  >
                    {/* Фоновый градиент-декор */}
                    <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-20 bg-gradient-to-tr from-blue-300 via-emerald-200 to-fuchsia-400 pointer-events-none"></div>
                    {/* Аватарка */}
                    <div className={`w-14 h-14 flex items-center justify-center rounded-full font-bold text-2xl select-none shadow-lg border-4 border-white z-10 ${avatarGradient}`}>
                      {initial}
                    </div>
                    {/* Имя/email/id заявки */}
                    <div className="flex-1 z-10">
                      <div className="font-semibold text-lg text-gray-800 group-hover:text-blue-700 truncate">
                        {req.sender_name || req.sender_email || req.sender_id || "User"}
                      </div>
                      {req.sender_email && (
                        <div className="text-sm text-gray-500 truncate">{req.sender_email}</div>
                      )}
                      {req.sender_id && !req.sender_name && !req.sender_email && (
                        <div className="text-xs text-blue-500 opacity-80">ID: {req.sender_id}</div>
                      )}
                    </div>
                    {/* Кнопки */}
                    <div className="flex gap-2 z-10">
                      <button
                        className="px-4 py-2 rounded-xl bg-gradient-to-tr from-emerald-500 to-blue-500 text-white font-bold shadow hover:scale-105 transition"
                        onClick={() => accept(req._id || req.id)}
                      >
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" className="inline mr-1"><path d="M4 10l4 4 6-8" /></svg>
                        Accept
                      </button>
                      <button
                        className="px-4 py-2 rounded-xl bg-gradient-to-tr from-pink-400 to-orange-500 text-white font-bold shadow hover:scale-105 transition"
                        onClick={() => reject(req._id || req.id)}
                      >
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" className="inline mr-1"><path d="M6 6l6 6M6 12L12 6" /></svg>
                        Reject
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default FriendRequests;
