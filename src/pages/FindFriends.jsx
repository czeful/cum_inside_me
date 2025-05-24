import { useState, useEffect } from "react";
import { searchUsers, sendFriendRequest, getMyProfile } from "../services/friends";
import Navbar from "../components/Navbar";
import Footer from '../components/Footer';

// Функция для генерации цвета/градиента по имени/email
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

const FindFriends = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [myId, setMyId] = useState("");
  const [loading, setLoading] = useState(false);
  const [sendingId, setSendingId] = useState(null);
  const [successId, setSuccessId] = useState(null);

  useEffect(() => {
    getMyProfile().then((res) => setMyId(res.data.ID));
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await searchUsers(search);
      setUsers(res.data);
    } catch (err) {
      alert("Error searching for users");
    }
    setLoading(false);
  };

  const handleSendRequest = async (userId) => {
    setSendingId(userId);
    try {
      await sendFriendRequest(userId);
      setSuccessId(userId);
    } catch (err) {
      alert("Failed to submit request: " + (err.response?.data || err.message));
    }
    setSendingId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-emerald-50">
      <Navbar />
      <div className="max-w-2xl mx-auto mt-14 mb-16 px-2">
        <div className="bg-white rounded-3xl shadow-2xl border border-blue-100 p-10">
          <h2 className="text-3xl font-extrabold text-blue-800 tracking-tight mb-8 text-center flex items-center justify-center gap-2">
            <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="14" cy="14" r="12" />
              <path d="M18 16v-2a4 4 0 0 0-8 0v2" />
              <circle cx="14" cy="10" r="3" />
            </svg>
            Find Friends
          </h2>
          <form onSubmit={handleSearch} className="flex gap-2 mb-8 justify-center">
            <input
              className="flex-1 min-w-0 rounded-xl px-5 py-3 border border-blue-200 bg-white focus:outline-none focus:border-blue-500 text-lg shadow transition"
              type="text"
              placeholder="Name or email of user "
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              className="px-7 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-emerald-400 text-white font-bold text-lg shadow-lg hover:scale-105 hover:shadow-2xl transition"
              disabled={loading}
              type="submit"
            >
              {loading ? "Search..." : (
                <>
                  <svg width="21" height="21" fill="none" stroke="currentColor" strokeWidth="2" className="inline-block mr-1">
                    <circle cx="10" cy="10" r="8" />
                    <path d="M15 15l4 4" />
                  </svg>
                  Search
                </>
              )}
            </button>
          </form>

          {users.length === 0 && !loading && (
            <div className="text-center text-gray-400 py-20 text-lg rounded-2xl bg-white/60 shadow-inner">
              No one found
            </div>
          )}

          <ul className="space-y-6">
            {users
              .filter((u) => u.ID !== myId)
              .map((u) => {
                const avatarGradient = getAvatarGradient(u.Username + u.Email);
                const initial = u.Username ? u.Username[0].toUpperCase() : "U";
                return (
                  <li
                    key={u.ID}
                    className="flex items-center gap-5 p-5 bg-white/90 rounded-2xl shadow-xl border border-blue-50 hover:border-blue-400 hover:shadow-2xl transition-all group overflow-hidden relative"
                  >
                    <div className="absolute -top-10 -right-12 w-32 h-32 rounded-full opacity-25 pointer-events-none z-0 bg-gradient-to-tr from-blue-300 via-emerald-200 to-fuchsia-400"></div>
                    {/* Аватар */}
                    <div className={`w-14 h-14 flex items-center justify-center rounded-full font-bold text-2xl shadow-lg border-4 border-white z-10 ${avatarGradient}`}>
                      {initial}
                    </div>
                    {/* Инфо */}
                    <div className="flex-1 z-10">
                      <div className="font-semibold text-lg text-gray-800 group-hover:text-blue-700 truncate">
                        {u.Username}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" className="inline mr-0.5"><path d="M2 4l6 5 6-5" /><rect x="2" y="4" width="12" height="8" rx="2"/></svg>
                        {u.Email}
                      </div>
                    </div>
                    {/* Кнопка */}
                    <button
                      className={`ml-4 px-6 py-2 rounded-xl text-lg font-semibold transition shadow
                        ${successId === u.ID
                          ? "bg-emerald-500 text-white"
                          : "bg-blue-500 text-white hover:bg-blue-600"}
                        ${sendingId === u.ID && "opacity-70 pointer-events-none"}
                      `}
                      onClick={() => handleSendRequest(u.ID)}
                      disabled={sendingId === u.ID || successId === u.ID}
                    >
                      {successId === u.ID
                        ? (<><svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" className="inline mr-1"><path d="M4 10l4 4 6-8" /></svg>Request sent</>)
                        : sendingId === u.ID
                        ? "Отправка..."
                        : (<><svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" className="inline mr-1"><path d="M12 6v6m-3-3h6" /></svg>Add to friends</>)
                      }
                    </button>
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default FindFriends;
